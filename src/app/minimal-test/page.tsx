"use client";

export default function MinimalTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Minimal Image Test</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Test 1: Basic img tag</h3>
        <img 
          src="/products/archery-bow.jpg" 
          alt="test"
          style={{ 
            width: '200px', 
            height: '200px', 
            border: '2px solid red',
            backgroundColor: 'yellow'
          }}
        />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Test 2: With object-fit</h3>
        <img 
          src="/products/archery-bow.jpg" 
          alt="test"
          style={{ 
            width: '200px', 
            height: '200px', 
            objectFit: 'cover',
            border: '2px solid green',
            backgroundColor: 'lightblue'
          }}
        />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Test 3: Different image</h3>
        <img 
          src="/products/dibear-gym-gloves.jpg" 
          alt="test"
          style={{ 
            width: '200px', 
            height: '200px', 
            objectFit: 'cover',
            border: '2px solid purple',
            backgroundColor: 'pink'
          }}
        />
      </div>
    </div>
  );
}







