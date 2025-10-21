import { Product, Review, Category } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 3699.99,
    originalPrice: 4624.99,
    images: [
      '/products/headphones-1.jpg',
      '/products/headphones-1.jpg',
      '/products/headphones-1.jpg'
    ],
    videos: ['/products/headphones-demo.mp4'],
    category: 'electronics',
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    display: true,
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Quick charge (5 min = 3 hours)',
      'Premium sound quality',
      'Comfortable over-ear design'
    ],
    specifications: {
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years'
    }
  },
  {
    id: '2',
    name: 'Smart Home Security Camera',
    description: '4K resolution security camera with night vision and mobile app control.',
    price: 1664.99,
    images: [
      '/products/camera-1.jpg',
      '/products/camera-1.jpg'
    ],
    videos: ['/products/camera-demo.mp4'],
    category: 'electronics',
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    display: true,
    tags: ['security', '4k', 'night-vision', 'smart-home'],
    features: [
      '4K Ultra HD recording',
      'Night vision up to 30ft',
      'Two-way audio',
      'Mobile app control',
      'Cloud storage included'
    ]
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
    price: 5549.99,
    originalPrice: 7399.99,
    images: [
      '/products/chair-1.jpg',
      '/products/chair-1.jpg',
      '/products/chair-1.jpg'
    ],
    category: 'home-garden',
    rating: 4.7,
    reviewCount: 634,
    inStock: true,
    display: true,
    tags: ['ergonomic', 'office', 'adjustable', 'comfortable'],
    features: [
      'Lumbar support',
      'Adjustable height',
      '360-degree swivel',
      'Breathable mesh back',
      '5-year warranty'
    ]
  },
  {
    id: '4',
    name: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    price: 2959.99,
    images: [
      '/products/coffee-1.jpg',
      '/products/coffee-1.jpg'
    ],
    category: 'home-garden',
    rating: 4.5,
    reviewCount: 423,
    inStock: true,
    display: true,
    tags: ['coffee', 'programmable', 'grinder', 'thermal'],
    features: [
      'Built-in burr grinder',
      'Programmable brewing',
      'Thermal carafe',
      '12-cup capacity',
      'Auto shut-off'
    ]
  },
  {
    id: '5',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning and breathable upper.',
    price: 2404.99,
    images: [
      '/products/shoes-1.jpg',
      '/products/shoes-1.jpg',
      '/products/shoes-1.jpg'
    ],
    videos: ['/products/shoes-demo.mp4'],
    category: 'sports',
    rating: 4.9,
    reviewCount: 2156,
    inStock: true,
    display: true,
    tags: ['running', 'lightweight', 'breathable', 'cushioned'],
    features: [
      'Responsive cushioning',
      'Breathable mesh upper',
      'Lightweight design',
      'Durable rubber outsole',
      'Available in multiple colors'
    ]
  },
  // Archery Products
  {
    id: '6',
    name: 'Professional Compound Bow',
    description: 'High-performance compound bow with adjustable draw weight and smooth release.',
    price: 11099.99,
    originalPrice: 12949.99,
    images: [
      '/products/archery-bow.jpg',
      '/products/archery-bow-2.jpg'
    ],
    category: 'archery',
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    display: true,
    tags: ['compound-bow', 'adjustable', 'professional', 'precision'],
    features: [
      'Adjustable draw weight (30-70 lbs)',
      'Smooth cam system',
      'Precision sight included',
      'Carbon fiber construction',
      'Professional grade'
    ]
  },
  // Kitchen Products
  {
    id: '8',
    name: 'Professional Chef Knife Set',
    description: 'Premium stainless steel chef knife set with wooden block storage.',
    price: 3699.99,
    originalPrice: 4624.99,
    images: [
      '/products/chef-knives.jpg',
      '/products/chef-knives-2.jpg'
    ],
    category: 'kitchen',
    rating: 4.9,
    reviewCount: 892,
    inStock: true,
    display: true,
    tags: ['chef-knives', 'stainless-steel', 'professional', 'sharp'],
    features: [
      'High-carbon stainless steel',
      'Ergonomic handles',
      'Wooden storage block',
      'Razor-sharp edge',
      'Professional grade'
    ]
  },
  // Gym Products
  {
    id: '10',
    name: 'Adjustable Dumbbells (50 lbs)',
    description: 'Space-saving adjustable dumbbells with quick-change weight system.',
    price: 7399.99,
    originalPrice: 9249.99,
    images: [
      '/products/adjustable-dumbbells.jpg',
      '/products/dumbbells-2.jpg'
    ],
    category: 'gym',
    rating: 4.6,
    reviewCount: 1234,
    inStock: true,
    display: true,
    tags: ['dumbbells', 'adjustable', 'space-saving', 'home-gym'],
    features: [
      '5-50 lbs per dumbbell',
      'Quick-change system',
      'Space-saving design',
      'Non-slip grip',
      'Compact storage'
    ]
  },
  // Camping Products
  {
    id: '12',
    name: '4-Person Camping Tent',
    description: 'Weather-resistant camping tent with easy setup and spacious interior.',
    price: 3329.99,
    originalPrice: 4254.99,
    images: [
      '/products/camping-tent.jpg',
      '/products/tent-interior.jpg'
    ],
    category: 'camping',
    rating: 4.5,
    reviewCount: 445,
    inStock: true,
    display: true,
    tags: ['tent', '4-person', 'weather-resistant', 'easy-setup'],
    features: [
      'Waterproof rainfly',
      'Easy 5-minute setup',
      'Spacious interior',
      'Mesh windows',
      'Carrying bag included'
    ]
  },
  // Beauty Products
  {
    id: '14',
    name: 'Vitamin C Serum',
    description: 'Brightening vitamin C serum with hyaluronic acid for glowing skin.',
    price: 924.99,
    originalPrice: 1294.99,
    images: [
      '/products/vitamin-c-serum.jpg'
    ],
    category: 'beauty',
    rating: 4.9,
    reviewCount: 2156,
    inStock: true,
    display: true,
    tags: ['vitamin-c', 'serum', 'brightening', 'hyaluronic-acid'],
    features: [
      '20% Vitamin C',
      'Hyaluronic acid',
      'Brightens skin',
      'Reduces dark spots',
      'Cruelty-free'
    ]
  },
  {
    id: '16',
    name: 'Dibear Gym Gloves',
    description: 'Professional-grade fingerless fitness gloves featuring anti-slip silicone gel padding, breathable mesh construction, and wide adjustable wrist straps with DIBEAR branding. Designed for weightlifting, battle rope training, and intense workouts with superior grip and wrist support.',
    price: 462.99,
    originalPrice: 647.99,
    images: [
      '/products/dibear-gym-gloves.jpg',
      '/products/dibear-gym-gloves-2.jpg',
      '/products/dibear-gym-gloves-3.jpg',
      '/products/dibear-gym-gloves-4.jpg'
    ],
    category: 'gym',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    display: true,
    tags: ['fitness', 'gym', 'gloves', 'wrist-support', 'grip', 'dibear'],
    features: [
      'Gel padding for impact absorption and comfort',
      'Breathable mesh construction for ventilation',
      'Wide adjustable wrist straps for superior support',
      'Anti-slip silicone particles for enhanced grip',
      'Easy removal loops for quick on/off',
      'Professional grade materials for durability',
      'Fingerless design for dexterity',
      'Terry cloth thumb for sweat wiping'
    ],
    specifications: {
      'Material': 'Synthetic leather palm, breathable mesh back',
      'Padding': 'Gel padding in palm area',
      'Wrist Support': 'Wide adjustable straps with DIBEAR branding',
      'Grip': 'Anti-slip silicone particles',
      'Sizes': 'One size fits most',
      'Color': 'Olive green/khaki',
      'Brand': 'DIBEAR',
      'Warranty': '1 year'
    }
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Amazing sound quality!',
    comment: 'These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is exactly as advertised.',
    date: '2024-01-15',
    verified: true,
    helpful: 23
  },
  {
    id: '2',
    productId: '1',
    userName: 'Mike R.',
    rating: 4,
    title: 'Great headphones, minor issues',
    comment: 'Overall great product, but the ear cups could be a bit more comfortable for long listening sessions.',
    date: '2024-01-10',
    verified: true,
    helpful: 12
  },
  {
    id: '3',
    productId: '2',
    userName: 'Jennifer L.',
    rating: 5,
    title: 'Perfect for home security',
    comment: 'Easy to set up and the night vision works perfectly. Great value for the price.',
    date: '2024-01-12',
    verified: true,
    helpful: 18
  }
];

export const categories: Category[] = [
  {
    id: 'archery',
    name: 'Archery',
    slug: 'archery',
    description: 'Professional archery equipment and accessories',
    image: '/categories/archery.jpg',
    productCount: 1
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    slug: 'kitchen',
    description: 'High-quality kitchen tools and appliances',
    image: '/categories/kitchen.jpg',
    productCount: 1
  },
  {
    id: 'gym',
    name: 'Gym',
    slug: 'gym',
    description: 'Fitness equipment and workout gear',
    image: '/categories/gym.jpg',
    productCount: 2
  },
  {
    id: 'camping',
    name: 'Camping',
    slug: 'camping',
    description: 'Outdoor camping gear and equipment',
    image: '/categories/camping.jpg',
    productCount: 1
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, makeup, and beauty products',
    image: '/categories/beauty.jpg',
    productCount: 1
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: '/categories/electronics.jpg',
    productCount: 5
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    image: '/categories/home-garden.jpg',
    productCount: 0
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: '/categories/fashion.jpg',
    productCount: 0
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    slug: 'sports',
    description: 'Sports equipment and outdoor gear',
    image: '/categories/sports.jpg',
    productCount: 0
  }
];

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(product => product.category === categoryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(review => review.productId === productId);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
