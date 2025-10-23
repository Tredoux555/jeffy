import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

// Only create client if properly configured
let supabase: any = null;
let supabaseAdmin: any = null;

if (supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')) {
  
  console.log('✅ Supabase properly configured');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Create admin client for uploads if service key is available
  if (supabaseServiceKey && !supabaseServiceKey.includes('your-service-key')) {
    console.log('✅ Supabase service key configured for admin operations');
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
} else {
  console.log('⚠️ Supabase not configured, using fallback mode');
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
