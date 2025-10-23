import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not configured' 
      }, { status: 500 });
    }

    console.log('🔍 Testing image URLs...');
    
    // Get all products with images
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, images')
      .not('images', 'is', null);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch products: ' + error.message 
      }, { status: 500 });
    }

    const imageTests = [];
    
    for (const product of products || []) {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl && imageUrl.trim() !== '') {
            try {
              // Test if the image URL is accessible
              const response = await fetch(imageUrl, { method: 'HEAD' });
              imageTests.push({
                productId: product.id,
                productName: product.name,
                imageUrl: imageUrl,
                accessible: response.ok,
                status: response.status,
                contentType: response.headers.get('content-type')
              });
            } catch (error) {
              imageTests.push({
                productId: product.id,
                productName: product.name,
                imageUrl: imageUrl,
                accessible: false,
                error: (error as Error).message
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalProducts: products?.length || 0,
      totalImages: imageTests.length,
      accessibleImages: imageTests.filter(t => t.accessible).length,
      brokenImages: imageTests.filter(t => !t.accessible).length,
      imageTests: imageTests
    });

  } catch (error) {
    console.error('❌ Image test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Image test failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
