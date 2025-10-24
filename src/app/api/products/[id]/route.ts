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

    // Try to get product with updates first
    let product;
    try {
      product = await getProductByIdWithUpdates(productId);
    } catch (error) {
      console.error('Error loading product with updates:', error);
      // Fallback to original function
      product = getProductById(productId);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
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
