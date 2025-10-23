// Script to create Supabase Storage bucket for product images
// Run this with: node setup-supabase-storage.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables not found in .env.local');
  console.log('Please make sure you have:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupStorage() {
  try {
    console.log('🔄 Setting up Supabase Storage...');
    
    // Create the product-images bucket
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket "product-images" already exists');
      } else {
        console.error('❌ Error creating bucket:', bucketError);
        return;
      }
    } else {
      console.log('✅ Bucket "product-images" created successfully');
    }

    // Set bucket policies
    console.log('🔄 Setting up bucket policies...');
    
    // Allow public read access
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'product-images',
      policy_name: 'Public read access',
      policy_definition: 'true'
    });

    if (policyError) {
      console.log('⚠️ Policy creation failed (this is normal for some setups):', policyError.message);
    } else {
      console.log('✅ Storage policies set up');
    }

    console.log('🎉 Supabase Storage setup complete!');
    console.log('You can now upload images to your products.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupStorage();
