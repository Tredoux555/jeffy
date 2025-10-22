# Supabase Database Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project → Name it "jeffy"

### Step 2: Set Up Database Table
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `supabase-setup.sql` file
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ Your table is created!

### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### Step 4: Add Environment Variables
1. Create `.env.local` file in your project root
2. Add these lines:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```
3. Replace the values with your actual keys

### Step 5: Deploy
1. Commit and push your changes
2. Vercel will automatically deploy
3. ✅ Your database is connected!

## 🚀 What This Gives You

- ✅ **Persistent product storage** (products won't disappear)
- ✅ **Real-time updates** (changes appear instantly)
- ✅ **Better performance** (database queries)
- ✅ **Scalable** (handles thousands of products)
- ✅ **Free forever** (up to 50,000 rows)

## 🧪 Test It

1. Go to your admin dashboard
2. Create a new product
3. Check if it appears on your main site
4. Products should now persist between deployments!

## 🔧 Troubleshooting

**If products don't appear:**
- Check your environment variables are correct
- Make sure you ran the SQL setup script
- Check Vercel logs for errors

**Need help?** The setup is complete - just follow the steps above!
