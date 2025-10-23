import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products } from '@/data/products';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not configured' 
      }, { status: 500 });
    }

    console.log('🚀 Starting original products upload to Supabase...');
    
    const results = [];
    let uploadedCount = 0;

    for (const product of products) {
      try {
        console.log(`📦 Uploading product: ${product.name} (ID: ${product.id})`);
        
        // Transform product data to match Supabase schema
        const productData = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice || null,
          category: product.category,
          images: product.images || [],
          videos: product.videos || [],
          rating: product.rating || 0,
          review_count: product.reviewCount || 0,
          in_stock: product.inStock !== false,
          display: product.display !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Insert product into Supabase
        const { data, error } = await supabaseAdmin
          .from('products')
          .upsert([productData], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select();

        if (error) {
          console.error(`❌ Failed to upload ${product.name}:`, error);
          results.push({
            productId: product.id,
            productName: product.name,
            status: 'failed',
            error: error.message
          });
        } else {
          console.log(`✅ Uploaded ${product.name} successfully`);
          uploadedCount++;
          results.push({
            productId: product.id,
            productName: product.name,
            status: 'success',
            data: data
          });
        }
        
      } catch (error) {
        console.error(`❌ Error uploading ${product.name}:`, error);
        results.push({
          productId: product.id,
          productName: product.name,
          status: 'error',
          error: (error as Error).message
        });
      }
    }
    
    console.log(`🎉 Original products upload complete! ${uploadedCount}/${products.length} uploaded`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Original products uploaded successfully',
      summary: {
        totalProducts: products.length,
        uploadedCount: uploadedCount,
        results: results
      }
    });
    
  } catch (error) {
    console.error('❌ Error in original products upload:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Original products upload failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
