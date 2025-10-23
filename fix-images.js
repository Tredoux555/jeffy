#!/usr/bin/env node

/**
 * IMAGE FIXER SCRIPT
 * 
 * This script automatically fixes products with broken or null images
 * by assigning proper fallback images based on category.
 */

const fs = require('fs');
const path = require('path');

// Fallback images by category
const FALLBACK_IMAGES = {
  archery: [
    '/products/archery-bow.jpg',
    '/products/archery-bow-2.jpg'
  ],
  gym: [
    '/products/adjustable-dumbbells.jpg',
    '/products/dumbbells-2.jpg'
  ],
  camping: [
    '/products/camping-tent.jpg',
    '/products/tent-interior.jpg'
  ],
  kitchen: [
    '/products/chef-knives.jpg',
    '/products/chef-knives-2.jpg'
  ],
  beauty: [
    '/products/vitamin-c-serum.jpg'
  ],
  electronics: [
    '/products/headphones-1.jpg',
    '/products/camera-1.jpg'
  ],
  sports: [
    '/products/shoes-1.jpg'
  ],
  'home-garden': [
    '/products/chair-1.jpg',
    '/products/coffee-1.jpg'
  ]
};

async function fixBrokenImages() {
  try {
    console.log('🔍 Checking for products with broken images...');
    
    // Fetch all products
    const response = await fetch('http://localhost:3000/api/products?includeHidden=true');
    const products = await response.json();
    
    let fixedCount = 0;
    
    for (const product of products) {
      const hasBrokenImages = !product.images || 
                             product.images.length === 0 || 
                             product.images.includes(null) || 
                             product.images.includes('') ||
                             product.images.includes('null');
      
      if (hasBrokenImages && FALLBACK_IMAGES[product.category]) {
        console.log(`🔧 Fixing images for: ${product.name}`);
        
        const updateResponse = await fetch(`http://localhost:3000/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: FALLBACK_IMAGES[product.category]
          }),
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Fixed: ${product.name}`);
          fixedCount++;
        } else {
          console.error(`❌ Failed to fix: ${product.name}`);
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} products with broken images!`);
    
  } catch (error) {
    console.error('❌ Error fixing images:', error.message);
  }
}

// Run the fixer
fixBrokenImages();






