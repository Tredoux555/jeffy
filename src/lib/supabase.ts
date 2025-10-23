import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

// Helper function to check if a value is valid
const isValidValue = (value: string | undefined): boolean => {
  if (!value) return false;
  const invalidPatterns = ['placeholder', 'your-project-id', 'your-anon-key', 'your-service-key', 'your-service-role-key'];
  return !invalidPatterns.some(pattern => value.includes(pattern));
};

// Only create client if properly configured
let supabase: any = null;
let supabaseAdmin: any = null;

if (isValidValue(supabaseUrl) && isValidValue(supabaseAnonKey)) {
  console.log('✅ Supabase properly configured');
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  
  // Create admin client for uploads if service key is available
  if (isValidValue(supabaseServiceKey)) {
    console.log('✅ Supabase service key configured for admin operations');
    supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
  } else {
    console.log('⚠️ Supabase service key not configured - using anon key for admin operations');
    // Use anon key as fallback for admin operations
    supabaseAdmin = supabase;
  }
} else {
  console.log('⚠️ Supabase not configured, using fallback mode');
  console.log('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export { supabase, supabaseAdmin };

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  images: string[]
  videos: string[]
  rating: number
  review_count: number
  in_stock: boolean
  display: boolean
  created_at: string
  updated_at: string
}
