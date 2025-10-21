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
  Eye,
  Calendar
} from "lucide-react";
import Link from "next/link";

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

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/orders", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

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
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-black mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link href="/products">
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-black hover:text-yellow-600 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black">Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <p className="text-gray-600 text-sm">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-bold text-black">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-black">{formatCurrency(order.finalTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-bold text-black">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Payment Status: <span className="font-semibold capitalize">{order.paymentStatus}</span></p>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-100 font-bold">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
