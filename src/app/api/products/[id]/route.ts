import { NextRequest, NextResponse } from 'next/server';
import { getProductByIdWithUpdates } from '@/data/products-server';
import { getProductById } from '@/data/products';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Try to get product with updates first
    let product;
    try {
      product = await getProductByIdWithUpdates(productId);
    } catch (error) {
      console.error('Error loading product with updates:', error);
      // Fallback to original function
      product = getProductById(productId);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await request.json();
    
    // Read current products
    const filePath = path.join(process.cwd(), 'data', 'updated-products.json');
    let products: any = {};
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      // Handle empty file or invalid JSON
      if (fileContent.trim() === '') {
        products = {};
      } else {
        products = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading products file:', error);
      // If JSON parsing fails, initialize as empty object
      products = {};
    }

    // Check if product exists in updated products, if not get from original products
    if (!products[productId]) {
      // Try to get the original product first
      const originalProduct = getProductById(productId);
      if (!originalProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      // Initialize with original product data
      products[productId] = originalProduct;
    }

    // Update the product
    products[productId] = { ...products[productId], ...updatedProduct };

    // Save updated products
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json(products[productId]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Read current products
    const filePath = path.join(process.cwd(), 'data', 'updated-products.json');
    let products: any = {};
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      // Handle empty file or invalid JSON
      if (fileContent.trim() === '') {
        products = {};
      } else {
        products = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading products file:', error);
      // If JSON parsing fails, initialize as empty object
      products = {};
    }

    // Check if product exists in updated products, if not get from original products
    if (!products[productId]) {
      // Try to get the original product first
      const originalProduct = getProductById(productId);
      if (!originalProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      // Initialize with original product data
      products[productId] = originalProduct;
    }

    const deletedProduct = products[productId];
    delete products[productId];

    // Save updated products
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
