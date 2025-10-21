"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-yellow-300">
          <div className="mb-6">
            <WifiOff className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-2">You're Offline</h1>
            <p className="text-gray-600">
              Don't worry! You can still browse cached products and your cart.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-black hover:bg-gray-100 font-bold"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Offline Features:</strong><br />
              • Browse cached products<br />
              • View your cart<br />
              • Read product details<br />
              • Add items to cart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
