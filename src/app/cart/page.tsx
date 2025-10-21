"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Shield,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [isAuthenticated, user]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Create order
      const order = {
        items: cart.items,
        total: cart.total,
        shippingInfo,
        userId: user?.id,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const orderData = await response.json();
        clearCart();
        router.push(`/orders/${orderData.order.id}`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-black flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  Shopping Cart ({cart.itemCount} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={item.id} className={`flex items-center space-x-4 p-4 bg-white rounded-lg border-2 ${
                    item.selectedVariants && Object.keys(item.selectedVariants).length > 0 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-yellow-200'
                  }`}>
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.product.images?.[0] || "/products/product--0.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-black">
                        {item.product.name}
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <span className="inline-block ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                            {Object.entries(item.selectedVariants).map(([type, variantId]) => {
                              const variant = item.product.variants?.find(v => v.id === variantId);
                              return variant?.name || variantId;
                            }).join(', ')}
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.product.category}</p>
                      <p className="text-yellow-600 font-bold">{formatCurrency(item.product.price)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-black">{formatCurrency(item.product.price * item.quantity)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Section */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span className="font-bold">{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold">{formatCurrency(cart.total * 0.08)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(cart.total * 1.08)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-black font-bold">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-black font-semibold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-black font-bold">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-black font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-black font-bold">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-black font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-black font-bold">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-black font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-black font-bold">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-black font-semibold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-black font-bold">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-black font-semibold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-black font-bold">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-black font-semibold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-black font-bold">ZIP</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-black font-semibold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-3 text-lg"
            >
              {isCheckingOut ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </>
              )}
            </Button>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Secure Checkout
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
