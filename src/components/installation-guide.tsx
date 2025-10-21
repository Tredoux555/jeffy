"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";

export function InstallationGuide() {
  const [showGuide, setShowGuide] = useState(false);

  const handleInstallClick = () => {
    setShowGuide(true);
  };

  if (showGuide) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-black">Install Jeffy App</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuide(false)}
              className="text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-black mb-2">📱 On iPhone (Safari):</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Tap the <strong>Share button</strong> (square with arrow)</li>
                <li>2. Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>3. Tap <strong>"Add"</strong> in the top right</li>
                <li>4. Done! Jeffy app appears on your home screen</li>
              </ol>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-black mb-2">🤖 On Android (Chrome):</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Look for <strong>"Install"</strong> button in address bar</li>
                <li>2. Or tap <strong>menu (⋮)</strong> → <strong>"Add to Home Screen"</strong></li>
                <li>3. Tap <strong>"Add"</strong> to confirm</li>
                <li>4. Done! Jeffy app appears on your home screen</li>
              </ol>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-black mb-2">💻 On Desktop (Chrome/Edge):</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Look for <strong>install icon</strong> in address bar</li>
                <li>2. Or click <strong>"Download App"</strong> button</li>
                <li>3. Click <strong>"Install"</strong> in the prompt</li>
                <li>4. Done! Jeffy app opens in its own window</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowGuide(false)}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              Got it!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button 
      size="lg" 
      className="bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg font-bold"
      onClick={handleInstallClick}
    >
      <Download className="mr-2 h-5 w-5" />
      Download App
    </Button>
  );
}

