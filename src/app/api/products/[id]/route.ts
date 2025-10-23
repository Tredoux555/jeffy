import { NextRequest, NextResponse } from 'next/server';
import { getProductByIdWithUpdates } from '@/data/products-server';
import { getProductById } from '@/data/products';
import { supabaseAdmin } from '@/lib/supabase';
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
    
    // Try Supabase first
    if (supabaseAdmin) {
      try {
        console.log('🔄 Updating product in Supabase:', productId);
        
        // Prepare update data with snake_case field names
        const updateData: any = {};
        if (updatedProduct.name !== undefined) updateData.name = updatedProduct.name;
        if (updatedProduct.description !== undefined) updateData.description = updatedProduct.description;
        if (updatedProduct.price !== undefined) updateData.price = updatedProduct.price;
        if (updatedProduct.originalPrice !== undefined) updateData.original_price = updatedProduct.originalPrice;
        if (updatedProduct.category !== undefined) updateData.category = updatedProduct.category;
        if (updatedProduct.images !== undefined) updateData.images = updatedProduct.images;
        if (updatedProduct.videos !== undefined) updateData.videos = updatedProduct.videos;
        if (updatedProduct.rating !== undefined) updateData.rating = updatedProduct.rating;
        if (updatedProduct.reviewCount !== undefined) updateData.review_count = updatedProduct.reviewCount;
        if (updatedProduct.inStock !== undefined) updateData.in_stock = updatedProduct.inStock;
        if (updatedProduct.display !== undefined) updateData.display = updatedProduct.display;
        updateData.updated_at = new Date().toISOString();
        
        const { data, error } = await supabaseAdmin
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select()
          .single();

        if (error) {
          console.error('Supabase update error:', error);
          throw new Error('Database error: ' + error.message);
        }

        console.log('✅ Product updated in Supabase:', productId);
        
        // Transform response to camelCase
        const transformedProduct = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          originalPrice: data.original_price,
          category: data.category,
          images: data.images || [],
          videos: data.videos || [],
          rating: data.rating,
          reviewCount: data.review_count,
          inStock: data.in_stock,
          display: data.display,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        return NextResponse.json(transformedProduct);
      } catch (supabaseError) {
        console.error('⚠️ Supabase update failed, falling back to file system:', supabaseError);
      }
    }
    
    // Fallback to file system
    console.log('Using file system fallback for product update');
    const filePath = path.join(process.cwd(), 'data', 'updated-products.json');
    let products: any = {};
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      if (fileContent.trim() === '') {
        products = {};
      } else {
        products = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading products file:', error);
      products = {};
    }

    if (!products[productId]) {
      const originalProduct = getProductById(productId);
      if (!originalProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      products[productId] = originalProduct;
    }

    products[productId] = { ...products[productId], ...updatedProduct };
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
