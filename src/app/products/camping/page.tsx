"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Search, Filter, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CampingPage() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const updatedProducts = await response.json();
          setAllProducts(updatedProducts);
          console.log('Camping page loaded products:', updatedProducts.length);
        }
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setIsLoading(false);
        }
    };

    loadProducts();

    // Listen for product updates
    const handleUpdate = (event?: CustomEvent) => {
      console.log('Camping page: Product update detected', event?.detail);
      loadProducts();
    };

    window.addEventListener('productUpdated', handleUpdate as EventListener);
    window.addEventListener('storage', (e) => {
      if (e.key === 'productUpdated') {
        console.log('Camping page: Storage event detected');
        loadProducts();
      }
    });

    return () => {
      window.removeEventListener('productUpdated', handleUpdate as EventListener);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Manual refresh function
  const refreshProducts = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const updatedProducts = await response.json();
        setAllProducts(updatedProducts);
        console.log('Camping page manually refreshed:', updatedProducts.length);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const campingProducts = allProducts.filter(product => product.category === "camping");

  const filteredProducts = campingProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Header with yellow background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Link 
              href="/products" 
              className="inline-flex items-center text-black/80 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Products
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-6">
              Camping & Outdoor Gear
            </h1>
            <p className="text-xl text-black/80 max-w-2xl mx-auto">
              Essential camping equipment for your next outdoor adventure
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search camping products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
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

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} of ${campingProducts.length} camping products`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-black">Loading camping products...</p>
          </div>
        ) : (
          /* Products Grid */
          filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No camping products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria
              </p>
              <Button 
                onClick={() => setSearchQuery("")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                Clear Search
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}


