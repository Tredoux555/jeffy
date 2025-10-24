import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const PRODUCTS_FILE = join(process.cwd(), 'data', 'updated-products.json');

export async function saveProduct(product: any) {
  try {
    // Read existing products
    let products: { [key: string]: any } = {};
    try {
      const data = await readFile(PRODUCTS_FILE, 'utf-8');
      products = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty object
      products = {};
    }

    // Add new product using ID as key
    products[product.id] = product;

    // Save back to file
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    console.log('✅ Product saved to file:', product.name);
    return product;
  } catch (error) {
    console.error('❌ Error saving product to file:', error);
    throw error;
  }
}

export async function loadProducts() {
  try {
    const data = await readFile(PRODUCTS_FILE, 'utf-8');
    const productsObj = JSON.parse(data);
    // Convert object to array
    const products = Object.values(productsObj);
    console.log('✅ Loaded', products.length, 'products from file');
    return products;
  } catch (error) {
    console.log('⚠️ No dynamic products file found, returning empty array');
    return [];
  }
}
