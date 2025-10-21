"use client";

import { useEffect } from "react";

export function BackgroundSync() {
  useEffect(() => {
    // Register background sync for cart persistence
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Listen for cart updates
        const handleCartUpdate = () => {
          registration.sync.register('cart-sync').catch((error) => {
            console.log('Background sync registration failed:', error);
          });
        };

        // Listen for custom cart update events
        window.addEventListener('cart-updated', handleCartUpdate);
        
        return () => {
          window.removeEventListener('cart-updated', handleCartUpdate);
        };
      });
    }

    // Set up periodic sync for product updates (if supported)
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.periodicSync.register('product-updates', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        }).catch((error) => {
          console.log('Periodic sync registration failed:', error);
        });
      });
    }
  }, []);

  return null;
}

