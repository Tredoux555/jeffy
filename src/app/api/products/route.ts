import { NextRequest, NextResponse } from 'next/server';
import { getProductsWithUpdates } from '@/data/products-server';
import { products } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    // Try to get products with updates first
    let allProducts;
    try {
      allProducts = await getProductsWithUpdates();
    } catch (error) {
      console.error('Error loading products with updates:', error);
      // Fallback to original products
      allProducts = products;
    }

    // Filter products based on display status unless includeHidden is true
    if (!includeHidden) {
      allProducts = allProducts.filter(product => product.display !== false);
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
