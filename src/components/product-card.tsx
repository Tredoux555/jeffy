import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/currency';
import { useState, useEffect, useRef } from 'react';
import { useFavorites } from '@/lib/favorites';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVariants(false);
      }
    };

    if (showVariants) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVariants]);

  // Get the first available image or use a placeholder
  const mainImage = product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' && product.images[0] !== 'null'
    ? product.images[0] 
    : null;

  // Debug logging
  console.log('ProductCard:', product.name, 'images:', product.images, 'mainImage:', mainImage);
  
  // Additional debugging
  if (mainImage) {
    console.log('🖼️ Attempting to load image:', mainImage);
  }

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      // Show variant dropdown
      setShowVariants(true);
    } else {
      // No variants, add directly
      onAddToCart(product);
    }
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setShowVariants(false);
    
    // Create product with selected variant
    const productWithVariant = {
      ...product,
      price: variant.price || product.price,
      originalPrice: variant.originalPrice || product.originalPrice,
      selectedVariants: { [variant.type]: variant.id }
    };
    
    onAddToCart(productWithVariant);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onLoad={() => console.log('✅ ProductCard image loaded successfully:', mainImage)}
                onError={(e) => {
                  console.error('❌ ProductCard image failed to load:', mainImage);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full flex flex-col justify-center items-center text-gray-500 font-medium bg-gray-100 absolute inset-0"
              style={{ display: mainImage ? 'none' : 'flex' }}
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm text-center">No Image Available</div>
            </div>
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercentage}%
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>
        
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite(product.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-black text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-sm text-black">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-black">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-black line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full relative" ref={dropdownRef}>
          <Button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            {product.variants && product.variants.length > 0 && (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          
          {/* Variant Dropdown */}
          {showVariants && product.variants && product.variants.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-600 mb-2">Select Size:</div>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    disabled={!variant.inStock}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-yellow-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{variant.name}</span>
                      <span className="text-yellow-600 font-semibold">
                        {formatCurrency(variant.price || product.price)}
                      </span>
                    </div>
                    {!variant.inStock && (
                      <span className="text-xs text-gray-400">(Out of Stock)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
