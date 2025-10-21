#!/usr/bin/env node

/**
 * QUICK PRODUCT UPLOADER
 * 
 * Simple command-line tool to upload products with images
 * Usage: node quick-upload.js "Product Name" "Category" "Price" "Image URL 1" "Image URL 2" ...
 */

const { uploadProductWithImages } = require('./upload-product.js');

async function quickUpload() {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log(`
🚀 QUICK PRODUCT UPLOADER

Usage: node quick-upload.js "Product Name" "Category" "Price" "Image URL 1" "Image URL 2" ...

Examples:
  node quick-upload.js "Archery Bow" "archery" "299.99" "https://example.com/image1.jpg" "https://example.com/image2.jpg"
  node quick-upload.js "Gym Gloves" "gym" "24.99" "https://example.com/gloves.jpg"

Categories: archery, gym, camping, kitchen, beauty, electronics, sports, home-garden
    `);
    process.exit(1);
  }
  
  const [name, category, price, ...imageUrls] = args;
  
  const productData = {
    name,
    description: `High-quality ${name.toLowerCase()} perfect for your needs. Features excellent durability, performance, and value.`,
    price: parseFloat(price),
    originalPrice: parseFloat(price) * 1.3, // 30% discount
    category,
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 200) + 50,
    inStock: true,
    display: true,
    tags: [category, name.toLowerCase().split(' ')[0]],
    features: [
      "High-quality materials",
      "Excellent performance", 
      "Durable construction",
      "Great value for money"
    ],
    specifications: {
      "Material": "Premium quality",
      "Weight": "Lightweight",
      "Dimensions": "Standard size"
    }
  };
  
  try {
    console.log(`🚀 Uploading: ${name}`);
    const result = await uploadProductWithImages(productData, imageUrls);
    console.log(`\n🎉 SUCCESS! Product uploaded:`);
    console.log(`🔗 View at: http://localhost:3000/products/${result.id}`);
    console.log(`📱 Admin: http://localhost:3000/admin/dashboard`);
  } catch (error) {
    console.error(`\n❌ FAILED: ${error.message}`);
    process.exit(1);
  }
}

quickUpload();




