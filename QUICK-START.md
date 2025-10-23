# 🚀 Quick Start - Jeffy Project

**All bugs are fixed! Here's how to get started:**

---

## ⚡ Option 1: Test Immediately (No Setup)

```bash
# Terminal 1: Start the server
npm install
npm run dev

# Terminal 2: Upload a test product
node upload-product.js
```

**Done!** Visit http://localhost:3000 to see your product.

---

## 🗄️ Option 2: Add Permanent Storage (5 minutes)

### 1. Create Supabase Database
- Go to [supabase.com](https://supabase.com) → Sign up
- Create new project called "jeffy"
- Wait 2 minutes for initialization

### 2. Run SQL Setup
- In Supabase dashboard → **SQL Editor**
- Copy contents of `supabase-setup.sql`
- Paste and click **Run**

### 3. Get API Keys
- Go to **Settings** → **API**
- Copy:
  - Project URL
  - Anon public key
  - Service role key

### 4. Update .env.local
Replace the placeholder values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-real-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-real-key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJhbG...your-real-service-key
```

### 5. Restart Server
```bash
# Stop server (Ctrl+C), then restart
npm run dev
```

You should see: `✅ Supabase properly configured`

---

## 📦 Upload Products

### Upload Sample Product
```bash
node upload-product.js
```

### Upload Custom Product
```bash
node quick-upload.js "Product Name" "category" "99.99" "image-url"
```

**Example:**
```bash
node quick-upload.js "Yoga Mat" "sports" "29.99" "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
```

---

## 📱 Access Points

- **Main Site:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Products API:** http://localhost:3000/api/products

---

## ❓ Troubleshooting

**Problem:** "Cannot connect to server"  
**Fix:** Run `npm run dev` first

**Problem:** Products disappear after restart  
**Fix:** Set up Supabase for permanent storage

**Problem:** Upload fails  
**Fix:** Check server is running and console for errors

---

## 📚 More Info

- **SETUP-INSTRUCTIONS.md** - Detailed setup guide
- **BUGS-FIXED-SUMMARY.md** - What was fixed
- **product-upload-template.js** - Product upload template

---

**That's it! You're ready to go.** 🎉
