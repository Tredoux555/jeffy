import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const productId = '1761307131997'; // The specific product we're testing
    console.log(`🔍 Debug lookup for product ID: ${productId}`);

    const results = {
      supabaseClient: null,
      supabaseAdminClient: null,
      productFound: false,
      error: null
    };

    // Test regular supabase client
    if (supabase) {
      console.log('✅ Regular supabase client is configured');
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.log('❌ Regular supabase error:', error);
          results.supabaseClient = { error: error.message };
        } else if (product) {
          console.log('✅ Found product with regular supabase:', product.name);
          results.supabaseClient = { success: true, product: product.name };
          results.productFound = true;
        } else {
          console.log('❌ No product found with regular supabase');
          results.supabaseClient = { error: 'No product found' };
        }
      } catch (err) {
        console.log('❌ Regular supabase exception:', err);
        results.supabaseClient = { error: (err as Error).message };
      }
    } else {
      console.log('❌ Regular supabase client not configured');
      results.supabaseClient = { error: 'Client not configured' };
    }

    // Test supabaseAdmin client
    if (supabaseAdmin) {
      console.log('✅ SupabaseAdmin client is configured');
      try {
        const { data: product, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.log('❌ SupabaseAdmin error:', error);
          results.supabaseAdminClient = { error: error.message };
        } else if (product) {
          console.log('✅ Found product with supabaseAdmin:', product.name);
          results.supabaseAdminClient = { success: true, product: product.name };
          results.productFound = true;
        } else {
          console.log('❌ No product found with supabaseAdmin');
          results.supabaseAdminClient = { error: 'No product found' };
        }
      } catch (err) {
        console.log('❌ SupabaseAdmin exception:', err);
        results.supabaseAdminClient = { error: (err as Error).message };
      }
    } else {
      console.log('❌ SupabaseAdmin client not configured');
      results.supabaseAdminClient = { error: 'Client not configured' };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
  }
}
