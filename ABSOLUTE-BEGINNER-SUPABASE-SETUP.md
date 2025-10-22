# 🚀 Supabase Setup - ABSOLUTE BEGINNER GUIDE
## (Like you've never used a computer before!)

---

## 🤔 **What is Supabase?**
**Think of it like this:** Your website is like a restaurant, and Supabase is like a **permanent kitchen** where you store all your ingredients (products). Right now, your ingredients disappear every time the restaurant closes. Supabase makes them **stay forever**.

---

## 📋 **STEP-BY-STEP SETUP**

### **STEP 1: Open Supabase Website**
1. **Open your web browser** (Chrome, Safari, Firefox - whatever you use)
2. **Type:** `supabase.com`
3. **Press Enter**
4. **Click the big blue button** that says "Start your project"

### **STEP 2: Make an Account**
1. **Click "Sign up with GitHub"** (this is easiest)
2. **If you don't have GitHub:** Click "Sign up with email"
3. **Fill in:**
   - **Email:** Your email address
   - **Password:** Make up a password (write it down!)
4. **Click "Sign up"**

### **STEP 3: Create Your Project**
1. **Click "New Project"** (big green button)
2. **Fill in these boxes:**
   - **Name:** Type `jeffy`
   - **Database Password:** Type `jeffy2024` (write this down!)
   - **Region:** Pick the one closest to you (doesn't matter much)
3. **Click "Create new project"**
4. **Wait 2 minutes** ⏰ (seriously, go get coffee!)

### **STEP 4: Create Your Database**
1. **Look at the left side** of the screen
2. **Click "SQL Editor"** (it's in the menu)
3. **Click "New query"** (button at the top)
4. **Copy this EXACT text** (select all and copy):

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

5. **Paste it** into the big white box
6. **Click "Run"** (green button)
7. **You should see "Success"** ✅

### **STEP 5: Get Your Secret Codes**
1. **Look at the left side** again
2. **Click "Settings"** (at the bottom)
3. **Click "API"** (in the settings menu)
4. **You'll see two important things:**
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)
5. **Copy both of these** (click the copy button next to each)

### **STEP 6: Update Your Website**
1. **Go back to your project folder** (where your website code is)
2. **Find the file called** `.env.local`
3. **Open it** (double-click)
4. **You'll see two lines that look like this:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. **Replace the fake values** with your real ones:
   - Replace `https://your-project-id.supabase.co` with your **Project URL**
   - Replace `your-anon-key-here` with your **Anon public key**
6. **Save the file** (Ctrl+S or Cmd+S)

### **STEP 7: Upload to Internet**
1. **Open Terminal/Command Prompt** (search for it)
2. **Type these commands one by one** (press Enter after each):

```bash
git add .env.local
git commit -m "Add Supabase"
git push
```

3. **Wait for it to finish** (you'll see "done" messages)

---

## 🎉 **YOU'RE DONE!**

**That's it!** Your website now has a permanent database.

---

## 🧪 **Test It:**

1. **Go to** `jeffy.co.za/admin/login`
2. **Login** (credentials are already filled in)
3. **Click "New Product"**
4. **Add a product** with some details
5. **Click "Create Product"**
6. **Refresh the page** - your product should still be there! ✅

---

## 🆘 **If Something Goes Wrong:**

### **"I can't find the SQL Editor"**
- Look for "SQL Editor" in the left menu
- If you don't see it, refresh the page

### **"The Run button doesn't work"**
- Make sure you copied ALL the SQL code
- Try copying it again

### **"I can't find .env.local"**
- It's in your main project folder
- If you can't find it, create a new file called `.env.local`

### **"The git commands don't work"**
- Make sure you're in the right folder
- Try typing `pwd` to see where you are

---

## 📞 **Need Help?**

**If you get stuck at ANY step:**
1. **Take a screenshot** of what you see
2. **Tell me exactly** what step you're on
3. **I'll help you** through it!

**Remember:** This is totally normal to be confused the first time. Even experienced developers get confused with new tools! 😊

---

## 🎯 **What This Does:**

- ✅ **Your products won't disappear** anymore
- ✅ **Images will load faster**
- ✅ **Your website will be more professional**
- ✅ **Everything will work smoothly**

**You've got this!** 🚀
