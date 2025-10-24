"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Search, Filter, ArrowRight, Target, ChefHat, Dumbbell, Tent, Sparkles, Smartphone, Home, Gamepad2, RefreshCw } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductGridSkeleton } from "@/components/product-skeleton";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Search className="h-8 w-8 text-yellow-600" />
        </div>
        <p className="text-black font-semibold">Loading products...</p>
      </div>
    </div>}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allProducts, setAllProducts] = useState<any[]>(products); // Start with static products
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  // Function to get icon for each category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: { [key: string]: any } = {
      'archery': Target,
      'kitchen': ChefHat,
      'gym': Dumbbell,
      'camping': Tent,
      'beauty': Sparkles,
      'electronics': Smartphone,
      'home-garden': Home,
      'sports': Gamepad2
    };
    return iconMap[categoryId] || Target; // Default to Target if not found
  };

  // Manual refresh function
  const refreshProducts = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const updatedProducts = await response.json();
        setAllProducts(updatedProducts);
        console.log('Manually refreshed products:', updatedProducts.length);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load products from API after component mounts
  useEffect(() => {
    // Just use static products for now - this was working before
    console.log('✅ Using static products:', products.length);
    setAllProducts(products);
    setIsLoading(false);
  }, []); // Keep empty dependency array for initial load

  // Add a focus listener to refresh products when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, refreshing products...');
        refreshProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Listen for updates
  useEffect(() => {
    const handleUpdate = (event?: CustomEvent) => {
      console.log('Product update detected, reloading...', event?.detail);
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          console.log('Reloaded', data.length, 'products');
          setAllProducts(data);
        })
        .catch(err => console.error('Reload error:', err));
    };

    // Listen for custom events
    window.addEventListener('productUpdated', handleUpdate as EventListener);
    
    // Listen for localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'productUpdated') {
        console.log('Storage event detected for productUpdated');
        handleUpdate();
      }
    });

    // Also check for localStorage on mount
    const lastUpdate = localStorage.getItem('productUpdated');
    if (lastUpdate) {
      console.log('Found product update in localStorage:', lastUpdate);
      handleUpdate();
    }

    return () => {
      window.removeEventListener('productUpdated', handleUpdate as EventListener);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update selected category when URL changes
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter products based on search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate category counts
  const categoryCounts = categories.map(category => ({
    ...category,
    productCount: allProducts.filter(product => product.category === category.id).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Header and Categories with yellow background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Our Products
            </h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Tried, Tested and True
            </p>
          </div>
          
          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {categoryCounts.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className={`group p-4 rounded-xl text-center transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-yellow-300 scale-105 shadow-lg'
                    : 'bg-yellow-50 hover:bg-yellow-100 hover:scale-105'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {(() => {
                    const IconComponent = getCategoryIcon(category.id);
                    return <IconComponent className="h-8 w-8 text-black" />;
                  })()}
                </div>
                <h3 className="font-semibold text-sm text-black mb-1">{category.name}</h3>
                <div className="flex items-center justify-center text-yellow-600 group-hover:text-yellow-700">
                  <span className="text-xs font-medium">{category.productCount} items</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={refreshProducts}
                disabled={isRefreshing}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-3"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">No products found</h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search terms or browse all categories
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-black">
                {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}