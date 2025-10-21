"use client";

import { useState, useEffect } from "react";
import { ProductVariant, Product } from "@/types";
import { formatCurrency } from "@/lib/currency";

interface ProductVariantSelectorProps {
  product: Product;
  onVariantChange: (selectedVariants: { [variantType: string]: string }, selectedPrices: { price: number; originalPrice?: number }) => void;
}

export function ProductVariantSelector({ product, onVariantChange }: ProductVariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<{ [variantType: string]: string }>({});
  const [selectedPrices, setSelectedPrices] = useState<{ price: number; originalPrice?: number }>({
    price: product.price,
    originalPrice: product.originalPrice
  });

  // Group variants by type
  const variantsByType = product.variants?.reduce((acc, variant) => {
    if (!acc[variant.type]) {
      acc[variant.type] = [];
    }
    acc[variant.type].push(variant);
    return acc;
  }, {} as { [key: string]: ProductVariant[] }) || {};

  // Initialize with first available variant of each type
  useEffect(() => {
    const initialVariants: { [variantType: string]: string } = {};
    let initialPrice = product.price;
    let initialOriginalPrice = product.originalPrice;

    Object.keys(variantsByType).forEach(type => {
      const variants = variantsByType[type];
      if (variants.length > 0) {
        initialVariants[type] = variants[0].id;
        // Use variant price if available
        if (variants[0].price !== undefined) {
          initialPrice = variants[0].price;
        }
        if (variants[0].originalPrice !== undefined) {
          initialOriginalPrice = variants[0].originalPrice;
        }
      }
    });

    setSelectedVariants(initialVariants);
    setSelectedPrices({ price: initialPrice, originalPrice: initialOriginalPrice });
    onVariantChange(initialVariants, { price: initialPrice, originalPrice: initialOriginalPrice });
  }, [product.variants]);

  const handleVariantChange = (type: string, variantId: string) => {
    const newSelectedVariants = { ...selectedVariants, [type]: variantId };
    setSelectedVariants(newSelectedVariants);

    // Find the selected variant to get its price
    const selectedVariant = product.variants?.find(v => v.id === variantId);
    const newPrices = {
      price: selectedVariant?.price ?? product.price,
      originalPrice: selectedVariant?.originalPrice ?? product.originalPrice
    };

    setSelectedPrices(newPrices);
    onVariantChange(newSelectedVariants, newPrices);
  };

  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Options:</h3>
      
      {Object.keys(variantsByType).map(type => {
        const variants = variantsByType[type];
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        
        return (
          <div key={type} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {typeLabel}:
            </label>
            <div className="flex flex-wrap gap-2">
              {variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(type, variant.id)}
                  disabled={!variant.inStock}
                  className={`
                    px-4 py-2 rounded-lg border text-sm font-medium transition-all
                    ${selectedVariants[type] === variant.id
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800 ring-2 ring-yellow-200'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                    ${!variant.inStock 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' 
                      : 'hover:shadow-sm'
                    }
                  `}
                >
                  {variant.name}
                  {!variant.inStock && (
                    <span className="ml-1 text-xs">(Out of Stock)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Price Display */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(selectedPrices.price)}
          </span>
          {selectedPrices.originalPrice && selectedPrices.originalPrice > selectedPrices.price && (
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(selectedPrices.originalPrice)}
            </span>
          )}
          {selectedPrices.originalPrice && selectedPrices.originalPrice > selectedPrices.price && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
              {Math.round(((selectedPrices.originalPrice - selectedPrices.price) / selectedPrices.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        {Object.keys(selectedVariants).length === 0 && (
          <p className="text-sm text-red-600 mt-2 font-medium">
            ⚠️ Please select a size before adding to cart
          </p>
        )}
      </div>
    </div>
  );
}
