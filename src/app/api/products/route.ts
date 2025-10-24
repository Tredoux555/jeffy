import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products } from '@/data/products';
import { getProductByIdWithUpdates } from '@/data/products-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    // Try Supabase first, fallback to existing system
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
        const transformedProducts = supabaseProducts?.map(product => ({
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
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using existing system:', supabaseError);
      
      // Fallback: Use existing system (static + updated products)
      try {
        // Get all static products
        let allProducts = [...products];
        
        // Try to get updated products and merge them
        try {
          // This will get products from updated-products.json
          const updatedProductIds = ['6', '8', '1760786854717', '1760884221093', '1760884681360']; // Known updated product IDs
          
          for (const productId of updatedProductIds) {
            try {
              const updatedProduct = await getProductByIdWithUpdates(productId);
              if (updatedProduct) {
                // Replace static product with updated version
                const staticIndex = allProducts.findIndex(p => p.id === productId);
                if (staticIndex !== -1) {
                  allProducts[staticIndex] = updatedProduct;
                } else {
                  allProducts.push(updatedProduct);
                }
              }
            } catch (error) {
              console.log(`Could not load updated product ${productId}:`, error);
            }
          }
        } catch (error) {
          console.log('Could not load updated products:', error);
        }
        
        // Filter products based on display status unless includeHidden is true
        if (!includeHidden) {
          allProducts = allProducts.filter(product => product.display !== false);
        }
        
        console.log(`✅ Fetched ${allProducts.length} products (static + updated)`);
        return NextResponse.json(allProducts);
      } catch (error) {
        console.log('⚠️ Existing system failed, using static products only:', error);
        
        // Final fallback: Use static products only
        let allProducts = products;
        
        // Filter products based on display status unless includeHidden is true
        if (!includeHidden) {
          allProducts = allProducts.filter(product => product.display !== false);
        }
        
        console.log(`✅ Fetched ${allProducts.length} static products only`);
        return NextResponse.json(allProducts);
      }
    }
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
  }
}
