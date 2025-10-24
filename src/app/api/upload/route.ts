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

    // TEMPORARY FIX: Always use placeholder images for now
    console.log('🔄 Using placeholder image approach (temporary fix)');
    
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
      storage: 'placeholder-temp-fix',
      message: 'Using placeholder image (Supabase upload temporarily disabled)'
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}