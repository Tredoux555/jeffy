"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOffline: boolean;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } }
  | { type: 'SET_OFFLINE'; payload: { isOffline: boolean } };

function cartReducer(state: Cart, action: CartAction): Cart {
  // Ensure state is always properly initialized
  const safeState = {
    items: state.items || [],
    total: state.total || 0,
    itemCount: state.itemCount || 0
  };

  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      console.log('Cart Reducer: ADD_ITEM action received', { product: product.name, quantity, safeState });
      
      // Create a unique ID that includes variants
      const variantString = product.selectedVariants ? 
        JSON.stringify(product.selectedVariants) : '';
      const uniqueId = `${product.id}-${variantString}`;
      
      const existingItem = safeState.items.find(item => {
        const itemVariantString = item.selectedVariants ? 
          JSON.stringify(item.selectedVariants) : '';
        const itemUniqueId = `${item.product.id}-${itemVariantString}`;
        return itemUniqueId === uniqueId;
      });
      
      if (existingItem) {
        console.log('Cart Reducer: Updating existing item');
        const updatedItems = safeState.items.map(item => {
          const itemVariantString = item.selectedVariants ? 
            JSON.stringify(item.selectedVariants) : '';
          const itemUniqueId = `${item.product.id}-${itemVariantString}`;
          
          return itemUniqueId === uniqueId
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
        const newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
        console.log('Cart Reducer: Returning updated state', newState);
        return newState;
      } else {
        console.log('Cart Reducer: Adding new item');
        const newItem: CartItem = { 
          id: uniqueId, 
          product, 
          quantity,
          selectedVariants: product.selectedVariants
        };
        const updatedItems = [...safeState.items, newItem];
        const newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
        console.log('Cart Reducer: Returning new state', newState);
        return newState;
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = safeState.items.filter(item => item.product.id !== action.payload.productId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(safeState, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const updatedItems = safeState.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    case 'LOAD_CART':
      return {
        items: action.payload.cart.items || [],
        total: action.payload.cart.total || 0,
        itemCount: action.payload.cart.itemCount || 0
      };
    
    default:
      return safeState;
  }
}

const initialState: Cart = {
  items: [],
  total: 0,
  itemCount: 0
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isOffline, setIsOffline] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    
    try {
      const savedCart = localStorage.getItem('jeffy-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart structure before loading
        if (parsedCart && typeof parsedCart === 'object' && Array.isArray(parsedCart.items)) {
          dispatch({ type: 'LOAD_CART', payload: { cart: parsedCart } });
        } else {
          console.warn('Invalid cart data in localStorage, using default cart');
          // Clear corrupted data
          localStorage.removeItem('jeffy-cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('jeffy-cart');
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial offline status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return; // Don't save until client-side hydration is complete
    
    try {
      localStorage.setItem('jeffy-cart', JSON.stringify(cart));
      
      // Trigger background sync if online
      if (!isOffline) {
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart, isOffline, isClient]);

  const addItem = (product: Product, quantity = 1) => {
    // Validate product before adding to cart
    if (!product || !product.id || !product.name || typeof product.price !== 'number') {
      console.error('Invalid product data:', product);
      return;
    }
    
    // Ensure quantity is a positive number
    const validQuantity = Math.max(1, Math.floor(quantity) || 1);
    
    console.log('Cart: Adding product to cart:', { product: product.name, price: product.price, quantity: validQuantity });
    
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity: validQuantity } });
    
    // Show toast message
    const variantText = product.selectedVariants && Object.keys(product.selectedVariants).length > 0 
      ? ` (${Object.values(product.selectedVariants).join(', ')})` 
      : '';
    showToastMessage(`${product.name}${variantText} added to cart!`);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000); // Changed from 3000 to 2000 (2 seconds)

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, isOffline, showToast: showToastMessage }}>
      {children}
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-500 text-xs font-bold">✓</span>
            </div>
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={hideToast}
              className="ml-2 hover:bg-green-600 rounded-full p-1 transition-colors"
            >
              <span className="text-white text-sm">×</span>
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

