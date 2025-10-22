"use client";

import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Edit3, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatCurrency } from "@/lib/currency";

interface AdminProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    images: string[];
    category: string;
    description: string;
    display?: boolean;
  };
  onToggleDisplay?: (productId: string, display: boolean) => void;
}

export function AdminProductCard({ product, onToggleDisplay }: AdminProductCardProps) {
  const mainImage = product.images?.[0];
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleDisplay = async () => {
    if (!onToggleDisplay) return;
    
    setIsToggling(true);
    try {
      await onToggleDisplay(product.id, !product.display);
    } catch (error) {
      console.error('Error toggling display:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">No Image Available</span>
            </div>
          )}
        </div>
        
        {/* Admin Action Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <Link href={`/products/${product.id}`} target="_blank">
              <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                <Eye className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <StarRating rating={product.rating} />
          <span className="text-sm text-black ml-2">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-black">{formatCurrency(product.price)}</span>
          <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <Link href={`/admin/dashboard/products/${product.id}`}>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
          
          {/* Display Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-black">Display on Website</span>
            <button
              onClick={handleToggleDisplay}
              disabled={isToggling}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                product.display !== false 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  product.display !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
