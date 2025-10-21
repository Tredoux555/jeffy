/**
 * SIMPLE PRODUCT UPLOAD TEMPLATE
 * 
 * Copy this template and fill in your product details.
 * Then run: node upload-product.js
 */

// ========================================
// PRODUCT UPLOAD TEMPLATE
// ========================================

const productData = {
  // Basic Information
  name: "YOUR PRODUCT NAME HERE",
  description: "Detailed description of your product. Include key features, benefits, and what makes it special. Be descriptive and engaging to help customers understand the value.",
  price: 29.99,                    // Current price
  originalPrice: 39.99,           // Original price (for discount display)
  category: "archery",            // Category: archery, gym, camping, kitchen, beauty, electronics, sports, home-garden
  
  // Ratings & Reviews
  rating: 4.5,                    // Rating out of 5
  reviewCount: 127,               // Number of reviews
  
  // Availability
  inStock: true,                  // true or false
  display: true,                  // true to show on website, false to hide
  
  // SEO & Organization
  tags: ["tag1", "tag2", "tag3"], // Relevant tags
  
  // Product Details
  features: [
    "Key feature 1",
    "Key feature 2", 
    "Key feature 3",
    "Key feature 4"
  ],
  
  specifications: {
    "Spec 1": "Value 1",
    "Spec 2": "Value 2",
    "Spec 3": "Value 3"
  }
};

// Image URLs - Replace with actual image URLs
const imageUrls = [
  "https://images.unsplash.com/photo-XXXXX?w=800&h=800&fit=crop&crop=center",
  "https://images.unsplash.com/photo-XXXXX?w=800&h=800&fit=crop&crop=center",
  "https://images.unsplash.com/photo-XXXXX?w=800&h=800&fit=crop&crop=center"
];

// ========================================
// CATEGORY OPTIONS
// ========================================
/*
archery     - Archery equipment and accessories
gym         - Fitness and gym equipment  
camping     - Camping and outdoor gear
kitchen     - Kitchen tools and appliances
beauty      - Beauty and skincare products
electronics - Electronic devices and gadgets
sports      - Sports equipment and gear
home-garden - Home and garden products
*/

// ========================================
// EXAMPLE USAGE
// ========================================
/*
const { uploadProductWithImages } = require('./upload-product.js');

uploadProductWithImages(productData, imageUrls)
  .then(() => console.log('✅ Product uploaded successfully!'))
  .catch(error => console.error('❌ Upload failed:', error.message));
*/




