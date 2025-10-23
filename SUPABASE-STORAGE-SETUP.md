# 🚨 URGENT: Supabase Storage Setup Required

## The Problem:
Your image uploads are failing because the Supabase Storage bucket `product-images` doesn't exist yet.

## 🔧 Quick Fix (2 minutes):

### Step 1: Go to Supabase Dashboard
1. **Go to** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Click your "jeffy" project**

### Step 2: Create Storage Bucket
1. **Click "Storage"** in the left menu
2. **Click "New bucket"**
3. **Fill in:**
   - **Name:** `product-images`
   - **Public bucket:** ✅ **Check this box**
4. **Click "Create bucket"**

### Step 3: Set Bucket Policies
1. **Click on the `product-images` bucket**
2. **Click "Policies" tab**
3. **Click "New policy"**
4. **Select "For full customization"**
5. **Fill in:**
   - **Policy name:** `Public read access`
   - **Policy definition:** `true`
6. **Click "Save policy"**

### Step 4: Test Upload
1. **Go to** `jeffy.co.za/admin/login`
2. **Try uploading an image**
3. **Should work now!**

## 🎯 What This Does:
- Creates a public storage bucket for your product images
- Allows anyone to view uploaded images
- Fixes the "read-only file system" error

## ⚡ Alternative (If Above Doesn't Work):
**Run this SQL in Supabase SQL Editor:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

-- Create public read policy
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES ('product-images', 'Public read access', 'true');
```

**After doing this, your image uploads will work perfectly!** 🚀
