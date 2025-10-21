"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support PWA install prompt
      alert('To install the app:\n\nOn iPhone: Tap the share button and select "Add to Home Screen"\nOn Android: Tap the menu button and select "Add to Home Screen"');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Don't show button if app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {showInstallButton && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-lg p-4 border border-yellow-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-black" />
              <div>
                <p className="text-black font-bold text-sm">Install Jeffy App</p>
                <p className="text-black text-xs">Get quick access to our products</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-black text-yellow-400 hover:bg-black/90 font-bold"
              >
                <Download className="mr-1 h-4 w-4" />
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInstallButton(false)}
                className="text-black hover:bg-yellow-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Download App Button for Homepage - ALWAYS SHOW */}
      <Button 
        size="lg" 
        className="bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg font-bold"
        onClick={handleInstallClick}
      >
        <Download className="mr-2 h-5 w-5" />
        Download App
      </Button>
    </>
  );
}