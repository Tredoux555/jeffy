"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { Heart, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FavoritesPage() {
  const { addItem } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-black mb-4">No Favorites Yet</h1>
            <p className="text-gray-600 mb-8">Start adding products to your favorites by clicking the heart icon!</p>
            <Link href="/">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
            My Favorites
          </h1>
          <p className="text-lg text-black/80 max-w-2xl mx-auto">
            Your saved products ({favorites.length} items)
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-black">
            Showing {filteredFavorites.length} of {favorites.length} favorites
          </p>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addItem(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">No favorites found</h3>
            <p className="text-black mb-4">Try adjusting your search criteria</p>
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

