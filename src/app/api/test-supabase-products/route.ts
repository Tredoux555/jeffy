import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase admin client not configured',
        configured: false
      }, { status: 500 });
    }

    // Get all products from Supabase
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ 
        error: 'Database error: ' + error.message,
        details: error
      }, { status: 500 });
    }

    console.log('✅ Found', products?.length || 0, 'products in Supabase');
    
    // Check if the specific product exists
    const specificProduct = products?.find(p => p.id === '1761307131997');
    
    return NextResponse.json({
      success: true,
      totalProducts: products?.length || 0,
      products: products || [],
      specificProduct: specificProduct || null,
      message: `Found ${products?.length || 0} products in Supabase. Specific product 1761307131997: ${specificProduct ? 'FOUND' : 'NOT FOUND'}`
    });

  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      error: 'Test failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
