#!/usr/bin/env node

/**
 * Test script to verify product creation and image upload functionality
 * Run with: node test-product-creation.js
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testProductCreation() {
  console.log('🧪 Testing Product Creation and Image Upload...\n');

  try {
    // Test 1: Check if products API is working
    console.log('1️⃣ Testing products API...');
    const productsResponse = await fetch(`${BASE_URL}/api/products?includeHidden=true`);
    const products = await productsResponse.json();
    console.log(`   ✅ Found ${products.length} existing products\n`);

    // Test 2: Test product creation
    console.log('2️⃣ Testing product creation...');
    const testProduct = {
      name: 'Test Product from Script',
      description: 'This is a test product created by the test script',
      price: 99.99,
      originalPrice: 129.99,
      category: 'electronics',
      images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Test+Image'],
      videos: [],
      rating: 4.5,
      reviewCount: 10,
      inStock: true,
      display: true
    };

    const createResponse = await fetch(`${BASE_URL}/api/products/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct)
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log('   ✅ Product created successfully');
      console.log(`   📦 Product ID: ${createResult.product.id}`);
      console.log(`   💾 Storage: ${createResult.message || 'Supabase'}\n`);
    } else {
      console.log('   ❌ Product creation failed:', createResult.error);
      return;
    }

    // Test 3: Verify product appears in list
    console.log('3️⃣ Verifying product appears in list...');
    const updatedProductsResponse = await fetch(`${BASE_URL}/api/products?includeHidden=true`);
    const updatedProducts = await updatedProductsResponse.json();
    
    const testProductExists = updatedProducts.find(p => p.id === createResult.product.id);
    if (testProductExists) {
      console.log('   ✅ Product found in products list');
      console.log(`   📝 Product name: ${testProductExists.name}`);
      console.log(`   🏷️ Category: ${testProductExists.category}`);
      console.log(`   👁️ Display: ${testProductExists.display}\n`);
    } else {
      console.log('   ❌ Product not found in products list');
    }

    // Test 4: Test image upload
    console.log('4️⃣ Testing image upload...');
    const FormData = require('form-data');
    const fs = require('fs');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    formData.append('productId', createResult.product.id);
    formData.append('imageIndex', '0');

    const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });

    const uploadResult = await uploadResponse.json();
    
    if (uploadResult.success) {
      console.log('   ✅ Image upload successful');
      console.log(`   🖼️ Image URL: ${uploadResult.filename}`);
      console.log(`   💾 Storage: ${uploadResult.storage}\n`);
    } else {
      console.log('   ❌ Image upload failed:', uploadResult.error);
    }

    console.log('🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Products API: Working`);
    console.log(`   - Product Creation: ${createResult.success ? 'Working' : 'Failed'}`);
    console.log(`   - Product Persistence: ${testProductExists ? 'Working' : 'Failed'}`);
    console.log(`   - Image Upload: ${uploadResult.success ? 'Working' : 'Failed'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the development server is running on', BASE_URL);
  }
}

// Run the test
testProductCreation();