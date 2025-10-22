// Supabase Connection Test Script
// Run this in your browser console after setting up Supabase

const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check environment variables
    console.log('📋 Step 1: Checking environment variables...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error('❌ Environment variables not set');
      return;
    }
    
    if (url.includes('placeholder') || url.includes('your-project-id')) {
      console.error('❌ Environment variables still contain placeholder values');
      return;
    }
    
    console.log('✅ Environment variables configured');
    
    // Test 2: Test API connection
    console.log('📋 Step 2: Testing API connection...');
    const response = await fetch('/api/products');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('✅ API connection successful');
    console.log(`📦 Products loaded: ${products.length}`);
    
    // Test 3: Test product creation
    console.log('📋 Step 3: Testing product creation...');
    const testProduct = {
      name: 'Test Product',
      category: 'archery',
      price: 29.99,
      description: 'Test product for Supabase connection'
    };
    
    const createResponse = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Create API returned ${createResponse.status}`);
    }
    
    const createResult = await createResponse.json();
    console.log('✅ Product creation successful');
    console.log('📦 Created product:', createResult.product?.name);
    
    // Test 4: Test image upload
    console.log('📋 Step 4: Testing image upload...');
    const testImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', testImage);
    formData.append('productId', 'test');
    formData.append('imageIndex', '0');
    
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload API returned ${uploadResponse.status}`);
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('✅ Image upload successful');
    console.log('📁 Uploaded file:', uploadResult.filename);
    
    console.log('🎉 All tests passed! Supabase is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('💡 Check the setup guide: SUPABASE-COMPLETE-SETUP.md');
  }
};

// Run the test
testSupabaseConnection();
