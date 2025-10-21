"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X, CheckCircle } from "lucide-react";

export function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default and user hasn't dismissed it
      if (Notification.permission === "default" && !localStorage.getItem('notification-dismissed')) {
        // Delay showing the prompt to not be intrusive
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Show a welcome notification
        new Notification('Welcome to Jeffy!', {
          body: 'You\'ll now receive notifications about new products and special offers.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
        });
      }
      
      setShowPrompt(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-dismissed', 'true');
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-yellow-300 p-4">
        <div className="flex items-start space-x-3">
          <Bell className="h-6 w-6 text-yellow-500 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-black text-sm mb-1">
              Stay Updated!
            </h3>
            <p className="text-gray-600 text-xs mb-3">
              Get notified about new products and special offers.
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={requestPermission}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-xs"
              >
                Enable Notifications
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissPrompt}
                className="text-gray-500 hover:bg-gray-100 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

