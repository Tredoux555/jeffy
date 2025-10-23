"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";

interface AddProductFormProps {
  category: string;
  onProductAdded: (product: any) => void;
  onCancel: () => void;
}

export function AddProductForm({ category, onProductAdded, onCancel }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    images: [''],
    videos: [''],
    rating: '0',
    reviewCount: '0',
    inStock: true,
    display: true
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (imageIndex: number, file: File) => {
    setUploading(true);
    setUploadErrors([]);
    
    try {
      console.log('📤 Starting image upload:', { imageIndex, fileName: file.name, fileSize: file.size });
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('productId', 'temp'); // Temporary ID for new products
      uploadFormData.append('imageIndex', imageIndex.toString());
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      console.log('📤 Upload response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('📤 Upload result:', result);
        
        if (result.success) {
          const imageUrl = result.filename;
          
          const newImages = [...(formData.images || [])];
          newImages[imageIndex] = imageUrl;
          setFormData(prev => ({
            ...prev,
            images: newImages
          }));
          
          console.log('✅ Image uploaded successfully:', imageUrl);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      setUploadErrors(prev => [...prev, `Image ${imageIndex + 1}: ${errorMessage}`]);
    } finally {
      setUploading(false);
    }
  };

  const addImageSlot = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const removeImageSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in the product name and price');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...formData,
        category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: (formData.images || []).filter(img => img.trim() !== ''),
        videos: (formData.videos || []).filter(vid => vid.trim() !== ''),
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount)
      };

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        onProductAdded(result.product);
        alert('Product created successfully!');
      } else {
        alert(`Error creating product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="flex items-center justify-between">
            <CardTitle className="text-black font-bold text-xl">Add New {category.charAt(0).toUpperCase() + category.slice(1)} Product</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-black hover:bg-yellow-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-black font-bold">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                  className="bg-white border-gray-300 text-black font-semibold"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-black font-bold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  className="bg-white border-gray-300 text-black font-semibold"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-black font-bold">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                    className="bg-white border-gray-300 text-black font-semibold"
                  />
                </div>
                
                <div>
                  <Label htmlFor="originalPrice" className="text-black font-bold">Original Price (Optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="0.00"
                    className="bg-white border-gray-300 text-black font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-black font-bold">Product Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={addImageSlot} className="bg-white border-gray-300 text-black font-bold hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
              
              {(formData.images || []).map((image, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    {image ? (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-bold truncate">{image}</span>
                        <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image preview failed:', image);
                              console.error('Image element:', e.currentTarget);
                              e.currentTarget.style.display = 'none';
                              // Show error message
                              const errorDiv = document.createElement('div');
                              errorDiv.className = 'w-full h-full flex items-center justify-center text-xs text-red-500';
                              errorDiv.textContent = 'Failed to load';
                              e.currentTarget.parentNode?.appendChild(errorDiv);
                            }}
                            onLoad={() => {
                              console.log('✅ Image loaded successfully:', image);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          className="w-full text-sm font-semibold"
                          disabled={uploading}
                        />
                        {uploading && (
                          <div className="text-sm text-blue-600 font-semibold">
                            📤 Uploading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {(formData.images || []).length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImageSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {/* Show upload errors */}
              {uploadErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="text-red-600 font-semibold text-sm mb-2">Upload Errors:</div>
                  {uploadErrors.map((error, index) => (
                    <div key={index} className="text-red-600 text-sm">• {error}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating" className="text-black font-bold">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="0.0"
                  className="bg-white border-gray-300 text-black font-semibold"
                />
              </div>
              
              <div>
                <Label htmlFor="reviewCount" className="text-black font-bold">Review Count</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={(e) => handleInputChange('reviewCount', e.target.value)}
                  placeholder="0"
                  className="bg-white border-gray-300 text-black font-semibold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving || uploading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
                {saving ? 'Creating...' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-white border-gray-300 text-black font-bold hover:bg-gray-100">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
