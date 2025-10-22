import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    // Prepare product data for Supabase
    const productData = {
      id: productId,
      name: newProduct.name,
      description: newProduct.description || '',
      price: parseFloat(newProduct.price),
      original_price: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      category: newProduct.category,
      images: newProduct.images || [],
      videos: newProduct.videos || [],
      rating: newProduct.rating || 0,
      review_count: newProduct.reviewCount || 0,
      in_stock: newProduct.inStock !== false,
      display: newProduct.display !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert product into Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Database error: ' + error.message 
      }, { status: 500 });
    }

    console.log('✅ New product created in Supabase:', productId, productData.name);

    return NextResponse.json({ 
      success: true, 
      product: data 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}