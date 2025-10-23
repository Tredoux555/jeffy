// Script to upload sample images for all products to Supabase Storage
// Run with: node upload-sample-images.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase environment variables not found');
  console.log('Please make sure you have:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-service-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Product data from the products.ts file
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'electronics',
    images: ['/products/headphones-1.jpg', '/products/headphones-1.jpg', '/products/headphones-1.jpg']
  },
  {
    id: '2',
    name: 'Smart Home Security Camera',
    category: 'electronics',
    images: ['/products/camera-1.jpg', '/products/camera-1.jpg']
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    category: 'home-garden',
    images: ['/products/chair-1.jpg', '/products/chair-1.jpg', '/products/chair-1.jpg']
  },
  {
    id: '4',
    name: 'Premium Coffee Maker',
    category: 'home-garden',
    images: ['/products/coffee-1.jpg', '/products/coffee-1.jpg']
  },
  {
    id: '5',
    name: 'Running Shoes',
    category: 'sports',
    images: ['/products/shoes-1.jpg', '/products/shoes-1.jpg', '/products/shoes-1.jpg']
  },
  {
    id: '6',
    name: 'Professional Compound Bow',
    category: 'archery',
    images: ['/products/archery-bow.jpg', '/products/archery-bow-2.jpg']
  },
  {
    id: '8',
    name: 'Professional Chef Knife Set',
    category: 'kitchen',
    images: ['/products/chef-knives.jpg', '/products/chef-knives-2.jpg']
  },
  {
    id: '10',
    name: 'Adjustable Dumbbells (50 lbs)',
    category: 'gym',
    images: ['/products/adjustable-dumbbells.jpg', '/products/dumbbells-2.jpg']
  },
  {
    id: '12',
    name: '4-Person Camping Tent',
    category: 'camping',
    images: ['/products/camping-tent.jpg', '/products/tent-interior.jpg']
  },
  {
    id: '14',
    name: 'Vitamin C Serum',
    category: 'beauty',
    images: ['/products/vitamin-c-serum.jpg']
  },
  {
    id: '16',
    name: 'Dibear Gym Gloves',
    category: 'gym',
    images: ['/products/dibear-gym-gloves.jpg', '/products/dibear-gym-gloves-2.jpg', '/products/dibear-gym-gloves-3.jpg', '/products/dibear-gym-gloves-4.jpg']
  }
];

// Function to generate placeholder image URL based on product name
function generatePlaceholderImage(productName, index = 0) {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
  const color = colors[index % colors.length];
  
  // Clean product name for URL
  const cleanName = productName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 30);
  
  return `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${encodeURIComponent(cleanName)}`;
}

// Function to download image and convert to buffer
async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(productId, imageIndex, imageUrl, productName) {
  try {
    console.log(`📤 Uploading image ${imageIndex + 1} for ${productName}...`);
    
    // Download the placeholder image
    const imageBuffer = await downloadImage(imageUrl);
    
    // Generate filename
    const timestamp = Date.now();
    const filename = `product-${productId}-${imageIndex}-${timestamp}.jpg`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, imageBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);

    console.log(`✅ Uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
    
  } catch (error) {
    console.error(`❌ Failed to upload image for ${productName}:`, error);
    throw error;
  }
}

// Function to update product in database
async function updateProductImages(productId, newImageUrls) {
  try {
    console.log(`🔄 Updating product ${productId} with new images...`);
    
    const { data, error } = await supabase
      .from('products')
      .update({ 
        images: newImageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select();

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log(`✅ Updated product ${productId} in database`);
    return data;
    
  } catch (error) {
    console.error(`❌ Failed to update product ${productId}:`, error);
    throw error;
  }
}

// Main function to process all products
async function uploadAllSampleImages() {
  try {
    console.log('🚀 Starting sample image upload for all products...');
    
    for (const product of products) {
      console.log(`\n📦 Processing product: ${product.name} (ID: ${product.id})`);
      
      const newImageUrls = [];
      
      // Upload each image for this product
      for (let i = 0; i < product.images.length; i++) {
        try {
          const placeholderUrl = generatePlaceholderImage(product.name, i);
          const uploadedUrl = await uploadImageToSupabase(product.id, i, placeholderUrl, product.name);
          newImageUrls.push(uploadedUrl);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`⚠️ Skipping image ${i + 1} for ${product.name}:`, error.message);
        }
      }
      
      // Update product in database if we have new images
      if (newImageUrls.length > 0) {
        await updateProductImages(product.id, newImageUrls);
      }
      
      console.log(`✅ Completed ${product.name}: ${newImageUrls.length} images uploaded`);
    }
    
    console.log('\n🎉 All sample images uploaded successfully!');
    console.log('📊 Summary:');
    console.log(`- Products processed: ${products.length}`);
    console.log(`- Total images uploaded: ${products.reduce((sum, p) => sum + p.images.length, 0)}`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
uploadAllSampleImages();
