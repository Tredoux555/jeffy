import { Product } from '@/types';
import { products } from './products';

// Server-side only function to get products with updates
export async function getProductsWithUpdates(): Promise<Product[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const updatedProductsPath = path.join(process.cwd(), 'data', 'updated-products.json');
    const updatedProductsData = await fs.readFile(updatedProductsPath, 'utf8');
    
    // Handle empty file or invalid JSON
    let updatedProducts = {};
    if (updatedProductsData.trim() !== '') {
      try {
        updatedProducts = JSON.parse(updatedProductsData);
      } catch (error) {
        console.error('Error parsing updated products:', error);
        updatedProducts = {};
      }
    }
    
    // Start with original products and merge updates
    const mergedProducts = products.map(product => ({
      ...product,
      ...updatedProducts[product.id]
    }));
    
    // Add any new products that don't exist in original products
    const originalProductIds = new Set(products.map(p => p.id));
    const newProducts = Object.values(updatedProducts).filter((product: any) => 
      !originalProductIds.has(product.id)
    );
    
    return [...mergedProducts, ...newProducts];
  } catch (error) {
    // If no updates file exists, return original products
    return products;
  }
}

// Server-side only function to get a single product with updates applied
export async function getProductByIdWithUpdates(id: string): Promise<Product | undefined> {
  const productsWithUpdates = await getProductsWithUpdates();
  return productsWithUpdates.find(product => product.id === id);
}
