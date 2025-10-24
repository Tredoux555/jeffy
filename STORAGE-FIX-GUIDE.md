# 🔧 FIX: Product Images Not Displaying

## Root Cause Found!
Your product images are being uploaded to Supabase Storage, but they're not displaying because the storage bucket doesn't have the correct Row Level Security (RLS) policies to allow public read access.

## The Issue:
Even though the bucket might be marked as "public", Supabase uses RLS policies to control access. Without the right policies, images can't be viewed publicly.

## 🚀 Quick Fix (30 seconds):

### Option 1: Using Supabase Dashboard (Easiest)

1. **Go to** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Open your "jeffy" project**
3. **Click "Storage"** in the left sidebar
4. **Click on the `product-images` bucket**
5. **Click "Policies" tab**
6. **Click "New Policy"**
7. **Choose "For SELECT queries"**
8. **Fill in:**
   - **Policy name:** `Public Access to Product Images`
   - **Target roles:** `public` (or leave blank for all)
   - **USING expression:** `true`
9. **Click "Save"**

That's it! Your images should now display.

### Option 2: Using SQL (Fastest)

1. **Go to** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Open your "jeffy" project**
3. **Click "SQL Editor"** in the left sidebar
4. **Click "New Query"**
5. **Paste this SQL:**

```sql
-- Ensure bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';

-- Allow public read access to all objects in product-images bucket
CREATE POLICY IF NOT EXISTS "Public Access to Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

6. **Click "Run"**

Done! All your product images will now be publicly viewable.

## 🧪 Test It:

After applying the fix:

1. Go to your site: `https://jeffy.co.za/products/1761261890214`
2. The product image should now display correctly
3. Check the products page - all images should be visible

## 📝 Technical Details:

**What was happening:**
- Images were uploading successfully to Supabase Storage ✅
- Supabase was returning public URLs ✅
- BUT: RLS policies were blocking public read access ❌

**What the fix does:**
- Adds a SELECT policy that allows anyone to view images in the bucket
- This is safe because the bucket only contains product images (which should be public)

## 🔒 Security Note:

This policy allows **read-only** access to product images, which is exactly what you want for an e-commerce site. Users can view images but cannot delete or modify them.

---

**Need More Help?**

If images still don't display after this fix, check:
1. Browser console for CORS errors
2. Supabase logs for access denied errors
3. Verify the image URLs in your database are correct
