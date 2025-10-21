import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId') as string;
    const imageIndex = data.get('imageIndex') as string;

    console.log('📤 Upload API called:', { productId, imageIndex, fileName: file?.name });

    if (!file) {
      console.error('❌ No file uploaded');
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename based on product ID and image index
    // Handle null/undefined values
    const safeProductId = productId || 'temp';
    const safeImageIndex = imageIndex || '0';
    const timestamp = Date.now();
    const filename = `product-${safeProductId}-${safeImageIndex}-${timestamp}.jpg`;
    const path = join(process.cwd(), 'public', 'products', filename);

    console.log('💾 Saving file to:', path);
    await writeFile(path, buffer);

    const imagePath = `/products/${filename}`;
    console.log('✅ File saved successfully:', imagePath);

    return NextResponse.json({ 
      success: true, 
      filename: imagePath 
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}


