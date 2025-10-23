import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Function to generate placeholder image URL
function generatePlaceholderImage(productName: string, category: string) {
  const colors = {
    'electronics': '4ECDC4',
    'archery': 'FF6B6B', 
    'kitchen': '45B7D1',
    'gym': '96CEB4',
    'camping': 'FFEAA7',
    'beauty': 'DDA0DD',
    'home-garden': '98D8C8',
    'sports': 'F7DC6F'
  };
  
  const color = colors[category as keyof typeof colors] || 'FF6B6B';
  const cleanName = productName.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20);
  
  return `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${encodeURIComponent(cleanName)}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not configured' 
      }, { status: 500 });
    }

    console.log('🚀 Adding placeholder images to all products...');
    
    // Get all products
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, category, images');

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch products: ' + error.message 
      }, { status: 500 });
    }

    const results = [];
    let updatedCount = 0;

    for (const product of products || []) {
      try {
        console.log(`📦 Updating images for: ${product.name}`);
        
        // Generate placeholder images
        const placeholderImages = [
          generatePlaceholderImage(product.name, product.category),
          generatePlaceholderImage(product.name + ' 2', product.category),
          generatePlaceholderImage(product.name + ' 3', product.category)
        ];

        // Update product with placeholder images
        const { data, error: updateError } = await supabaseAdmin
          .from('products')
          .update({ 
            images: placeholderImages,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id)
          .select();

        if (updateError) {
          console.error(`❌ Failed to update ${product.name}:`, updateError);
          results.push({
            productId: product.id,
            productName: product.name,
            status: 'failed',
            error: updateError.message
          });
        } else {
          console.log(`✅ Updated ${product.name} with placeholder images`);
          updatedCount++;
          results.push({
            productId: product.id,
            productName: product.name,
            status: 'success',
            images: placeholderImages
          });
        }
        
      } catch (error) {
        console.error(`❌ Error updating ${product.name}:`, error);
        results.push({
          productId: product.id,
          productName: product.name,
          status: 'error',
          error: (error as Error).message
        });
      }
    }
    
    console.log(`🎉 Placeholder images update complete! ${updatedCount}/${products?.length} updated`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Placeholder images added successfully',
      summary: {
        totalProducts: products?.length || 0,
        updatedCount: updatedCount,
        results: results
      }
    });
    
  } catch (error) {
    console.error('❌ Error adding placeholder images:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Placeholder images update failed: ' + (error as Error).message 
    }, { status: 500 });
  }
}
