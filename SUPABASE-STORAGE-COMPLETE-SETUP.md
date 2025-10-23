# 🖼️ Supabase Storage Setup for Image Uploads

## ✅ Complete Setup Guide

This guide ensures your product images upload correctly from both mobile and desktop.

---

## 📋 Step 1: Create Storage Bucket

### Option A: Automatic (Recommended)
The app will automatically create the bucket on first upload. Just make sure you have:
- ✅ Service role key configured in `.env.local`
- ✅ Supabase project created

### Option B: Manual Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Enter these settings:
   - **Name:** `product-images`
   - **Public bucket:** ✅ YES (check this box)
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp`
5. Click **"Create bucket"**

---

## 📋 Step 2: Configure Storage Policies

### Using SQL Editor (Easiest)

1. Go to **SQL Editor** in Supabase dashboard
2. Paste and run this SQL:

```sql
-- Enable storage for product images bucket
-- Allow public access for reading images

-- Policy 1: Allow anyone to read (view) images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: Allow authenticated uploads (via service key)
CREATE POLICY "Service role can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Allow authenticated updates (via service key)
CREATE POLICY "Service role can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Policy 4: Allow authenticated deletes (via service key)
CREATE POLICY "Service role can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
```

3. Click **"Run"**

### Using Dashboard (Alternative)

1. Go to **Storage** → **Policies**
2. Click **"New Policy"**
3. Create 4 policies:

**Policy 1: Public Read**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'product-images'`

**Policy 2: Service Upload**
- Policy name: `Service role upload`
- Allowed operation: `INSERT`
- Target roles: `service_role`
- WITH CHECK: `bucket_id = 'product-images'`

**Policy 3: Service Update**
- Policy name: `Service role update`
- Allowed operation: `UPDATE`
- Target roles: `service_role`
- USING expression: `bucket_id = 'product-images'`

**Policy 4: Service Delete**
- Policy name: `Service role delete`
- Allowed operation: `DELETE`
- Target roles: `service_role`
- USING expression: `bucket_id = 'product-images'`

---

## 📋 Step 3: Update Environment Variables

Make sure your `.env.local` has ALL three keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT:** The service key is required for image uploads!

---

## 🧪 Testing Image Upload

### Test 1: From Desktop Admin
1. Start server: `npm run dev`
2. Go to http://localhost:3000/admin/dashboard
3. Create new product
4. Upload images
5. Check console for: `✅ File uploaded to Supabase Storage`

### Test 2: From Mobile Device
1. Make sure server is accessible from mobile (use your local IP)
2. Open admin on mobile browser
3. Create product and upload images
4. Should see success message

### Test 3: Verify in Supabase
1. Go to Supabase **Storage** dashboard
2. Click on `product-images` bucket
3. You should see uploaded files

---

## 🐛 Troubleshooting

### Problem: "Supabase admin client not configured"
**Solution:** Add service role key to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-service-role-key
```

### Problem: "Bucket does not exist"
**Solution:** 
1. App will try to create it automatically
2. Or create manually in Supabase dashboard (see Step 1)

### Problem: "Permission denied"
**Solution:** Set up storage policies (see Step 2)

### Problem: "Upload timeout"
**Solution:** 
- Check internet connection
- File might be too large (max 10MB)
- Try compressing image first

### Problem: Images show but are broken links
**Solution:**
- Check bucket is set to **public**
- Verify storage policies allow public read

### Problem: Mobile uploads fail
**Solution:**
- Check mobile device has internet
- Verify server is accessible from mobile
- Try smaller images (< 5MB for mobile)

---

## 📱 Mobile Upload Optimization

The upload system is optimized for mobile:
- ✅ Larger timeout (60 seconds vs 30 seconds)
- ✅ Generous file size limit (10MB)
- ✅ Better error handling
- ✅ Connection detection
- ✅ Automatic retry on failure

---

## 🔐 Security Notes

1. **Service Role Key:** 
   - Keep it secret!
   - Never commit to git
   - Only use server-side (API routes)

2. **Public Bucket:**
   - Images are publicly accessible (this is intentional)
   - Anyone with URL can view images
   - This is normal for e-commerce product images

3. **Upload Permissions:**
   - Only server can upload (via service key)
   - Users can't upload directly to Supabase
   - Uploads go through your API route first

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Supabase project created
- [ ] `product-images` bucket exists
- [ ] Bucket is set to **public**
- [ ] Storage policies configured
- [ ] All 3 environment variables set
- [ ] Service key is correct (not anon key)
- [ ] Test upload works locally
- [ ] Test upload works on mobile
- [ ] Images display correctly
- [ ] Environment variables added to Vercel

---

## 🚀 Deploy to Production

### Add Environment Variables to Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_SERVICE_KEY`
5. Select **Production**, **Preview**, **Development**
6. Click **Save**
7. Redeploy your app

---

## 📞 Still Having Issues?

Check these:
1. Console logs in browser (F12)
2. Vercel deployment logs
3. Supabase logs (Dashboard → Logs)
4. Network tab to see actual upload requests

Common issues are usually:
- Wrong service key (using anon key instead)
- Bucket not public
- Missing storage policies
- Environment variables not set in Vercel

---

**Last Updated:** 2025-10-23  
**Status:** ✅ Syntax error fixed, ready for deployment
