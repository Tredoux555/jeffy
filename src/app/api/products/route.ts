import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    // Build query
    let query = supabase.from('products').select('*');
    
    // Filter by display status unless includeHidden is true
    if (!includeHidden) {
      query = query.eq('display', true);
    }
    
    // Order by created_at descending (newest first)
    query = query.order('created_at', { ascending: false });
    
    const { data: products, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }
    
    // Transform data to match frontend expectations
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      category: product.category,
      images: product.images || [],
      videos: product.videos || [],
      rating: product.rating,
      reviewCount: product.review_count,
      inStock: product.in_stock,
      display: product.display,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || [];
    
    console.log(`✅ Fetched ${transformedProducts.length} products from Supabase`);
    
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
  }
}
