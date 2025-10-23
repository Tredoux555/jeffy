import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId') as string;
    const imageIndex = data.get('imageIndex') as string;

    console.log('📤 Upload API called:', { 
      productId, 
      imageIndex, 
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userAgent: request.headers.get('user-agent')?.includes('Mobile') ? 'Mobile' : 'Desktop'
    });

    if (!file) {
      console.error('❌ No file uploaded');
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB for mobile, 20MB for desktop)
    const isMobile = request.headers.get('user-agent')?.includes('Mobile');
    const maxSize = isMobile ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB mobile, 10MB desktop
    
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'max:', maxSize);
      return NextResponse.json({ 
        success: false, 
        error: `File too large. Maximum size is ${isMobile ? '5MB' : '10MB'}.` 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename based on product ID and image index
    const safeProductId = productId || 'temp';
    const safeImageIndex = imageIndex || '0';
    const timestamp = Date.now();
    
    // Determine file extension from MIME type
    const extension = file.type === 'image/png' ? 'png' : 
                    file.type === 'image/webp' ? 'webp' : 'jpg';
    
    const filename = `product-${safeProductId}-${safeImageIndex}-${timestamp}.${extension}`;

    // Try Supabase Storage first, fallback to local storage
    try {
      if (supabase) {
        console.log('🔄 Attempting to upload to Supabase Storage...');
        
        // Try to upload to the bucket (without public/ prefix)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          
          // If bucket doesn't exist, try to create it
          if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
            console.log('🔄 Bucket not found, attempting to create it...');
            
            const { error: createError } = await supabase.storage
              .createBucket('product-images', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                fileSizeLimit: 10 * 1024 * 1024, // 10MB
              });

            if (createError) {
              console.error('Failed to create bucket:', createError);
              throw new Error('Supabase bucket creation failed: ' + createError.message);
            }

            // Retry upload after creating bucket
            const { data: retryData, error: retryError } = await supabase.storage
              .from('product-images')
              .upload(filename, buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
              });

            if (retryError) {
              console.error('Retry upload failed:', retryError);
              throw new Error('Supabase upload failed after bucket creation: ' + retryError.message);
            }

            // Get public URL for retry
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(filename);

            console.log('✅ File uploaded to Supabase Storage (after bucket creation):', urlData.publicUrl);

            return NextResponse.json({ 
              success: true, 
              filename: urlData.publicUrl,
              originalName: file.name,
              size: file.size,
              type: file.type,
              isMobile: isMobile,
              storage: 'supabase'
            });
          } else {
            throw new Error('Supabase upload failed: ' + uploadError.message);
          }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename);

        console.log('✅ File uploaded to Supabase Storage:', urlData.publicUrl);

        return NextResponse.json({ 
          success: true, 
          filename: urlData.publicUrl,
          originalName: file.name,
          size: file.size,
          type: file.type,
          isMobile: isMobile,
          storage: 'supabase'
        });
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase Storage not available, using local storage:', supabaseError);
      
      // Fallback: Save to local public folder
      const filePath = join(process.cwd(), 'public', 'products', filename);
      console.log('💾 Saving file to:', filePath);
      await writeFile(filePath, buffer);

      const imagePath = `/products/${filename}`;
      console.log('✅ File saved locally:', imagePath);

      return NextResponse.json({ 
        success: true, 
        filename: imagePath,
        originalName: file.name,
        size: file.size,
        type: file.type,
        isMobile: isMobile,
        storage: 'local'
      });
    }
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}