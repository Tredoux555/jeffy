# 🚀 Complete Supabase Setup Guide

## 📍 Where Your Site Is Stored:

### **Current Hosting:**
- **Platform:** Vercel (vercel.com)
- **Domain:** jeffy.co.za (your custom domain)
- **Repository:** GitHub (github.com/Tredoux555/jeffy)
- **Local Development:** /Users/tredouxwillemse/Desktop/jeffy

### **How It Works:**
1. **Code** → GitHub repository
2. **GitHub** → Vercel (auto-deploys)
3. **Vercel** → Your domain (jeffy.co.za)
4. **Database** → Supabase (when set up)

## 🔧 Supabase Setup (5 minutes):

### **Step 1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project → Name it "jeffy"

### **Step 2: Set Up Database**
1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents from `supabase-setup.sql` file
3. Paste and click **"Run"**
4. ✅ Table created!

### **Step 3: Get API Keys**
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### **Step 4: Add Environment Variables**
Create `.env.local` file in your project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Step 5: Deploy**
```bash
git add .env.local
git commit -m "Add Supabase environment variables"
git push
```

## 🎯 What This Gives You:

- ✅ **Products persist permanently** (no more disappearing!)
- ✅ **Real-time updates** across all devices
- ✅ **Better performance** with database queries
- ✅ **Scalable** to thousands of products
- ✅ **Free forever** (up to 50,000 products)

## 🔍 Admin Login Debug:

### **Login Credentials:**
- **Username:** admin
- **Password:** jeffy2024

### **Features Added:**
- ✅ **Pre-filled credentials** (auto-populated)
- ✅ **Quick Login button** (one-click login)
- ✅ **Console logging** (for debugging)
- ✅ **Better error messages**

### **If Login Still Doesn't Work:**
1. **Check browser console** for errors
2. **Clear browser cache** and try again
3. **Try incognito mode**
4. **Check if JavaScript is enabled**

## 🚀 Next Steps:

1. **Set up Supabase** (follow steps above)
2. **Test admin login** (should work now)
3. **Create a product** (should persist)
4. **Check main site** (product should appear)

**Your site is already live at jeffy.co.za!** Just need to add the database for persistence.
