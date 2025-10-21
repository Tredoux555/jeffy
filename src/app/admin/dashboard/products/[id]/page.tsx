"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Upload, Image as ImageIcon, Video, Plus, X, Edit3, Eye, LogOut } from "lucide-react";
import { DragDropUpload } from "@/components/drag-drop-upload";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
  const [uploadedVideos, setUploadedVideos] = useState<{[key: string]: string}>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${resolvedParams.id}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          setEditingProduct(productData);
        } else {
          console.error('Error loading product:', response.statusText);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadProduct();
    }
  }, [isAuthenticated, resolvedParams.id]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const handleImageUpload = async (imageIndex: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', resolvedParams.id);
      formData.append('imageIndex', imageIndex.toString());
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.filename; // Use filename instead of url
        
        setUploadedImages(prev => ({
          ...prev,
          [imageIndex]: imageUrl
        }));
        
        // Update the editing product with the new image
        const newImages = [...(editingProduct?.images || [])];
        newImages[imageIndex] = imageUrl;
        setEditingProduct(prev => ({
          ...prev,
          images: newImages
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleMultipleImageUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', resolvedParams.id);
        formData.append('imageIndex', ((editingProduct?.images?.length || 0) + index).toString());
        
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
      
      // Add all new images to the product
      const newImages = [...(editingProduct?.images || []), ...uploadedUrls];
      const updatedProduct = {
        ...editingProduct,
        images: newImages
      };
      
      setEditingProduct(updatedProduct);

      // Automatically save the product with new images
      const saveResponse = await fetch(`/api/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      
      if (saveResponse.ok) {
        const savedProduct = await saveResponse.json();
        setProduct(savedProduct);
        
        // Trigger a page refresh to ensure images are visible
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        // Dispatch custom event to notify other pages of product update
        const event = new CustomEvent('productUpdated', { 
          detail: { productId: resolvedParams.id, action: 'imagesUpdated' } 
        });
        window.dispatchEvent(event);
        
        // Also use localStorage to trigger updates
        localStorage.setItem('productUpdated', Date.now().toString());
        
        alert(`Successfully uploaded and saved ${uploadedUrls.length} images! Page will refresh to show changes.`);
      } else {
        alert(`Images uploaded but failed to save. Please click "Save Changes" manually.`);
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      alert('Error uploading images. Please try again.');
    }
  };

  const handleVideoUpload = async (videoIndex: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', resolvedParams.id);
      formData.append('videoIndex', videoIndex.toString());
      
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        const videoUrl = result.filename; // Use filename instead of url
        
        setUploadedVideos(prev => ({
          ...prev,
          [videoIndex]: videoUrl
        }));
        
        // Update the editing product with the new video
        const newVideos = [...(editingProduct?.videos || [])];
        newVideos[videoIndex] = videoUrl;
        setEditingProduct(prev => ({
          ...prev,
          videos: newVideos
        }));
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        setIsEditing(false);
        alert('Product updated successfully!');
      } else {
        console.error('Error updating product:', response.statusText);
        alert('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Product deleted successfully!');
        router.push('/admin/dashboard');
      } else {
        console.error('Error deleting product:', response.statusText);
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const addNewImage = () => {
    const newImages = [...(editingProduct?.images || []), ''];
    setEditingProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const removeImage = (index: number) => {
    const newImages = editingProduct?.images?.filter((_: any, i: number) => i !== index) || [];
    setEditingProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addNewVideo = () => {
    const newVideos = [...(editingProduct?.videos || []), ''];
    setEditingProduct(prev => ({
      ...prev,
      videos: newVideos
    }));
  };

  const removeVideo = (index: number) => {
    const newVideos = editingProduct?.videos?.filter((_: any, i: number) => i !== index) || [];
    setEditingProduct(prev => ({
      ...prev,
      videos: newVideos
    }));
  };

  // Variant management functions
  const addVariant = () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: '',
      type: 'size' as const,
      price: editingProduct?.price || 0,
      originalPrice: editingProduct?.originalPrice || 0,
      inStock: true,
      sku: ''
    };
    const newVariants = [...(editingProduct?.variants || []), newVariant];
    setEditingProduct(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const removeVariant = (index: number) => {
    const newVariants = editingProduct?.variants?.filter((_: any, i: number) => i !== index) || [];
    setEditingProduct(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...(editingProduct?.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setEditingProduct(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-black">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-black mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/admin/dashboard">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href={`/products/${product.id}`} target="_blank">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <Eye className="mr-2 h-4 w-4" />
                  View Live
                </Button>
              </Link>
            </div>
            <Button onClick={handleLogout} variant="outline" className="bg-white hover:bg-gray-100">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-lg text-black/80">Admin Product Management</p>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="bg-white hover:bg-gray-100">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
              <Button 
                onClick={() => setShowDeleteConfirm(true)} 
                variant="outline" 
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                <CardTitle className="text-xl font-bold text-black">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-gradient-to-br from-yellow-400 to-yellow-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-black font-bold">Product Name</Label>
                    <Input
                      id="name"
                      value={isEditing ? (editingProduct?.name || '') : (product?.name || '')}
                      onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="text-black font-semibold bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-black font-bold">Price (R)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={isEditing ? (editingProduct?.price || '') : (product?.price || '')}
                      onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      disabled={!isEditing}
                      className="text-black font-semibold bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-black">Category</Label>
                  <Input
                    id="category"
                    value={isEditing ? (editingProduct?.category || '') : (product?.category || '')}
                    onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    disabled={!isEditing}
                    className="text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-black">Description</Label>
                  <Textarea
                    id="description"
                    value={isEditing ? (editingProduct?.description || '') : (product?.description || '')}
                    onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    className="text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating" className="text-black">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={isEditing ? (editingProduct?.rating || '') : (product?.rating || '')}
                      onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews" className="text-black">Review Count</Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={isEditing ? (editingProduct?.reviews || '') : (product?.reviews || '')}
                      onChange={(e) => isEditing && setEditingProduct(prev => ({ ...prev, reviews: parseInt(e.target.value) }))}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Media Management */}
          <div className="space-y-6">
            {/* Images */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-black">Product Images</CardTitle>
                  {isEditing && (
                    <Button onClick={addNewImage} size="sm" className="bg-green-500 hover:bg-green-600 text-white font-bold">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Single Image
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-yellow-400 to-yellow-500">
                {/* Drag and Drop Upload Section */}
                <div className="mb-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Multiple Images</h3>
                    <DragDropUpload
                      onFilesSelected={handleMultipleImageUpload}
                      accept="image/*"
                      multiple={true}
                      maxFiles={10}
                      className=""
                    />
                  </div>
                </div>

                {/* Existing Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(isEditing ? editingProduct?.images : product?.images)?.map((image: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-500">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No image</p>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex space-x-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                            className="hidden"
                            id={`image-${index}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`image-${index}`)?.click()}
                            className="flex-1 text-xs"
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            Replace
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-black">Product Videos</CardTitle>
                  {isEditing && (
                    <Button onClick={addNewVideo} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white font-bold">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-yellow-400 to-yellow-500">
                <div className="space-y-4">
                  {(isEditing ? editingProduct?.videos : product?.videos)?.map((video: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {video ? (
                          <video
                            src={video}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-500">
                            <Video className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No video</p>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex space-x-1">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVideoUpload(index, file);
                            }}
                            className="hidden"
                            id={`video-${index}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`video-${index}`)?.click()}
                            className="flex-1"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Video
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVideo(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-black">Product Variants</CardTitle>
                  {isEditing && (
                    <Button onClick={addVariant} size="sm" className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-yellow-400 to-yellow-500">
                <div className="space-y-4">
                  {(isEditing ? editingProduct?.variants : product?.variants)?.map((variant: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-black font-bold">Variant Name</Label>
                          <Input
                            value={isEditing ? variant.name : variant.name}
                            onChange={(e) => isEditing && updateVariant(index, 'name', e.target.value)}
                            disabled={!isEditing}
                            placeholder="e.g., Small, Medium, Large"
                            className="text-black bg-white border-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-black font-bold">Type</Label>
                          <select
                            value={isEditing ? variant.type : variant.type}
                            onChange={(e) => isEditing && updateVariant(index, 'type', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
                          >
                            <option value="size">Size</option>
                            <option value="color">Color</option>
                            <option value="material">Material</option>
                            <option value="style">Style</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-black font-bold">Price (R)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={isEditing ? variant.price : variant.price}
                            onChange={(e) => isEditing && updateVariant(index, 'price', parseFloat(e.target.value))}
                            disabled={!isEditing}
                            className="text-black bg-white border-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-black font-bold">Original Price (R)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={isEditing ? variant.originalPrice : variant.originalPrice}
                            onChange={(e) => isEditing && updateVariant(index, 'originalPrice', parseFloat(e.target.value))}
                            disabled={!isEditing}
                            className="text-black bg-white border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-black font-bold">SKU</Label>
                          <Input
                            value={isEditing ? variant.sku : variant.sku}
                            onChange={(e) => isEditing && updateVariant(index, 'sku', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Stock keeping unit"
                            className="text-black bg-white border-gray-300"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isEditing ? variant.inStock : variant.inStock}
                              onChange={(e) => isEditing && updateVariant(index, 'inStock', e.target.checked)}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <Label className="text-black font-bold">In Stock</Label>
                          </div>
                          {isEditing && (
                            <Button
                              onClick={() => removeVariant(index)}
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || []}
                  {(!editingProduct?.variants || editingProduct.variants.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No variants added yet.</p>
                      <p className="text-sm">Add variants to offer different sizes, colors, or styles.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-300">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
              <CardTitle className="text-red-600 font-bold">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-yellow-400 to-yellow-500">
              <p className="text-black mb-4">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleDelete} 
                  disabled={deleting}
                  className="bg-red-500 hover:bg-red-600 text-white flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </Button>
                <Button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}