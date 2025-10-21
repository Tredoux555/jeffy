"use client";

import { useEffect } from "react";

export function PushNotificationService() {
  useEffect(() => {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        // Subscribe to push notifications
        const subscribeToPush = async () => {
          try {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                ? urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
                : undefined
            });
            
            // Send subscription to server
            await fetch('/api/push/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription),
            });
            
            console.log('Push subscription successful');
          } catch (error) {
            console.error('Push subscription failed:', error);
          }
        };

        // Check if already subscribed
        registration.pushManager.getSubscription().then((subscription) => {
          if (!subscription) {
            subscribeToPush();
          }
        });

        // Listen for push messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
            // Handle push notification
            console.log('Received push notification:', event.data);
          }
        });
      });
    }
  }, []);

  return null;
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

