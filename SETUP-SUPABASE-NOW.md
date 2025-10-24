# 🚀 URGENT: Fix Product Upload Issues - Supabase Setup

## 🔥 **Current Problem:**
- Products show "successfully added" but disappear
- Images show "successfully uploaded" but use placeholders
- Data is not persisting to database

## ✅ **Root Cause:**
Supabase environment variables are not configured, so the app falls back to temporary storage.

## 🛠️ **QUICK FIX (5 minutes):**

### Step 1: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Create new project: "jeffy"
4. Wait 2-3 minutes for setup

### Step 2: Get API Keys
1. In Supabase dashboard → Settings → API
2. Copy these values:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (click "Reveal" - starts with `eyJ...`)

### Step 3: Update Environment File
Replace the values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-actual-service-role-key-here
```

### Step 4: Create Database Table
1. In Supabase → SQL Editor
2. Run this SQL:

```sql
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
```

### Step 5: Create Storage Bucket
1. In Supabase → Storage
2. Create bucket: `product-images`
3. Make it **public**
4. Add this policy:

```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

### Step 6: Deploy
```bash
git add .env.local
git commit -m "Add Supabase configuration"
git push
```

## 🧪 **Test After Setup:**
1. Go to admin dashboard
2. Add a new product with images
3. Check if it appears in the main site
4. Refresh page - product should still be there!

## 🆘 **If Still Not Working:**
Check the browser console for errors and verify:
- Environment variables are correct
- Database table was created
- Storage bucket is public
- Service role key has proper permissions

**This should fix all product upload issues!**