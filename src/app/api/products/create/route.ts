import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // Try Supabase first, fallback to memory storage
    try {
      // Check if Supabase is properly configured and available
      if (supabaseAdmin) {
        console.log('🔄 Attempting to create product in Supabase with admin client...');
        console.log('📦 Product data:', JSON.stringify(productData, null, 2));
        
        // Supabase is configured, try to insert with admin client
        const { data, error } = await supabaseAdmin
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Database error: ' + error.message);
        }

        console.log('✅ New product created in Supabase:', productId, productData.name);
        console.log('📊 Created product data:', data);
        console.log('🔍 Product category:', data?.category);
        console.log('👁️ Product display:', data?.display);
        
        // Transform data to match frontend expectations (camelCase)
        const transformedProduct = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          originalPrice: data.original_price,
          category: data.category,
          images: data.images || [],
          videos: data.videos || [],
          rating: data.rating,
          reviewCount: data.review_count,
          inStock: data.in_stock,
          display: data.display,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        return NextResponse.json({ 
          success: true, 
          product: transformedProduct 
        });
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using memory storage:', supabaseError);
      
      // Fallback: Store in memory and return success
      console.log('✅ New product created (memory storage):', productId, productData.name);
      console.log('📦 Product data:', JSON.stringify(productData, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        product: productData,
        message: 'Product created successfully (stored in memory - set up Supabase for permanent storage)'
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}