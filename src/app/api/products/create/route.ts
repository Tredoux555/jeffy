import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    
    // Validate required fields
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, category, and price are required' 
      }, { status: 400 });
    }

    // Generate a unique ID (simple timestamp-based for now)
    const productId = Date.now().toString();
    
    // Set default values for required fields
    const product = {
      id: productId,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      description: newProduct.description || '',
      images: newProduct.images || [],
      videos: newProduct.videos || [],
      rating: newProduct.rating || 0,
      reviewCount: newProduct.reviewCount || 0,
      inStock: newProduct.inStock !== false, // Default to true
      display: newProduct.display !== false, // Default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

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

    // Add the new product
    products[productId] = product;

    // Save updated products
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));

    console.log('✅ New product created:', productId, product.name);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}