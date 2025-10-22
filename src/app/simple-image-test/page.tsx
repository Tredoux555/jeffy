"use client";

export default function SimpleImageTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Image Test</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4">
          <h3 className="font-bold mb-2">Direct Image Tag</h3>
          <img 
            src="/products/archery-bow.jpg" 
            alt="Archery Bow"
            className="w-full h-48 object-cover border"
            onLoad={() => console.log('✅ Archery bow loaded')}
            onError={() => console.log('❌ Archery bow failed')}
          />
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold mb-2">With Inline Styles</h3>
          <img 
            src="/products/archery-bow.jpg" 
            alt="Archery Bow"
            style={{
              width: '100%',
              height: '192px',
              objectFit: 'cover',
              display: 'block',
              backgroundColor: '#f3f4f6'
            }}
            onLoad={() => console.log('✅ Archery bow with styles loaded')}
            onError={() => console.log('❌ Archery bow with styles failed')}
          />
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold mb-2">Another Image</h3>
          <img 
            src="/products/dibear-gym-gloves.jpg" 
            alt="Gym Gloves"
            className="w-full h-48 object-cover border"
            onLoad={() => console.log('✅ Gym gloves loaded')}
            onError={() => console.log('❌ Gym gloves failed')}
          />
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold mb-2">Test Image</h3>
          <img 
            src="/products/premium-illuminated-archery-nocks--6-pack--1.jpg" 
            alt="Archery Nocks"
            className="w-full h-48 object-cover border"
            onLoad={() => console.log('✅ Archery nocks loaded')}
            onError={() => console.log('❌ Archery nocks failed')}
          />
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-bold mb-2">Console Logs:</h3>
        <p className="text-sm text-gray-600">Check the browser console for image loading status</p>
      </div>
    </div>
  );
}





