"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { Search } from "lucide-react";

export default function ArcheryPage() {
  const { addItem } = useCart();
  const [archeryProducts, setArcheryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('Archery page: Starting API call...');
    fetch('/api/products')
      .then(res => {
        console.log('Archery page: API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Archery page: Received', data.length, 'products');
        const archeryProducts = data.filter(p => p.category === 'archery');
        console.log('Archery page: Archery products:', archeryProducts.length);
        setArcheryProducts(archeryProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Archery page: Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter products based on search query
  const filteredProducts = archeryProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Archery Products</h1>
            <p className="text-gray-600">Loading archery products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Archery Products</h1>
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Archery Products
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Discover premium archery equipment for beginners and professionals alike
          </p>
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
                placeholder="Search archery products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {archeryProducts.length} archery products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
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
              No archery products found
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
        )}
      </div>
    </div>
  );
}