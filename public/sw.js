// Custom service worker for advanced PWA features
const CACHE_NAME = 'jeffy-v1';
const OFFLINE_URL = '/offline';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/products',
        '/offline',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png'
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request);
      })
  );
});

// Background sync for cart updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
  
  if (event.tag === 'product-updates') {
    event.waitUntil(checkForProductUpdates());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View Product',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Helper functions
async function syncCartData() {
  try {
    // Get cart data from IndexedDB or localStorage
    const cartData = await getCartData();
    
    if (cartData && cartData.items.length > 0) {
      // Sync cart data to server
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

async function checkForProductUpdates() {
  try {
    const response = await fetch('/api/products/updates');
    if (response.ok) {
      const updates = await response.json();
      
      if (updates.hasNewProducts) {
        // Show notification about new products
        self.registration.showNotification('New Products Available!', {
          body: 'Check out the latest products in your favorite categories.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          data: { url: '/products' }
        });
      }
    }
  } catch (error) {
    console.error('Product update check failed:', error);
  }
}

async function getCartData() {
  // This would typically read from IndexedDB
  // For now, we'll return null as cart is handled by localStorage
  return null;
}

