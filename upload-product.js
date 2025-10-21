#!/usr/bin/env node

/**
 * BULLETPROOF PRODUCT UPLOAD SYSTEM
 * 
 * This script creates a simple, reliable way to upload products with images.
 * It handles all the complexity of file management and API calls.
 * 
 * Usage: node upload-product.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const PUBLIC_PRODUCTS_DIR = './public/products';

// Ensure products directory exists
if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
  fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
}

/**
 * Download image from URL and save to public/products directory
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const filepath = path.join(PUBLIC_PRODUCTS_DIR, filename);
      const file = fs.createWriteStream(filepath);
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Upload product via API
 */
async function uploadProduct(productData) {
  const response = await fetch(`${BASE_URL}/api/products/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to upload product: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Main function to upload a product with images
 */
async function uploadProductWithImages(productData, imageUrls) {
  try {
    console.log(`🚀 Uploading product: ${productData.name}`);
    
    // Download and save images
    const imagePaths = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = `${productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}.jpg`;
      
      try {
        await downloadImage(url, filename);
        imagePaths.push(`/products/${filename}`);
      } catch (error) {
        console.warn(`⚠️  Failed to download image ${i + 1}: ${error.message}`);
        // Continue with other images
      }
    }
    
    // Update product data with image paths
    const finalProductData = {
      ...productData,
      images: imagePaths,
    };
    
    // Upload product
    const result = await uploadProduct(finalProductData);
    
    console.log(`✅ Product uploaded successfully!`);
    console.log(`📋 Product ID: ${result.id}`);
    console.log(`🖼️  Images: ${imagePaths.length} uploaded`);
    console.log(`🔗 View at: ${BASE_URL}/products/${result.id}`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error uploading product: ${error.message}`);
    throw error;
  }
}

// Example usage - Archery Nocks Product
async function uploadArcheryNocks() {
  const productData = {
    name: "Premium Illuminated Archery Nocks (6-Pack)",
    description: "High-quality illuminated nocks for enhanced visibility during low-light archery sessions. Features bright LED technology, long-lasting battery life, and easy installation. Perfect for hunting, target practice, and competitive archery.",
    price: 24.99,
    originalPrice: 39.99,
    category: "archery",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    display: true,
    tags: ["archery", "nocks", "illuminated", "hunting", "target practice"],
    features: [
      "Bright LED illumination for low-light conditions",
      "Long-lasting battery life (up to 8 hours)",
      "Easy installation on any arrow shaft",
      "Waterproof and weather-resistant design",
      "Multiple color options available",
      "Includes 6 nocks per pack"
    ],
    specifications: {
      "Battery Life": "8+ hours continuous use",
      "Water Resistance": "IPX7 rated",
      "Compatibility": "Universal arrow shaft fit",
      "Colors": "Red, Green, Blue, White",
      "Weight": "2.5g per nock",
      "Dimensions": "1.2cm x 0.8cm"
    }
  };
  
  // Sample image URLs (you can replace these with actual image URLs)
  const imageUrls = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&crop=center"
  ];
  
  return await uploadProductWithImages(productData, imageUrls);
}

// Run the upload if this script is executed directly
if (require.main === module) {
  uploadArcheryNocks()
    .then(() => {
      console.log('\n🎉 Upload completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadProductWithImages, downloadImage };




