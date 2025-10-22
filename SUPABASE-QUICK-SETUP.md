# 🚀 Complete Supabase Setup - Step by Step

## 📋 What You Need to Do:

### **Step 1: Create Supabase Project (5 minutes)**

1. **Go to** [supabase.com](https://supabase.com)
2. **Click "Start your project"**
3. **Sign up with GitHub** (easiest option)
4. **Click "New Project"**
5. **Fill in:**
   - **Name:** `jeffy`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to you
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for setup

### **Step 2: Create Database Table (2 minutes)**

1. **In Supabase dashboard** → **SQL Editor** (left sidebar)
2. **Copy the entire contents** of `supabase-setup.sql` file
3. **Paste into SQL Editor**
4. **Click "Run"** button
5. **✅ You should see "Success" message**

### **Step 3: Get API Keys (1 minute)**

1. **Go to Settings** → **API** (left sidebar)
2. **Copy these values:**
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### **Step 4: Update Environment Variables (1 minute)**

1. **Open** `.env.local` file in your project
2. **Replace the placeholder values:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
3. **Save the file**

### **Step 5: Deploy (1 minute)**

Run these commands:
```bash
git add .env.local
git commit -m "Add Supabase environment variables"
git push
```

## 🎯 What This Gives You:

- ✅ **Products persist forever** (no more disappearing!)
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
- Check Vercel logs for any errors

**Need help?** The setup should take less than 10 minutes total!
