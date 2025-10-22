# 🚀 EASIEST Supabase Setup - 5 Minutes Total

## ⚡ Super Quick Setup (Copy & Paste Method):

### **Step 1: Create Supabase Project (2 minutes)**
1. **Go to** [supabase.com](https://supabase.com)
2. **Click "Start your project"**
3. **Sign up with GitHub** (one click)
4. **Click "New Project"**
5. **Fill in:**
   - **Name:** `jeffy`
   - **Password:** `jeffy2024` (easy to remember)
   - **Region:** `US East` (or closest to you)
6. **Click "Create new project"**
7. **Wait 2 minutes** ⏰

### **Step 2: Create Database (1 minute)**
1. **Click "SQL Editor"** (left sidebar)
2. **Click "New query"**
3. **Copy this EXACT code and paste:**

```sql
CREATE TABLE products (
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

4. **Click "Run"** ✅

### **Step 3: Get Your Keys (30 seconds)**
1. **Click "Settings"** → **"API"** (left sidebar)
2. **Copy these 2 things:**
   - **Project URL** (starts with https://)
   - **Anon public key** (starts with eyJ)

### **Step 4: Update Your Project (1 minute)**
1. **Open** `.env.local` file in your project
2. **Replace the lines with your actual values:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-url-here.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
```

3. **Save the file**

### **Step 5: Deploy (30 seconds)**
**Run these commands:**

```bash
git add .env.local
git commit -m "Add Supabase"
git push
```

## 🎉 **DONE! That's it!**

**Your products will now persist forever!**

## 🧪 **Test It:**
1. **Go to** jeffy.co.za/admin/login
2. **Create a product**
3. **Refresh the page** - it should still be there! ✅

## 🔧 **If Something Goes Wrong:**
- **Check** your URL and key are correct
- **Make sure** you ran the SQL code
- **Wait** 2 minutes after creating project

**Total time: 5 minutes maximum!** 🚀
