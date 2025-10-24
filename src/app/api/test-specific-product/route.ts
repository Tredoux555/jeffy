import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing specific product lookup...');
    
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase admin client not configured',
        configured: false
      }, { status: 500 });
    }

    // Try to get the specific product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', '1761307131997')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ 
        error: 'Database error: ' + error.message,
        details: error
      }, { status: 500 });
    }

    console.log('✅ Found specific product:', product?.name);
    
    return NextResponse.json({
      success: true,
      product: product,
      message: `Found product: ${product?.name || 'Unknown'}`
    });

  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      error: 'Test failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
