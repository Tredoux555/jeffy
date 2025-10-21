"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Wifi, WifiOff, Bell, BellOff, Download } from "lucide-react";

export function PWAStatus() {
  const [status, setStatus] = useState({
    isOnline: true, // Default to true to prevent hydration mismatch
    isInstalled: false,
    notificationsEnabled: false,
    serviceWorkerSupported: false,
    pushSupported: false,
    backgroundSyncSupported: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Check if app is already installed
    const checkInstallation = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      setStatus(prev => ({ ...prev, isInstalled }));
    };

    // Check notification permission
    const checkNotifications = () => {
      if ('Notification' in window) {
        setStatus(prev => ({ 
          ...prev, 
          notificationsEnabled: Notification.permission === 'granted',
          pushSupported: 'PushManager' in window
        }));
      }
    };

    // Check service worker support
    const checkServiceWorker = () => {
      setStatus(prev => ({ 
        ...prev, 
        serviceWorkerSupported: 'serviceWorker' in navigator
      }));
    };

    // Check background sync support
    const checkBackgroundSync = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          setStatus(prev => ({ 
            ...prev, 
            backgroundSyncSupported: 'sync' in registration
          }));
        });
      }
    };

    // Check online status
    const checkOnlineStatus = () => {
      setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    // Initial checks
    checkInstallation();
    checkNotifications();
    checkServiceWorker();
    checkBackgroundSync();
    checkOnlineStatus();

    // Event listeners
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = (isEnabled: boolean) => {
    return isEnabled ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusText = (isEnabled: boolean) => {
    return isEnabled ? "Enabled" : "Disabled";
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-yellow-300 max-w-md">
        <h3 className="text-lg font-bold text-black mb-4">PWA Status</h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-yellow-300 max-w-md">
      <h3 className="text-lg font-bold text-black mb-4">PWA Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-semibold">Connection</span>
          </div>
          <span className={`text-sm ${status.isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {status.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.isInstalled)}
            <span className="text-sm font-semibold">App Installed</span>
          </div>
          <span className={`text-sm ${status.isInstalled ? 'text-green-600' : 'text-gray-600'}`}>
            {getStatusText(status.isInstalled)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status.notificationsEnabled ? (
              <Bell className="h-4 w-4 text-green-500" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm font-semibold">Notifications</span>
          </div>
          <span className={`text-sm ${status.notificationsEnabled ? 'text-green-600' : 'text-gray-600'}`}>
            {getStatusText(status.notificationsEnabled)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.serviceWorkerSupported)}
            <span className="text-sm font-semibold">Service Worker</span>
          </div>
          <span className={`text-sm ${status.serviceWorkerSupported ? 'text-green-600' : 'text-gray-600'}`}>
            {getStatusText(status.serviceWorkerSupported)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.backgroundSyncSupported)}
            <span className="text-sm font-semibold">Background Sync</span>
          </div>
          <span className={`text-sm ${status.backgroundSyncSupported ? 'text-green-600' : 'text-gray-600'}`}>
            {getStatusText(status.backgroundSyncSupported)}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-gray-700">
          <strong>PWA Features:</strong><br />
          • Offline browsing<br />
          • Push notifications<br />
          • Background sync<br />
          • App-like experience
        </p>
      </div>
    </div>
  );
}