"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard,
  Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  tax: number;
  shipping: number;
  finalTotal: number;
  shippingInfo: any;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string | null;
  estimatedDelivery: string;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      try {
        const { id } = await params;
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          throw new Error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, router, params]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-black mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/orders">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/orders" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-black flex items-center justify-between">
                  Order #{order.id.slice(-8).toUpperCase()}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-700">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-black">Payment Status</p>
                    <p className="text-gray-600 capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black">Estimated Delivery</p>
                    <p className="text-gray-600">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-yellow-200">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.product.images?.[0] || "/products/product--0.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-black">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.category}</p>
                      <p className="text-yellow-600 font-bold">{formatCurrency(item.product.price)} × {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-black">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
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
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-black">Name</p>
                    <p className="text-gray-600">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black">Email</p>
                    <p className="text-gray-600">{order.shippingInfo.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black">Phone</p>
                    <p className="text-gray-600">{order.shippingInfo.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black">Address</p>
                    <p className="text-gray-600">
                      {order.shippingInfo.address}<br />
                      {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold">{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.finalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.trackingNumber && (
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-black flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Tracking Number:</p>
                  <p className="font-bold text-black">{order.trackingNumber}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
