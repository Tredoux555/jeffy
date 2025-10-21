"use client";

import { ShoppingCart, Search, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/lib/favorites';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Header() {
  const { cart, addItem } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug: Log cart state changes
  useEffect(() => {
    console.log('Header: Cart state updated', { itemCount: cart.itemCount, total: cart.total, items: cart.items.length });
  }, [cart]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-gray-300 to-gray-400 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r from-gray-300 to-gray-400 pt-4 pb-4">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="md:hidden flex h-12 items-center justify-center relative">
          {/* Centered Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">Jeffy</div>
          </Link>
          
          {/* Right side icons */}
          <div className="absolute right-0 flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gradient-to-r from-gray-300 to-gray-400 border-b shadow-lg z-40">
            <nav className="flex flex-col py-4">
                  <Link 
                    href="/" 
                    className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
              <Link 
                href="/about" 
                className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/favorites" 
                className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites ({favorites.length})
              </Link>
              
              {/* Authentication Section */}
              <div className="border-t border-gray-200 my-2"></div>
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-200 font-semibold">
                    Welcome, {user?.firstName}!
                  </div>
                  <Link 
                    href="/profile" 
                    className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="inline h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-500 transition-colors font-bold"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              
              {/* Admin Section */}
              <div className="border-t border-gray-200 my-2"></div>
              <Link 
                href="/admin/login" 
                className="px-4 py-3 text-white hover:bg-gray-500 transition-colors font-bold text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex h-12 items-center justify-between">
          {/* Desktop: Left Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">Jeffy</div>
          </Link>

          {/* Navigation */}
              <nav className="flex items-center space-x-6">
                <Link href="/" className="text-white hover:text-yellow-300 transition-colors">
                  Products
                </Link>
            <Link href="/about" className="text-white hover:text-yellow-300 transition-colors">
              About
            </Link>
            <Link href="/favorites" className="text-white hover:text-yellow-300 transition-colors flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Favorites ({favorites.length})
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-white hover:text-yellow-300 transition-colors">
                  Profile
                </Link>
                <Link href="/orders" className="text-white hover:text-yellow-300 transition-colors">
                  Orders
                </Link>
                <button 
                  onClick={logout}
                  className="text-white hover:text-yellow-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-yellow-300 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="text-white hover:text-yellow-300 transition-colors">
                  Register
                </Link>
              </>
            )}
            <Link href="/admin/login" className="text-white hover:text-yellow-300 transition-colors text-sm">
              Admin
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
