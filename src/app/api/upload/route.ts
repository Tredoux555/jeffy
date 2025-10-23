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
        
        // First, check if bucket exists and create if needed
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('Error listing buckets:', listError);
          throw new Error('Cannot access Supabase Storage: ' + listError.message);
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === 'product-images');
        
        if (!bucketExists) {
          console.log('🔄 Bucket "product-images" not found, creating it...');
          
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
          
          console.log('✅ Bucket "product-images" created successfully');
        } else {
          console.log('✅ Bucket "product-images" already exists');
        }
        
        // Now upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw new Error('Supabase upload failed: ' + uploadError.message);
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
      console.log('⚠️ Supabase Storage failed:', supabaseError);
      
      // For Vercel, we can't use local storage, so return an error
      return NextResponse.json({ 
        success: false, 
        error: 'Image upload failed. Please check your Supabase configuration. Error: ' + (supabaseError as Error).message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}