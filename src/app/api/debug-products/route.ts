import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not configured' 
      }, { status: 500 });
    }

    console.log('🔍 Debugging product visibility...');
    
    // Get all products
    const { data: allProducts, error: allError } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch all products: ' + allError.message 
      }, { status: 500 });
    }

    // Get only displayed products
    const { data: displayedProducts, error: displayedError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('display', true)
      .order('created_at', { ascending: false });

    if (displayedError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch displayed products: ' + displayedError.message 
      }, { status: 500 });
    }

    // Group by category
    const productsByCategory = allProducts?.reduce((acc: any, product: any) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {}) || {};

    const displayedByCategory = displayedProducts?.reduce((acc: any, product: any) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {}) || {};

    return NextResponse.json({
      success: true,
      summary: {
        totalProducts: allProducts?.length || 0,
        displayedProducts: displayedProducts?.length || 0,
        hiddenProducts: (allProducts?.length || 0) - (displayedProducts?.length || 0)
      },
      categories: {
        all: {
          total: allProducts?.length || 0,
          displayed: displayedProducts?.length || 0,
          products: allProducts || []
        },
        byCategory: productsByCategory,
        displayedByCategory: displayedByCategory
      },
      recentProducts: allProducts?.slice(0, 5) || []
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Debug failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
