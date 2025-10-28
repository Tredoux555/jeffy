-- Fix Supabase Storage Policies for Product Images
-- This script ensures that product images are publicly accessible

-- Step 1: Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) 
DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Step 2: Remove any existing restrictive policies
DELETE FROM storage.policies WHERE bucket_id = 'product-images';

-- Step 3: Create a policy that allows ANYONE to SELECT (read/view) objects
CREATE POLICY "Public Access to Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Step 4: Create a policy that allows authenticated users to INSERT (upload)
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Step 5: Create a policy that allows authenticated users to UPDATE
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Step 6: Create a policy that allows authenticated users to DELETE
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- Verify the setup
SELECT 
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id = 'product-images';

SELECT 
  name,
  definition,
  action
FROM storage.policies 
WHERE bucket_id = 'product-images';
