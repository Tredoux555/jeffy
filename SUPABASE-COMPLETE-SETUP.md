# 🚀 Complete Supabase Setup for Jeffy Project

## 📋 Step-by-Step Guide (10 minutes total)

### **Step 1: Create Supabase Project (3 minutes)**

1. **Go to** [supabase.com](https://supabase.com)
2. **Click "Start your project"** (top right)
3. **Sign up/Login** with GitHub (recommended)
4. **Click "New Project"**
5. **Fill in project details:**
   - **Name:** `jeffy`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to you (e.g., "US East" for US)
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for setup to complete

### **Step 2: Create Database Table (2 minutes)**

1. **In Supabase dashboard** → **SQL Editor** (left sidebar)
2. **Click "New query"**
3. **Copy and paste this SQL code:**

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_display ON products(display);

-- Insert sample products
INSERT INTO products (id, name, description, price, original_price, category, images, rating, review_count, in_stock, display) VALUES
('sample-1', 'Sample Archery Product', 'High-quality archery equipment', 29.99, 39.99, 'archery', ARRAY['/products/sample-1.jpg'], 4.5, 10, true, true),
('sample-2', 'Sample Kitchen Product', 'Professional kitchen tool', 49.99, 59.99, 'kitchen', ARRAY['/products/sample-2.jpg'], 4.2, 8, true, true)
ON CONFLICT (id) DO NOTHING;
```

4. **Click "Run"** button
5. **Should see "Success" message** ✅

### **Step 3: Set Up Storage Bucket (2 minutes)**

1. **Go to Storage** (left sidebar)
2. **Click "Create a new bucket"**
3. **Fill in:**
   - **Name:** `product-images`
   - **Public bucket:** ✅ Check this box
4. **Click "Create bucket"**
5. **Go to "Policies" tab**
6. **Click "New Policy"**
7. **Select "For full customization"**
8. **Paste this policy:**

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

9. **Click "Review"** then **"Save policy"**

### **Step 4: Get API Keys (1 minute)**

1. **Go to Settings** → **API** (left sidebar)
2. **Copy these values:**
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### **Step 5: Update Environment Variables (1 minute)**

1. **Open** `.env.local` file in your project
2. **Replace the placeholder values:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

3. **Save the file**

### **Step 6: Deploy (1 minute)**

Run these commands in your terminal:

```bash
git add .env.local
git commit -m "Add Supabase environment variables"
git push
```

## 🎯 What This Gives You:

- ✅ **Products persist forever** (no more disappearing!)
- ✅ **Image storage** in Supabase Storage
- ✅ **Real-time updates** across all devices
- ✅ **Better performance** with database queries
- ✅ **Scalable** to thousands of products
- ✅ **Free forever** (up to 50,000 products)

## 🧪 Test It:

1. **Go to** jeffy.co.za/admin/login
2. **Create a new product** with images
3. **Check main site** - product should appear
4. **Refresh page** - product should still be there!

## 🔧 Troubleshooting:

**If you get errors:**
- Check your environment variables are correct
- Make sure you ran the SQL script
- Verify the storage bucket is public
- Check Vercel logs for any errors

**Need help?** The setup should take less than 10 minutes total!
