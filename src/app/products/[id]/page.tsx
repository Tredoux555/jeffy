"use client";

import { Button } from "@/components/ui/button";
import { getProductById } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ArrowLeft, ShoppingCart, Heart, Truck, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";
import { ProductVariantSelector } from "@/components/product-variant-selector";
import { formatCurrency } from "@/lib/currency";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<{ [variantType: string]: string }>({});
  const [selectedPrices, setSelectedPrices] = useState<{ price: number; originalPrice?: number }>({
    price: 0,
    originalPrice: undefined
  });
  const params = useParams();

  // Helper function to filter valid images
  const getValidImages = (images: string[]) => {
    return images.filter(img => img && img.trim() !== '' && img !== '');
  };

  // Handle variant selection
  const handleVariantChange = (variants: { [variantType: string]: string }, prices: { price: number; originalPrice?: number }) => {
    setSelectedVariants(variants);
    setSelectedPrices(prices);
  };

  // Handle add to cart with variants
  const handleAddToCart = () => {
    console.log('handleAddToCart called!', { product, selectedPrices, quantity });
    
    if (product) {
      // Check if product has variants but none are selected
      if (product.variants && product.variants.length > 0 && Object.keys(selectedVariants).length === 0) {
        alert('Please select a size before adding to cart.');
        return;
      }
      
      const cartItem = {
        ...product,
        price: selectedPrices.price || product.price,
        originalPrice: selectedPrices.originalPrice || product.originalPrice,
        selectedVariants: selectedVariants
      };
      console.log('Adding to cart:', cartItem);
      addItem(cartItem, quantity);
    } else {
      console.error('No product available to add to cart');
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        try {
          const response = await fetch(`/api/products/${params.id}`);
          if (response.ok) {
            const foundProduct = await response.json();
            setProduct(foundProduct);
          } else {
            console.error('Error loading product:', response.statusText);
            // Fallback to original function
            const foundProduct = getProductById(params.id as string);
          setProduct(foundProduct);
          }
        } catch (error) {
          console.error('Error loading product:', error);
          // Fallback to original function
          const foundProduct = getProductById(params.id as string);
          setProduct(foundProduct);
        }
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [params.id]);

  // Set initial prices when product loads
  useEffect(() => {
    if (product) {
      setSelectedPrices({
        price: product.price,
        originalPrice: product.originalPrice
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-black">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-black mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Filter valid images
  const validImages = getValidImages(product.images || []);
  const hasImages = validImages.length > 0;
  
  // Ensure selectedImage is within bounds
  const safeSelectedImage = Math.min(selectedImage, validImages.length - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Header with yellow background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-black/80 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-xl">
              {hasImages && validImages[safeSelectedImage] ? (
                <Image
                  src={validImages[safeSelectedImage]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500 text-lg">No Image Available</span>
                </div>
              )}
              <div 
                className="w-full h-full flex flex-col justify-center items-center text-white font-bold absolute inset-0"
                style={{
                  backgroundColor: safeSelectedImage === 0 ? '#8B7355' : 
                                  safeSelectedImage === 1 ? '#6B8E23' : 
                                  safeSelectedImage === 2 ? '#8B4513' : '#556B2F',
                  display: 'none'
                }}
              >
                <div className="text-2xl mb-2">DIBEAR</div>
                <div className="text-lg mb-2">FITNESS GLOVES</div>
                <div className="text-sm">
                  {safeSelectedImage === 0 ? 'Battle Rope Training' :
                   safeSelectedImage === 1 ? 'Anti-Slip Silicone' :
                   safeSelectedImage === 2 ? '55lb Dumbbell' : 'Breathable Mesh'}
                </div>
              </div>
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>
            
            {validImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {validImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <StarRating rating={product.rating} />
                  <span className="ml-2 text-sm text-black">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-black">{formatCurrency(selectedPrices.price || product.price)}</span>
              {(selectedPrices.originalPrice || product.originalPrice) && (
                <span className="text-xl text-black line-through">{formatCurrency(selectedPrices.originalPrice || product.originalPrice)}</span>
              )}
            </div>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariantSelector
                product={product}
                onVariantChange={handleVariantChange}
              />
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (product.variants && product.variants.length > 0 && Object.keys(selectedVariants).length === 0)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {!product.inStock ? 'Out of Stock' : 
                   (product.variants && product.variants.length > 0 && Object.keys(selectedVariants).length === 0) ? 'Select Size First' : 
                   'Add to Cart'}
                </Button>
                <Button variant="outline" size="icon" className="p-3">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-black">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-black">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-black">Quality Guaranteed</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-black">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
