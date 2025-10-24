# 🚀 Jeffy Project - Complete Setup Instructions

## Current Issues Identified:

1. **Supabase Not Configured** - Products are created but not persisted
2. **Image Upload Issues** - Images not properly uploaded to storage
3. **Environment Variables Missing** - Database connection not established

## 🔧 Quick Fix (5 Minutes):

### Step 1: Configure Supabase

1. **Go to** [supabase.com](https://supabase.com) and create/login to account
2. **Create new project** or use existing one
3. **Go to Settings > API** and copy:
   - Project URL
   - Anon/public key  
   - Service role key

### Step 2: Update Environment Variables

Open the `.env.local` file in your project root and replace with your actual values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

### Step 3: Create Database Table

In Supabase Dashboard:
1. **Go to SQL Editor**
2. **Run this query:**

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

### Step 4: Create Storage Bucket

In Supabase Dashboard:
1. **Go to Storage**
2. **Create new bucket** named `product-images`
3. **Make it public**
4. **Set policies** (or use RLS disabled for testing)

### Step 5: Restart Development Server

```bash
npm run dev
```

## 🧪 Test Your Setup:

1. **Go to** `/admin/login` 
2. **Login with admin credentials**
3. **Create a new product** with image upload
4. **Check if product appears** in the category pages
5. **Refresh page** - product should persist

## 🔍 Troubleshooting:

### Products Not Persisting:
- Check Supabase environment variables are correct
- Verify database table exists
- Check browser console for errors

### Images Not Uploading:
- Verify Supabase storage bucket exists and is public
- Check service role key is configured
- Images will fallback to local storage if Supabase fails

### Products Not Displaying:
- Check product category matches existing categories
- Verify `display` field is set to `true`
- Check browser console for API errors

## 📱 Mobile Upload Issues:

The system is optimized for mobile uploads with:
- Larger timeout limits for mobile devices
- Better error handling
- Fallback storage options

## 🎯 What's Fixed:

1. **Multi-tier Storage**: Supabase → Local → Placeholder fallback
2. **Better Error Handling**: Detailed logging and user feedback
3. **Mobile Optimization**: Extended timeouts and better detection
4. **Automatic Bucket Creation**: Creates storage bucket if missing
5. **Environment Setup**: Clear instructions and validation

## 🚀 Next Steps:

After setup, your Jeffy project will have:
- ✅ Persistent product storage in Supabase
- ✅ Real image uploads to Supabase Storage
- ✅ Proper product categorization and display
- ✅ Mobile-friendly admin interface
- ✅ Fallback systems for reliability

**Total setup time: 5-10 minutes**