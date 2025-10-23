import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase configuration...');
    
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not configured',
        details: 'Check NEXT_PUBLIC_SUPABASE_SERVICE_KEY environment variable'
      });
    }

    // Test basic connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('products')
      .select('count')
      .limit(1);

    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase connection failed',
        details: testError.message
      });
    }

    // Test storage bucket
    const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase Storage access failed',
        details: bucketError.message
      });
    }

    const productImagesBucket = buckets?.find(bucket => bucket.name === 'product-images');

    return NextResponse.json({
      success: true,
      message: 'Supabase is properly configured',
      details: {
        databaseConnection: 'Working',
        storageAccess: 'Working',
        productImagesBucket: productImagesBucket ? 'Found' : 'Not found',
        totalBuckets: buckets?.length || 0,
        buckets: buckets?.map(b => b.name) || []
      }
    });

  } catch (error) {
    console.error('❌ Supabase test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Supabase test failed: ' + (error as Error).message
    }, { status: 500 });
  }
}
