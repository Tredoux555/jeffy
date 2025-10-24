import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Simple upload test called');
    
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId') as string;
    const imageIndex = data.get('imageIndex') as string;

    console.log('📦 Test upload data:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      productId,
      imageIndex
    });

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Create a simple placeholder image URL
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
    const color = colors[parseInt(imageIndex || '0') % colors.length];
    const placeholderUrl = `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${encodeURIComponent(file.name.substring(0, 20))}`;

    console.log('✅ Test upload successful, created placeholder:', placeholderUrl);

    return NextResponse.json({ 
      success: true, 
      filename: placeholderUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      storage: 'test-placeholder'
    });

  } catch (error) {
    console.error('❌ Test upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Test upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
