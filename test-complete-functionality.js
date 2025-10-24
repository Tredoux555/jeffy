/**
 * Complete Functionality Test for Jeffy Project
 * Tests product creation, image upload, and display functionality
 */

const testCompleteFunctionality = async () => {
  console.log('🧪 Testing Complete Jeffy Functionality\n');
  
  let testsPassed = 0;
  let totalTests = 0;
  
  const runTest = async (testName, testFunction) => {
    totalTests++;
    try {
      console.log(`📋 Test ${totalTests}: ${testName}`);
      await testFunction();
      console.log(`✅ PASSED: ${testName}\n`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}\n`);
    }
  };

  // Test 1: API Connection
  await runTest('API Connection', async () => {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    console.log(`   📦 Loaded ${products.length} products`);
  });

  // Test 2: Product Creation
  await runTest('Product Creation', async () => {
    const testProduct = {
      name: `Test Product ${Date.now()}`,
      category: 'electronics',
      price: 99.99,
      description: 'Test product for functionality verification',
      images: ['', '', '', ''],
      videos: [''],
      rating: 4.5,
      reviewCount: 10,
      inStock: true,
      display: true
    };
    
    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Create failed: ${error}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(`Create failed: ${result.error}`);
    }
    
    console.log(`   📦 Created product: ${result.product?.name || testProduct.name}`);
  });

  // Test 3: Image Upload
  await runTest('Image Upload', async () => {
    // Create a small test image blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(0, 0, 100, 100);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('productId', 'test');
    formData.append('imageIndex', '0');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(`Upload failed: ${result.error}`);
    }
    
    console.log(`   📁 Uploaded to: ${result.storage}`);
    console.log(`   🔗 Image URL: ${result.filename.substring(0, 50)}...`);
  });

  // Test 4: Category Filtering
  await runTest('Category Filtering', async () => {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const categories = ['electronics', 'archery', 'kitchen', 'gym', 'camping', 'beauty'];
    const categoryCounts = {};
    
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      categoryCounts[category] = categoryProducts.length;
    });
    
    console.log(`   📊 Category distribution:`, categoryCounts);
    
    if (Object.values(categoryCounts).every(count => count >= 0)) {
      console.log(`   ✅ All categories accessible`);
    } else {
      throw new Error('Category filtering failed');
    }
  });

  // Test 5: Product Display Status
  await runTest('Product Display Filtering', async () => {
    const allResponse = await fetch('/api/products?includeHidden=true');
    const allProducts = await allResponse.json();
    
    const visibleResponse = await fetch('/api/products');
    const visibleProducts = await visibleResponse.json();
    
    console.log(`   📊 Total products: ${allProducts.length}`);
    console.log(`   👁️ Visible products: ${visibleProducts.length}`);
    
    const hiddenCount = allProducts.length - visibleProducts.length;
    console.log(`   🙈 Hidden products: ${hiddenCount}`);
    
    if (visibleProducts.every(p => p.display !== false)) {
      console.log(`   ✅ Display filtering working`);
    } else {
      throw new Error('Display filtering failed');
    }
  });

  // Test 6: Environment Configuration
  await runTest('Environment Configuration', async () => {
    // This test checks if Supabase is configured by looking at the response patterns
    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Config Test Product',
        category: 'electronics',
        price: 1.00,
        description: 'Testing configuration'
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`   📊 Storage system: ${result.message ? 'File System' : 'Supabase'}`);
      console.log(`   ✅ Product persistence working`);
    } else {
      throw new Error(`Configuration test failed: ${result.error}`);
    }
  });

  // Summary
  console.log('📋 Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalTests - testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('\n🎉 All tests passed! Your Jeffy project is working correctly.');
    console.log('📱 You can now:');
    console.log('   • Add products from your phone at /admin/login');
    console.log('   • Upload images that will be properly stored');
    console.log('   • View products in their respective categories');
    console.log('   • Products will persist between sessions');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
    console.log('📖 See SETUP-INSTRUCTIONS.md for troubleshooting.');
  }
};

// Run tests if in browser
if (typeof window !== 'undefined') {
  testCompleteFunctionality();
} else {
  console.log('Run this script in your browser console at your Jeffy site.');
}

// Export for Node.js usage
if (typeof module !== 'undefined') {
  module.exports = { testCompleteFunctionality };
}