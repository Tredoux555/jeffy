"use client";

import { AdminProductCard } from "@/components/admin-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { products, categories } from "@/data/products";
import { Search, Filter, ArrowRight, Plus, LogOut, Edit, Save, X, Upload, Image as ImageIcon, Video } from "lucide-react";
import { DragDropUpload } from "@/components/drag-drop-upload";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<{[key: string]: string}>({});
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  // Load updated products on component mount
  useEffect(() => {
    const loadUpdatedProducts = async () => {
      try {
        console.log('Loading products from API...');
        const response = await fetch('/api/products?includeHidden=true');
        if (response.ok) {
          const updatedProducts = await response.json();
          console.log('Loaded products:', updatedProducts.length);
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
        
        console.log(`Product ${productId} display toggled to ${display}`);
        
        // Trigger automatic refresh of products page
        // Method 1: localStorage event (works across tabs)
        const timestamp = Date.now().toString();
        localStorage.setItem('productUpdated', timestamp);
        localStorage.setItem('lastProductUpdate', timestamp);
        localStorage.removeItem('productUpdated');
        
        // Method 2: Custom event (works in same tab)
        window.dispatchEvent(new CustomEvent('productUpdated', { 
          detail: { productId, display } 
        }));
        
        // Show success message
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

  const handleImageUpload = async (productId: string, imageIndex: number, file: File) => {
    if (!editingProduct) {
      console.error('No product being edited');
      alert('No product selected for editing');
      return;
    }

    try {
      console.log('🔄 Starting image upload:', { productId, imageIndex, fileName: file.name });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      formData.append('imageIndex', imageIndex.toString());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📤 Upload response:', result);
      
      if (result.success) {
        // Update the editing product's images array
        const newImages = [...editingProduct.images];
        newImages[imageIndex] = result.filename;
        
        setEditingProduct({
          ...editingProduct,
          images: newImages
        });
        
        console.log('✅ Image uploaded successfully:', result.filename);
        console.log('📝 Updated product images:', newImages);
        
        // Show success message
        alert(`Image uploaded successfully! File: ${result.filename}`);
      } else {
        console.error('❌ Upload failed:', result.error);
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Image upload error:', error);
      alert('Failed to upload image: ' + error);
    }
  };

  const handleVideoUpload = async (productId: string, videoIndex: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      formData.append('videoIndex', videoIndex.toString());

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        const newVideos = [...(editingProduct.videos || [])];
        newVideos[videoIndex] = result.filename;
        setEditingProduct({
          ...editingProduct,
          videos: newVideos
        });
        
        const key = `${productId}-video-${videoIndex}`;
        setUploadedVideos(prev => ({
          ...prev,
          [key]: result.filename
        }));
        
        alert('Video uploaded successfully!');
      } else {
        alert('Failed to upload video: ' + result.error);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video');
    }
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
      try {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        const result = await response.json();
        
        if (response.ok) {
          alert("Product saved successfully!");
          setEditingProduct(null);
          setUploadedVideos({});
          
          // Refresh the products list
          const updatedResponse = await fetch('/api/products?includeHidden=true');
          if (updatedResponse.ok) {
            const updatedProducts = await updatedResponse.json();
            setAllProducts(updatedProducts);
          }
        } else {
          alert("Failed to save product: " + (result.error || response.statusText));
        }
      } catch (error) {
        console.error('Save error:', error);
        alert("Failed to save product");
      }
    }
  };

  const handleCreateProduct = async () => {
    if (editingProduct) {
      try {
        const response = await fetch('/api/products/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        const result = await response.json();
        
        if (result.success) {
          alert("Product created successfully!");
          setEditingProduct(null);
          setCreatingProduct(false);
          setUploadedVideos({});
          
          // Refresh the products list
          const updatedResponse = await fetch('/api/products?includeHidden=true');
          if (updatedResponse.ok) {
            const updatedProducts = await updatedResponse.json();
            setAllProducts(updatedProducts);
          }
        } else {
          alert("Failed to create product: " + result.error);
        }
      } catch (error) {
        console.error('Create error:', error);
        alert("Failed to create product");
      }
    }
  };

  const handleMultipleImageUploadForNewProduct = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', 'new-product'); // Temporary ID for new products
        formData.append('imageIndex', index.toString());
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          return result.filename;
        }
        throw new Error(`Failed to upload ${file.name}`);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add all new images to the editing product
      const newImages = [...(editingProduct?.images || []), ...uploadedUrls];
      setEditingProduct(prev => ({
        ...prev,
        images: newImages
      }));

      alert(`Successfully uploaded ${uploadedUrls.length} images!`);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      alert('Error uploading images. Please try again.');
    }
  };

  const startCreatingProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      images: ['', '', '', ''],
      videos: [''],
      category: 'electronics',
      rating: 0,
      reviewCount: 0,
      inStock: true,
      display: true,
      tags: [],
      features: [],
      specifications: {}
    });
    setCreatingProduct(true);
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    // Debug logging
    console.log(`Filtering: Category=${selectedCategory}, Product=${product.name}, ProductCategory=${product.category}, MatchesCategory=${matchesCategory}, MatchesSearch=${matchesSearch}`);
    
    return matchesSearch && matchesCategory;
  });

  // Debug logging for state changes
  console.log('Admin Dashboard State:', {
    selectedCategory,
    searchQuery,
    totalProducts: allProducts.length,
    filteredProducts: filteredProducts.length,
    allProducts: allProducts.map(p => ({ name: p.name, category: p.category }))
  });

  // Debug effect to track category changes
  useEffect(() => {
    console.log('Selected category changed to:', selectedCategory);
    console.log('Filtered products count:', filteredProducts.length);
  }, [selectedCategory, filteredProducts.length]);

  const categoriesList = [
    { id: "all", name: "All Products" },
    { id: "archery", name: "Archery" },
    { id: "kitchen", name: "Kitchen" },
    { id: "gym", name: "Gym" },
    { id: "camping", name: "Camping" },
    { id: "beauty", name: "Beauty" },
    { id: "electronics", name: "Electronics" },
    { id: "home-garden", name: "Home & Garden" },
    { id: "fashion", name: "Fashion" },
    { id: "sports", name: "Sports & Outdoors" }
  ];

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
      {/* Header and Categories with yellow background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Manage your products with ease
            </p>
          </div>
          
          {/* Admin Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={startCreatingProduct}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          </div>
          
          {/* Categories Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
              Manage Products by Category
            </h2>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Click on any category to manage products
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {/* All Products Category */}
              <Link href="/admin/dashboard">
                <div className="group cursor-pointer">
                <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center ${
                  selectedCategory === "all" ? 'ring-2 ring-yellow-400' : ''
                }`}>
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-black">A</span>
                  </div>
                  <h3 className="font-semibold text-black mb-1">All Products</h3>
                  <p className="text-sm text-black mb-2">{allProducts.length} products</p>
                  <div className="flex items-center justify-center text-yellow-600 group-hover:text-yellow-700">
                    <span className="text-sm font-medium">View All</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                </div>
              </Link>
              
              {categories.map((category) => (
                <Link key={category.id} href={`/admin/dashboard/${category.id}`}>
                  <div className="group cursor-pointer">
                  <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center ${
                    selectedCategory === category.id ? 'ring-2 ring-yellow-400' : ''
                  }`}>
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-black">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-black mb-1">{category.name}</h3>
                    <p className="text-sm text-black mb-2">{category.productCount} products</p>
                    <div className="flex items-center justify-center text-yellow-600 group-hover:text-yellow-700">
                      <span className="text-sm font-medium">Manage</span>
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-400 mt-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                {categoriesList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-black">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
          <p className="text-sm text-gray-600">
            Selected category: {selectedCategory} | Search: "{searchQuery}"
          </p>
          {selectedCategory !== "all" && (
            <div className="mt-2">
              <p className="text-sm text-blue-600 font-medium">
                Filtered to show only {selectedCategory} products
              </p>
              <Button 
                onClick={() => setSelectedCategory("all")}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Clear Category Filter
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer"
                onClick={() => {
                  setEditingProduct(product);
                  setCreatingProduct(false);
                }}
              >
                <AdminProductCard
                  product={product}
                  onToggleDisplay={handleToggleDisplay}
                />
              </div>
                  ))}
                </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-black mb-2">
              No products found
            </h3>
            <p className="text-black mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Product Editor Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      {creatingProduct ? 'Create New Product' : 'Edit Product'}
                    </span>
                    <Button
                      onClick={() => {
                        setEditingProduct(null);
                        setCreatingProduct(false);
                        setUploadedVideos({});
                      }}
                      variant="outline"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              name: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              price: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                      </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            originalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            category: e.target.value
                          })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            description: e.target.value
                          })}
                          rows={4}
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label>Product Images</Label>
                        
                        {/* Drag and Drop Upload Section */}
                        <div className="mt-4 mb-6">
                          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Multiple Images</h3>
                            <DragDropUpload
                              onFilesSelected={handleMultipleImageUploadForNewProduct}
                              accept="image/*"
                              multiple={true}
                              maxFiles={10}
                              className=""
                            />
                          </div>
                        </div>

                        {/* Existing Images Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {editingProduct.images.map((image: string, index: number) => (
                            <div key={index} className="space-y-2">
                              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              {image ? (
                                  <img
                                  src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                    onLoad={() => console.log('✅ Admin image loaded:', image)}
                                    onError={(e) => {
                                      console.error('❌ Admin image failed to load:', image);
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : (
                                <div className="text-center text-black">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">No image</p>
                                  </div>
                                )}
                              </div>
                              <div>
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(editingProduct.id, index, file);
                                    }
                                  }}
                                className="hidden"
                                id={`image-upload-${index}`}
                              />
                              <Label 
                                htmlFor={`image-upload-${index}`}
                                className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Upload className="h-4 w-4" />
                                Replace Image
                              </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    {/* Video Upload */}
                    <div>
                      <Label>Product Videos</Label>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        {editingProduct.videos.map((video: string, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              {uploadedVideos[`${editingProduct.id}-video-${index}`] || video ? (
                                <video
                                  src={uploadedVideos[`${editingProduct.id}-video-${index}`] || video}
                                  controls
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center text-black">
                                  <Video className="h-8 w-8 mx-auto mb-2" />
                                  <p className="text-sm">No video</p>
                                </div>
                              )}
                            </div>
                      <div>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleVideoUpload(editingProduct.id, index, file);
                                  }
                                }}
                                className="hidden"
                                id={`video-upload-${index}`}
                              />
                              <Label 
                                htmlFor={`video-upload-${index}`}
                                className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Upload className="h-4 w-4" />
                                Upload Video
                              </Label>
                            </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Additional Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editingProduct.rating}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            rating: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewCount">Review Count</Label>
                        <Input
                          id="reviewCount"
                          type="number"
                          value={editingProduct.reviewCount}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            reviewCount: parseInt(e.target.value)
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={editingProduct.inStock}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          inStock: e.target.checked
                        })}
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="display"
                        checked={editingProduct.display}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          display: e.target.checked
                        })}
                      />
                      <Label htmlFor="display">Display on Website</Label>
                    </div>
                  </div>
                  
                  {/* Action Buttons at Bottom */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                    <Button
                      onClick={() => {
                        setEditingProduct(null);
                        setCreatingProduct(false);
                        setUploadedVideos({});
                      }}
                      variant="outline"
                      size="lg"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={creatingProduct ? handleCreateProduct : handleSaveProduct}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      size="lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {creatingProduct ? 'Create Product' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}