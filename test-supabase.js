// Test Supabase Connection
// Run this in your browser console after setting up Supabase

const testSupabase = async () => {
  try {
    // Test if environment variables are set
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔍 Checking Supabase configuration...');
    console.log('URL:', url ? '✅ Set' : '❌ Missing');
    console.log('Key:', key ? '✅ Set' : '❌ Missing');
    
    if (!url || !key) {
      console.log('❌ Supabase not configured. Please set environment variables.');
      return;
    }
    
    // Test database connection
    const response = await fetch('/api/products');
    const products = await response.json();
    
    console.log('✅ Supabase connection successful!');
    console.log('📦 Products loaded:', products.length);
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
  }
};

// Run the test
testSupabase();
