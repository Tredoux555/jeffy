"use client";

import { Loader2, Upload, Package } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({ isVisible, message = "Creating Product...", subMessage = "Please wait while we process your request" }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl p-8 shadow-2xl max-w-sm mx-4 text-center">
        {/* Loading Animation */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Package className="h-10 w-10 text-gray-600" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto animate-spin">
            <div className="w-full h-full border-4 border-transparent border-t-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{message}</h3>
          <p className="text-gray-200 text-sm">{subMessage}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-gray-200 text-xs mt-2">Processing...</p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
