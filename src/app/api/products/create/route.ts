import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    
    // Validate required fields
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: name, category, and price are required' 
      }, { status: 400 });
    }

    // Generate a unique ID (simple timestamp-based for now)
    const productId = Date.now().toString();
    
    // Set default values for required fields
    const product = {
      id: productId,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      description: newProduct.description || '',
      images: newProduct.images || [],
      videos: newProduct.videos || [],
      rating: newProduct.rating || 0,
      reviewCount: newProduct.reviewCount || 0,
      inStock: newProduct.inStock !== false, // Default to true
      display: newProduct.display !== false, // Default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // For now, we'll store products in memory and return success
    // In production, you'd want to use a database like Supabase, PlanetScale, or MongoDB
    console.log('✅ New product created:', productId, product.name);
    console.log('📦 Product data:', JSON.stringify(product, null, 2));

    return NextResponse.json({ 
      success: true, 
      product: product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}