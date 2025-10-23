# ✅ Vercel Deployment Checklist

## Before You Deploy

### 1. Supabase Setup
- [ ] Supabase project created
- [ ] Database table created (ran `supabase-setup.sql`)
- [ ] Storage bucket `product-images` created (or will auto-create)
- [ ] Bucket is set to **public**
- [ ] Have all 3 API keys ready:
  - [ ] Project URL
  - [ ] Anon key
  - [ ] Service role key

### 2. Environment Variables
- [ ] `.env.local` configured locally
- [ ] All 3 variables tested locally
- [ ] App works with `npm run dev`

### 3. Code Quality
- [ ] No linter errors
- [ ] All syntax errors fixed
- [ ] Upload route syntax error fixed (line 204)

---

## Deploying to Vercel

### Step 1: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **jeffy**
3. Click **Settings** → **Environment Variables**
4. Add each variable:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3 (MOST IMPORTANT):**
```
Name: NEXT_PUBLIC_SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production ✅ Preview ✅ Development
```

5. Click **Save** for each

### Step 2: Commit and Push

```bash
git add .
git commit -m "Fix upload route syntax error and add Supabase configuration"
git push origin cursor/fix-jeffy-product-upload-and-supabase-link-2c29
```

### Step 3: Monitor Deployment

1. Vercel will auto-deploy on push
2. Watch the build logs
3. Look for: ✅ Build completed successfully
4. Should NOT see syntax errors

### Step 4: Test Production

1. Visit your deployed URL
2. Go to `/admin/dashboard`
3. Create a test product
4. Upload images from both:
   - [ ] Desktop browser
   - [ ] Mobile browser
5. Verify images display correctly
6. Check Supabase Storage dashboard for uploaded files

---

## 🐛 If Build Fails

### Error: "Expression expected" in upload/route.ts
**Fixed!** The orphaned `else` block has been removed.

### Error: Environment variables not found
**Solution:** Add variables to Vercel (see Step 1 above)

### Error: Supabase connection failed
**Solution:** 
1. Verify all 3 keys are correct
2. Check keys don't have trailing spaces
3. Make sure service role key is NOT the anon key

### Build succeeds but uploads fail
**Solution:**
1. Check Vercel logs for errors
2. Verify service key is set in Vercel
3. Create bucket manually in Supabase
4. Check storage policies

---

## 📱 Testing Mobile Upload

### Local Testing (Before Deploy)
```bash
# 1. Find your local IP
ipconfig getifaddr en0  # Mac
hostname -I             # Linux
ipconfig              # Windows

# 2. Start server
npm run dev

# 3. Access from mobile
http://YOUR_IP:3000/admin/dashboard

# 4. Test upload
```

### Production Testing (After Deploy)
1. Visit production URL on mobile
2. Go to admin dashboard
3. Upload product with images
4. Should complete in < 60 seconds
5. Images should display immediately

---

## ✅ Success Indicators

### In Vercel Logs:
```
✅ Build completed
✅ Detected Next.js version: 15.5.4
✅ Creating an optimized production build
✅ Finished
```

### In Browser Console (Production):
```
✅ Supabase properly configured
✅ Supabase service key configured for admin operations
✅ File uploaded to Supabase Storage
```

### In Supabase Dashboard:
- Storage bucket has uploaded files
- Files are publicly accessible
- File URLs work in browser

---

## 🚀 Post-Deployment

### Test Checklist
- [ ] Homepage loads
- [ ] Products display
- [ ] Admin dashboard accessible
- [ ] Can create new product
- [ ] Can upload images (desktop)
- [ ] Can upload images (mobile)
- [ ] Images display on product page
- [ ] Product saves to database
- [ ] Products persist after refresh

### Monitor
- Vercel logs for errors
- Supabase logs for database issues
- Browser console for client errors
- Mobile browser for mobile-specific issues

---

## 📊 Expected Behavior

### First Upload:
1. App detects no bucket exists
2. Creates `product-images` bucket automatically
3. Sets bucket to public
4. Uploads file
5. Returns public URL

### Subsequent Uploads:
1. Uploads directly to existing bucket
2. Returns public URL immediately
3. Should complete in 5-30 seconds

### Mobile Uploads:
- Longer timeout (60s vs 30s)
- Same functionality as desktop
- May take longer on slow connections

---

## 🔐 Security Notes

### What's Public:
- Product images (intentionally public)
- Product data (meant for display)
- Anon key (safe to expose)

### What's Secret:
- Service role key (server-only, never expose in client code)
- Environment variables in Vercel

### Verification:
- Service key only used in API routes (✅ correct)
- Client code uses anon key (✅ correct)
- Images stored in public bucket (✅ correct for e-commerce)

---

## 📞 Need Help?

### Check:
1. Vercel deployment logs
2. Supabase logs
3. Browser console
4. Network tab (F12)

### Common Issues:
- **Wrong service key:** Using anon key instead of service role key
- **Missing env vars:** Not added to Vercel settings
- **Bucket not public:** Set bucket to public in Supabase
- **CORS issues:** Add your domain to Supabase allowed origins

---

## ✨ All Set!

Once you see ✅ in all checkboxes above, your deployment is complete and working!

**Next:** Start uploading products from your admin dashboard 🎉

---

**Last Updated:** 2025-10-23  
**Build Error Status:** ✅ FIXED (syntax error removed)
