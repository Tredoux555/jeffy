import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId') as string;
    const videoIndex = data.get('videoIndex') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ success: false, error: 'File must be a video' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename based on product ID and video index
    // Handle null/undefined values
    const safeProductId = productId || 'temp';
    const safeVideoIndex = videoIndex || '0';
    const fileExtension = file.name.split('.').pop() || 'mp4';
    const filename = `product-${safeProductId}-video-${safeVideoIndex}.${fileExtension}`;
    const path = join(process.cwd(), 'public', 'products', filename);

    await writeFile(path, buffer);

    return NextResponse.json({ 
      success: true, 
      filename: `/products/${filename}` 
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}
