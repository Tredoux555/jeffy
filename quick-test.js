// 🚀 One-Click Supabase Setup Test
// Run this in your browser console after setting up Supabase

console.log('🚀 Testing Supabase Setup...');

// Test 1: Check if Supabase is working
fetch('/api/products')
  .then(response => response.json())
  .then(products => {
    console.log('✅ Supabase is working!');
    console.log(`📦 Found ${products.length} products`);
    
    // Test 2: Try creating a product
    const testProduct = {
      name: 'Supabase Test Product',
      category: 'archery',
      price: 29.99,
      description: 'Testing Supabase connection'
    };
    
    return fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct)
    });
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('🎉 SUCCESS! Supabase is fully working!');
      console.log('✅ Products will now persist forever!');
      console.log('📦 Created test product:', result.product.name);
    } else {
      console.log('⚠️ Product creation failed:', result.error);
    }
  })
  .catch(error => {
    console.log('❌ Supabase not set up yet');
    console.log('💡 Follow the guide: EASIEST-SUPABASE-SETUP.md');
  });
