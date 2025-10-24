"use client";

import { AdminProductCard } from "@/components/admin-product-card";
import { AddProductForm } from "@/components/add-product-form";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { ArrowLeft, Plus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminElectronicsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const loadUpdatedProducts = async () => {
      try {
        const response = await fetch('/api/products?includeHidden=true');
        if (response.ok) {
          const updatedProducts = await response.json();
          setAllProducts(updatedProducts);
        } else {
          console.error('Error loading updated products:', response.statusText);
        }
      } catch (error) {
        console.error('Error loading updated products:', error);
      }
    };
    
    if (isAuthenticated) {
      loadUpdatedProducts();
    }
  }, [isAuthenticated]);

  const handleToggleDisplay = async (productId: string, display: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ display }),
      });

      if (response.ok) {
        // Update the local state
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, display }
              : product
          )
        );
        
        // Trigger automatic refresh of products page
        const timestamp = Date.now().toString();
        localStorage.setItem('productUpdated', timestamp);
        localStorage.setItem('lastProductUpdate', timestamp);
        localStorage.removeItem('productUpdated');
        window.dispatchEvent(new CustomEvent('productUpdated', { 
          detail: { productId, display } 
        }));
        
        console.log(`Product ${productId} display toggled to ${display}`);
      } else {
        console.error('Failed to toggle display');
        alert('Failed to update product display status');
      }
    } catch (error) {
      console.error('Error toggling display:', error);
      alert('Error updating product display status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const handleProductAdded = (newProduct: any) => {
    // Add the new product to the local state
    setAllProducts(prevProducts => [...prevProducts, newProduct]);
    
    // Close the form
    setShowAddForm(false);
    
    // Trigger refresh of main products page
    const timestamp = Date.now().toString();
    localStorage.setItem('productUpdated', timestamp);
    localStorage.setItem('lastProductUpdate', timestamp);
    localStorage.removeItem('productUpdated');
    window.dispatchEvent(new CustomEvent('productUpdated', { 
      detail: { productId: newProduct.id, action: 'created' } 
    }));
  };

  const electronicsProducts = allProducts.filter(product => product.category === 'electronics');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button onClick={handleLogout} variant="outline" className="bg-white hover:bg-gray-100">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Electronics Products
            </h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Manage your electronic devices and gadgets
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-black">
            Showing {electronicsProducts.length} electronics products
          </p>
        </div>

        {electronicsProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {electronicsProducts.map((product) => (
              <AdminProductCard key={product.id} product={product} onToggleDisplay={handleToggleDisplay} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-black mb-2">
              No electronics products found
            </h3>
            <p className="text-black mb-4">
              No products are currently available in the electronics category
            </p>
          </div>
        )}
      </div>

      {/* Add Product Form Modal */}
      {showAddForm && (
        <AddProductForm
          category="electronics"
          onProductAdded={handleProductAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
