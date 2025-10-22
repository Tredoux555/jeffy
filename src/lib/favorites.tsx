"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: Product[] };

function favoritesReducer(state: Product[], action: FavoritesAction): Product[] {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const product = action.payload;
      // Check if product is already in favorites
      if (state.some(item => item.id === product.id)) {
        return state;
      }
      return [...state, product];
    }
    
    case 'REMOVE_FAVORITE': {
      return state.filter(item => item.id !== action.payload);
    }
    
    case 'LOAD_FAVORITES':
      return action.payload;
    
    default:
      return state;
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const [isClient, setIsClient] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    
    try {
      const savedFavorites = localStorage.getItem('jeffy-favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          dispatch({ type: 'LOAD_FAVORITES', payload: parsedFavorites });
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      localStorage.removeItem('jeffy-favorites');
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('jeffy-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isClient]);

  const addToFavorites = (product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  };

  const removeFromFavorites = (productId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite, 
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}


