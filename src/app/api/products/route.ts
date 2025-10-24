import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    // Try Supabase first, fallback to static products
    try {
      // Check if Supabase is properly configured and available
      if (supabase) {
        console.log('🔄 Attempting to fetch products from Supabase...');
        
        // Supabase is configured, try to fetch
        let query = supabase.from('products').select('*');
        
        // Filter by display status unless includeHidden is true
        if (!includeHidden) {
          query = query.eq('display', true);
        }
        
        // Order by created_at descending (newest first)
        query = query.order('created_at', { ascending: false });
        
        const { data: supabaseProducts, error } = await query;
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Database error: ' + error.message);
        }
        
        // Transform data to match frontend expectations
        // Handle both camelCase and snake_case formats from Supabase
        const transformedProducts = supabaseProducts?.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.original_price || product.originalPrice,
          category: product.category,
          images: product.images || [],
          videos: product.videos || [],
          rating: product.rating,
          reviewCount: product.review_count || product.reviewCount,
          inStock: product.in_stock || product.inStock,
          display: product.display,
          createdAt: product.created_at || product.createdAt,
          updatedAt: product.updated_at || product.updatedAt
        })) || [];
        
        console.log(`✅ Fetched ${transformedProducts.length} products from Supabase`);
        return NextResponse.json(transformedProducts);
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using static products:', supabaseError);
      
      // Fallback: Use static products
      let allProducts = products;
      
      // Filter products based on display status unless includeHidden is true
      if (!includeHidden) {
        allProducts = allProducts.filter(product => product.display !== false);
      }
      
      console.log(`✅ Fetched ${allProducts.length} static products`);
      return NextResponse.json(allProducts);
    }
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
  }
}
