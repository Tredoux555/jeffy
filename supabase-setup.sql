-- Create products table in Supabase
-- Copy and paste this into Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
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

-- Create an index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create an index on display for filtering
CREATE INDEX IF NOT EXISTS idx_products_display ON products(display);

-- Insert some sample products
INSERT INTO products (id, name, description, price, original_price, category, images, rating, review_count, in_stock, display) VALUES
('sample-1', 'Sample Product 1', 'This is a sample product for testing', 29.99, 39.99, 'archery', ARRAY['/products/sample-1.jpg'], 4.5, 10, true, true),
('sample-2', 'Sample Product 2', 'Another sample product', 49.99, 59.99, 'kitchen', ARRAY['/products/sample-2.jpg'], 4.2, 8, true, true)
ON CONFLICT (id) DO NOTHING;
