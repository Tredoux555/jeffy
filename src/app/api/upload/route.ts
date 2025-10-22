import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
      fileType: file?.type 
    });

    if (!file) {
      console.error('❌ No file uploaded');
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json({ 
        success: false, 
        error: 'File too large. Maximum size is 10MB.' 
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
    const filePath = join(process.cwd(), 'public', 'products', filename);

    console.log('💾 Saving file to:', filePath);
    await writeFile(filePath, buffer);

    const imagePath = `/products/${filename}`;
    console.log('✅ File saved successfully:', imagePath);

    return NextResponse.json({ 
      success: true, 
      filename: imagePath,
      originalName: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}


