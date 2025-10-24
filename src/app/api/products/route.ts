import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products } from '@/data/products';
import { loadProducts } from '@/lib/file-storage';

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
      console.log('⚠️ Supabase not available, using file storage + static products:', supabaseError);
      
      // Fallback: Load from file storage + static products
      try {
        const dynamicProducts = await loadProducts();
        let allProducts = [...dynamicProducts, ...products];
        
        // Remove duplicates based on ID
        const uniqueProducts = allProducts.filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id)
        );
        
        // Filter products based on display status unless includeHidden is true
        if (!includeHidden) {
          allProducts = uniqueProducts.filter(product => product.display !== false);
        } else {
          allProducts = uniqueProducts;
        }
        
        console.log(`✅ Fetched ${allProducts.length} products (${dynamicProducts.length} dynamic + ${products.length} static)`);
        return NextResponse.json(allProducts);
      } catch (fileError) {
        console.log('⚠️ File storage failed, using static products only:', fileError);
        
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
