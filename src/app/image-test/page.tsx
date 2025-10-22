"use client";

import { useState, useEffect } from 'react';

export default function ImageTest() {
  const [images, setImages] = useState([
    '/products/archery-bow.jpg',
    '/products/premium-illuminated-archery-nocks--6-pack--1.jpg',
    '/products/dibear-gym-gloves.jpg'
  ]);
  
  const [status, setStatus] = useState({});

  useEffect(() => {
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setStatus(prev => ({ ...prev, [index]: 'loaded' }));
      };
      img.onerror = () => {
        setStatus(prev => ({ ...prev, [index]: 'error' }));
      };
      img.src = src;
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
      <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="border p-4">
            <img 
              src={src} 
              alt={`Test ${index}`}
              className="w-full h-48 object-cover"
              onLoad={() => console.log(`Image ${index} loaded:`, src)}
              onError={() => console.error(`Image ${index} failed:`, src)}
            />
            <p className="mt-2">
              Status: {status[index] === 'loaded' ? '✅ Loaded' : 
                      status[index] === 'error' ? '❌ Error' : '⏳ Loading...'}
            </p>
            <p className="text-sm text-gray-600">{src}</p>
          </div>
        ))}
      </div>
    </div>
  );
}





