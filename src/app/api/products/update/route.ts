import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, productData } = data;

    // Use Supabase instead of file system
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured' 
      }, { status: 500 });
    }

    // Update product in Supabase
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Database update failed: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Update failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}


