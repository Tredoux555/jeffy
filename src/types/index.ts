export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small", "Medium", "Large", "Red", "Blue"
  type: 'size' | 'color' | 'material' | 'style';
  price?: number; // Optional price override for this variant
  originalPrice?: number; // Optional original price override
  inStock: boolean;
  sku?: string; // Stock keeping unit
  image?: string; // Optional variant-specific image
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  videos?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  display: boolean; // Controls whether product appears on main website
  tags: string[];
  features: string[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[]; // New variants field
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants?: { [variantType: string]: string }; // e.g., { "size": "Large", "color": "Red" }
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

