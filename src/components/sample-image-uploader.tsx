"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function SampleImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [uploadingOriginal, setUploadingOriginal] = useState(false);
  const [originalResult, setOriginalResult] = useState<any>(null);
  const [originalError, setOriginalError] = useState<string>("");

  const handleUploadSampleImages = async () => {
    setUploading(true);
    setError("");
    setResult(null);

    try {
      console.log('🚀 Starting sample image upload...');
      
      const response = await fetch('/api/upload-sample-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Sample images uploaded successfully:', data);
        setResult(data);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading sample images:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadOriginalProducts = async () => {
    setUploadingOriginal(true);
    setOriginalError("");
    setOriginalResult(null);

    try {
      console.log('🚀 Starting original products upload...');
      
      const response = await fetch('/api/upload-original-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Original products uploaded successfully:', data);
        setOriginalResult(data);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading original products:', error);
      setOriginalError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploadingOriginal(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Sample Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          <strong>Step 1:</strong> Upload the original 11 products to Supabase first.<br/>
          <strong>Step 2:</strong> Then generate sample images for all products.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleUploadOriginalProducts}
            disabled={uploadingOriginal}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {uploadingOriginal ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Original Products...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Step 1: Upload Original Products (11 products)
              </>
            )}
          </Button>

          <Button
            onClick={handleUploadSampleImages}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Sample Images...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Step 2: Upload Sample Images for All Products
              </>
            )}
          </Button>
        </div>

        {originalError && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">Original Products Upload Failed</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{originalError}</p>
          </div>
        )}

        {originalResult && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold">Original Products Uploaded!</span>
            </div>
            <div className="text-green-600 text-sm mt-2">
              <p>✅ Products uploaded: {originalResult.summary.uploadedCount}/{originalResult.summary.totalProducts}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">Sample Images Upload Failed</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold">Upload Successful!</span>
            </div>
            <div className="text-green-600 text-sm mt-2">
              <p>✅ Products processed: {result.summary.productsProcessed}</p>
              <p>✅ Total images uploaded: {result.summary.totalImagesUploaded}</p>
            </div>
            <details className="mt-2">
              <summary className="text-green-600 text-sm cursor-pointer">View Details</summary>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(result.summary.results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
