import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called');
    console.log('📋 Request headers:', Object.fromEntries(request.headers.entries()));
    
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId') as string;
    const imageIndex = data.get('imageIndex') as string;

    console.log('📦 Form data received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      productId,
      imageIndex
    });

    // Better mobile detection
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = userAgent.includes('Mobile') || 
                    userAgent.includes('Android') || 
                    userAgent.includes('iPhone') || 
                    userAgent.includes('iPad') ||
                    userAgent.includes('iPod');
    
    console.log('📱 Device detection:', { 
      userAgent: userAgent.substring(0, 100), 
      isMobile,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });

    if (!file) {
      console.error('❌ No file uploaded');
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file size (more generous limits for mobile)
    const maxSize = isMobile ? 10 * 1024 * 1024 : 20 * 1024 * 1024; // 10MB mobile, 20MB desktop
    
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'max:', maxSize);
      return NextResponse.json({ 
        success: false, 
        error: `File too large. Maximum size is ${isMobile ? '10MB' : '20MB'}. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` 
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

    // Try Supabase Storage with admin client (service role key)
    try {
      console.log('🔍 Checking Supabase admin client...');
      console.log('🔍 Supabase admin client exists:', !!supabaseAdmin);
      
      if (!supabaseAdmin) {
        console.error('❌ Supabase admin client not configured');
        console.error('❌ Environment variables:', {
          NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          NEXT_PUBLIC_SUPABASE_SERVICE_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY,
          SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        });
        
        return NextResponse.json({ 
          success: false, 
          error: 'Image upload service not configured. Please check Supabase service role key.' 
        }, { status: 500 });
      }
      
      console.log('🔄 Attempting to upload to Supabase Storage with admin client...');
      console.log('📦 Upload details:', {
        filename,
        fileSize: file.size,
        fileType: file.type,
        bufferSize: buffer.length,
        isMobile
      });
        
        // Set a timeout for the upload operation (longer for mobile)
        const timeoutDuration = isMobile ? 60000 : 30000; // 60s mobile, 30s desktop
        
        const uploadPromise = supabaseAdmin.storage
          .from('product-images')
          .upload(filename, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Upload timeout after ${timeoutDuration/1000} seconds`)), timeoutDuration)
        );

        const { data: uploadData, error: uploadError } = await Promise.race([
          uploadPromise,
          timeoutPromise
        ]) as any;

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          
          // If bucket doesn't exist, try to create it quickly
          if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
            console.log('🔄 Bucket not found, creating it with admin client...');
            
            const createPromise = supabaseAdmin.storage
              .createBucket('product-images', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                fileSizeLimit: 10 * 1024 * 1024, // 10MB
              });

            const createTimeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Bucket creation timeout')), 15000)
            );

            const { error: createError } = await Promise.race([
              createPromise,
              createTimeoutPromise
            ]) as any;

            if (createError) {
              console.error('Failed to create bucket:', createError);
              throw new Error('Supabase bucket creation failed: ' + createError.message);
            }
            
            console.log('✅ Bucket created, retrying upload...');
            
            // Retry upload with timeout
            const retryPromise = supabaseAdmin.storage
              .from('product-images')
              .upload(filename, buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
              });

            const retryTimeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Retry upload timeout')), 30000)
            );

            const { data: retryData, error: retryError } = await Promise.race([
              retryPromise,
              retryTimeoutPromise
            ]) as any;

            if (retryError) {
              console.error('Retry upload failed:', retryError);
              throw new Error('Supabase upload failed after bucket creation: ' + retryError.message);
            }

            // Get public URL for retry
            const { data: urlData } = supabaseAdmin.storage
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
              storage: 'supabase-admin'
            });
          } else {
            throw new Error('Supabase upload failed: ' + uploadError.message);
          }
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(filename);

        console.log('✅ File uploaded to Supabase Storage:', urlData.publicUrl);
        console.log('🔍 Upload data:', uploadData);
        console.log('🔍 URL data:', urlData);

        return NextResponse.json({ 
          success: true, 
          filename: urlData.publicUrl,
          originalName: file.name,
          size: file.size,
          type: file.type,
          isMobile: isMobile,
          storage: 'supabase-admin'
        });
      } else {
        throw new Error('Supabase admin client not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase Storage failed:', supabaseError);
      
      // Fallback: Save to local file system
      console.log('🔄 Saving to local file system as fallback...');
      
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await fs.mkdir(uploadsDir, { recursive: true });
        } catch (err) {
          // Directory might already exist
        }
        
        // Save file to local storage
        const filePath = path.join(uploadsDir, filename);
        await fs.writeFile(filePath, buffer);
        
        const localUrl = `/uploads/${filename}`;
        console.log('✅ Saved to local storage:', localUrl);
        
        return NextResponse.json({ 
          success: true, 
          filename: localUrl,
          originalName: file.name,
          size: file.size,
          type: file.type,
          isMobile: isMobile,
          storage: 'local-fallback',
          warning: 'Supabase upload failed, using local storage'
        });
      } catch (localError) {
        console.error('❌ Local storage also failed:', localError);
        
        // Final fallback: Create placeholder image URL
        console.log('🔄 Creating placeholder image as final fallback...');
        
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
        const color = colors[parseInt(imageIndex || '0') % colors.length];
        const placeholderUrl = `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${encodeURIComponent(file.name.substring(0, 20))}`;
        
        console.log('✅ Created placeholder image:', placeholderUrl);
        
        return NextResponse.json({ 
          success: true, 
          filename: placeholderUrl,
          originalName: file.name,
          size: file.size,
          type: file.type,
          isMobile: isMobile,
          storage: 'placeholder-fallback',
          warning: 'All storage methods failed, using placeholder image'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}