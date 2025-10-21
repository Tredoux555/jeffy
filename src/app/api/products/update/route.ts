import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, productData } = data;

    // In a real app, you'd update a database
    // For now, we'll create a simple JSON file to store updated products
    const productsPath = join(process.cwd(), 'data', 'updated-products.json');
    
    let updatedProducts = {};
    try {
      const existingData = await readFile(productsPath, 'utf8');
      updatedProducts = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty object
    }

    updatedProducts[productId] = productData;

    await writeFile(productsPath, JSON.stringify(updatedProducts, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Update failed' });
  }
}


