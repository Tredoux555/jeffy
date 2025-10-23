"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

export function DragDropUpload({ 
  onFilesSelected, 
  accept = "image/*", 
  multiple = true, 
  maxFiles = 10,
  className = ""
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (accept === "image/*") {
        return file.type.startsWith('image/');
      }
      return true;
    }).slice(0, maxFiles);

    if (validFiles.length > 0) {
      setPreviewFiles(validFiles);
      onFilesSelected(validFiles);
    }
  }, [accept, maxFiles, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (accept === "image/*") {
        return file.type.startsWith('image/');
      }
      return true;
    }).slice(0, maxFiles);

    if (validFiles.length > 0) {
      setPreviewFiles(validFiles);
      onFilesSelected(validFiles);
    }
  }, [accept, maxFiles, onFilesSelected]);

  const removeFile = useCallback((index: number) => {
    const newFiles = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(newFiles);
    onFilesSelected(newFiles);
  }, [previewFiles, onFilesSelected]);

  const clearAllFiles = useCallback(() => {
    setPreviewFiles([]);
    onFilesSelected([]);
  }, [onFilesSelected]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag and Drop Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-yellow-500 bg-yellow-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-500" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drag & Drop Images Here
            </h3>
            <p className="text-gray-500 mb-4">
              Or click the button below to select files
            </p>
            <p className="text-sm text-gray-400">
              Supports: JPG, PNG, GIF, WebP (Max {maxFiles} files)
            </p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File Previews */}
      {previewFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-700">
              Selected Files ({previewFiles.length})
            </h4>
            <Button
              onClick={clearAllFiles}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previewFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <Button
                    onClick={() => removeFile(index)}
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



