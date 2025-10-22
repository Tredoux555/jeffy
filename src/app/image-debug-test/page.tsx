"use client";

import { useState, useEffect } from 'react';

export default function ImageDebugTest() {
  const [testImages] = useState([
    '/products/archery-bow.jpg',
    '/products/dibear-gym-gloves.jpg',
    '/products/premium-illuminated-archery-nocks--6-pack--1.jpg'
  ]);
  
  const [loadStatus, setLoadStatus] = useState({});

  useEffect(() => {
    testImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image ${index} loaded:`, src);
        setLoadStatus(prev => ({ ...prev, [index]: 'loaded' }));
      };
      img.onerror = () => {
        console.error(`❌ Image ${index} failed:`, src);
        setLoadStatus(prev => ({ ...prev, [index]: 'error' }));
      };
      img.src = src;
    });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1 style={{ color: 'black', marginBottom: '20px' }}>Image Debug Test</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {testImages.map((src, index) => (
          <div key={index} style={{ border: '2px solid #ccc', padding: '10px' }}>
            <h3 style={{ color: 'black', marginBottom: '10px' }}>Test {index + 1}</h3>
            
            {/* Test 1: Basic img tag */}
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: 'black', fontSize: '12px' }}>Basic img tag:</p>
              <img 
                src={src} 
                alt={`Test ${index}`}
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'cover',
                  border: '1px solid red'
                }}
              />
            </div>
            
            {/* Test 2: With background */}
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: 'black', fontSize: '12px' }}>With background:</p>
              <div style={{ 
                width: '100%', 
                height: '150px', 
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid blue'
              }} />
            </div>
            
            {/* Status */}
            <div style={{ marginTop: '10px' }}>
              <p style={{ color: 'black', fontSize: '12px' }}>
                Status: {loadStatus[index] === 'loaded' ? '✅ Loaded' : 
                        loadStatus[index] === 'error' ? '❌ Error' : '⏳ Loading...'}
              </p>
              <p style={{ color: 'gray', fontSize: '10px' }}>{src}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'black' }}>Console Logs:</h3>
        <p style={{ color: 'gray', fontSize: '12px' }}>Check the browser console for detailed loading status</p>
      </div>
    </div>
  );
}





