import { NextRequest, NextResponse } from 'next/server';
import { getProductsWithUpdates } from '@/data/products-server';

export async function GET(request: NextRequest) {
  try {
    const products = await getProductsWithUpdates();
    
    // Check if there are any new products (you could implement more sophisticated logic)
    const hasNewProducts = products.some(product => {
      // Check if product was created in the last 24 hours
      const createdAt = new Date(product.createdAt || Date.now());
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdAt > oneDayAgo;
    });
    
    return NextResponse.json({
      hasNewProducts,
      productCount: products.length,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking for product updates:', error);
    return NextResponse.json({ 
      hasNewProducts: false,
      error: 'Failed to check for updates' 
    }, { status: 500 });
  }
}

