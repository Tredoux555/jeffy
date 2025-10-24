#!/usr/bin/env node

/**
 * Supabase Setup Script for Jeffy Project
 * Run this script to validate and test your Supabase configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Jeffy Project - Supabase Setup Validator\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found');
  console.log('✨ Creating .env.local template...\n');
  
  const envTemplate = `# Supabase Configuration for Jeffy Project
# Replace these placeholder values with your actual Supabase project details
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Instructions:
# 1. Go to https://supabase.com
# 2. Create a new project (name: jeffy, password: jeffy2024)
# 3. Go to Settings > API
# 4. Copy your Project URL and replace the URL above
# 5. Copy your anon/public key and replace the ANON_KEY above
# 6. Copy your service_role key and replace the SERVICE_ROLE_KEY above
# 7. Save this file and run: npm run dev
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('📝 Please edit .env.local with your actual Supabase credentials');
  console.log('📖 Follow the instructions in SETUP-INSTRUCTIONS.md\n');
  process.exit(0);
}

// Read and validate environment variables
console.log('📋 Checking .env.local configuration...');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvValue = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

console.log('🔍 Environment Variables:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   SERVICE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}\n`);

// Check for placeholder values
const hasPlaceholders = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  !supabaseServiceKey ||
  supabaseUrl.includes('your-project-id') ||
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseServiceKey.includes('your-service-role-key');

if (hasPlaceholders) {
  console.log('⚠️  Placeholder values detected in .env.local');
  console.log('📝 Please replace placeholder values with your actual Supabase credentials');
  console.log('📖 Follow the instructions in SETUP-INSTRUCTIONS.md\n');
  
  console.log('🔗 Quick Setup Links:');
  console.log('   • Supabase Dashboard: https://supabase.com/dashboard');
  console.log('   • Create Project: https://supabase.com/dashboard/new');
  console.log('   • API Settings: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api\n');
  process.exit(1);
}

console.log('✅ Environment variables configured!');
console.log('🎯 Next steps:');
console.log('   1. Make sure you created the products table in Supabase');
console.log('   2. Create the product-images storage bucket');
console.log('   3. Run: npm run dev');
console.log('   4. Test by adding a product at /admin/login\n');

console.log('📖 For detailed setup instructions, see: SETUP-INSTRUCTIONS.md');

// SQL for easy copy-paste
console.log('\n📋 SQL to run in Supabase (copy this):');
console.log('─'.repeat(50));
console.log(`CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  review_count NUMERIC DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  display BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
console.log('─'.repeat(50));