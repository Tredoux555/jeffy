import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase not configured',
        status: 'not-configured'
      });
    }

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (testError) {
      return NextResponse.json({ 
        error: 'Supabase connection failed',
        details: testError.message,
        status: 'connection-failed'
      });
    }

    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch products',
        details: productsError.message,
        status: 'fetch-failed'
      });
    }

    return NextResponse.json({
      status: 'success',
      productCount: products?.length || 0,
      products: products || [],
      message: `Found ${products?.length || 0} products in Supabase`
    });

  } catch (error) {
    console.error('❌ Test API error:', error);
    return NextResponse.json({ 
      error: 'Test failed: ' + (error as Error).message,
      status: 'error'
    }, { status: 500 });
  }
}
