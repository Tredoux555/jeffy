import { NextRequest, NextResponse } from 'next/server';
import { getProductByIdWithUpdates } from '@/data/products-server';
import { getProductById } from '@/data/products';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    console.log('🔍 Looking for product:', productId);

    // Try Supabase first (where new products are stored)
    if (supabaseAdmin) {
      try {
        const { data: supabaseProduct, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.log('⚠️ Product not found in Supabase:', error.message);
        } else if (supabaseProduct) {
          // Transform data to match frontend expectations
          const transformedProduct = {
            id: supabaseProduct.id,
            name: supabaseProduct.name,
            description: supabaseProduct.description,
            price: supabaseProduct.price,
            originalPrice: supabaseProduct.original_price,
            category: supabaseProduct.category,
            images: supabaseProduct.images || [],
            videos: supabaseProduct.videos || [],
            rating: supabaseProduct.rating,
            reviewCount: supabaseProduct.review_count,
            inStock: supabaseProduct.in_stock,
            display: supabaseProduct.display,
            createdAt: supabaseProduct.created_at,
            updatedAt: supabaseProduct.updated_at
          };
          
          console.log('✅ Found product in Supabase:', transformedProduct.name);
          return NextResponse.json(transformedProduct);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase error:', supabaseError);
      }
    }

    // Fallback: Try static products
    try {
      const product = await getProductByIdWithUpdates(productId);
      if (product) {
        console.log('✅ Found product in updated products:', product.name);
        return NextResponse.json(product);
      }
    } catch (error) {
      console.log('⚠️ Updated products failed, trying static products');
    }

    // Final fallback: Static products
    const product = getProductById(productId);
    if (product) {
      console.log('✅ Found product in static data:', product.name);
      return NextResponse.json(product);
    }

    console.log('❌ Product not found anywhere:', productId);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await request.json();
    
    // Use Supabase instead of file system
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase not configured' 
      }, { status: 500 });
    }

    // Update product in Supabase
    const { data: result, error } = await supabaseAdmin
      .from('products')
      .update(updatedProduct)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ 
        error: 'Database update failed: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Use Supabase instead of file system
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase not configured' 
      }, { status: 500 });
    }

    // Delete product from Supabase
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ 
        error: 'Database delete failed: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
