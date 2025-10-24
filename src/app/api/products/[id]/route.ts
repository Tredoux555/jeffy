import { NextRequest, NextResponse } from 'next/server';
import { getProductByIdWithUpdates } from '@/data/products-server';
import { getProductById } from '@/data/products';
import { supabase } from '@/lib/supabase';
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

    // Try Supabase first, fallback to file system and static products
    try {
      // Check if Supabase is properly configured and available
      if (supabase) {
        console.log('🔄 Attempting to fetch product from Supabase:', productId);
        
        // Supabase is configured, try to fetch
        const { data: supabaseProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Database error: ' + error.message);
        }
        
        if (supabaseProduct) {
          // Transform data to match frontend expectations
          const transformedProduct = {
            id: supabaseProduct.id,
            name: supabaseProduct.name,
            description: supabaseProduct.description,
            price: supabaseProduct.price,
            originalPrice: supabaseProduct.original_price,
            category: supabaseProduct.category,
            images: supabaseProduct.images || [],
            videos: supabaseProduct.videos || [],
            rating: supabaseProduct.rating,
            reviewCount: supabaseProduct.review_count,
            inStock: supabaseProduct.in_stock,
            display: supabaseProduct.display,
            createdAt: supabaseProduct.created_at,
            updatedAt: supabaseProduct.updated_at
          };
          
          console.log(`✅ Fetched product from Supabase:`, transformedProduct.name);
          return NextResponse.json(transformedProduct);
        } else {
          throw new Error('Product not found in Supabase');
        }
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, falling back to file system/static products:', supabaseError);
      
      // Fallback: Try to get product with updates first
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
    }
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
    
    // Try Supabase first, fallback to file system
    try {
      if (supabase) {
        console.log('🔄 Attempting to update product in Supabase:', productId);
        
        // Prepare update data
        const updateData = {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          original_price: updatedProduct.originalPrice,
          category: updatedProduct.category,
          images: updatedProduct.images,
          videos: updatedProduct.videos,
          rating: updatedProduct.rating,
          review_count: updatedProduct.reviewCount,
          in_stock: updatedProduct.inStock,
          display: updatedProduct.display,
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Database error: ' + error.message);
        }
        
        console.log(`✅ Updated product in Supabase:`, productId);
        return NextResponse.json(data);
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using file system:', supabaseError);
      
      // Fallback: Read current products
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
    }
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

    // Try Supabase first, fallback to file system
    try {
      if (supabase) {
        console.log('🔄 Attempting to delete product from Supabase:', productId);
        
        // First fetch the product to return it
        const { data: productToDelete, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (fetchError) {
          console.error('Supabase fetch error:', fetchError);
          throw new Error('Database error: ' + fetchError.message);
        }
        
        // Delete the product
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
          throw new Error('Database error: ' + deleteError.message);
        }
        
        console.log(`✅ Deleted product from Supabase:`, productId);
        return NextResponse.json({ 
          message: 'Product deleted successfully', 
          product: productToDelete 
        });
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using file system:', supabaseError);
      
      // Fallback: Read current products
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
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
