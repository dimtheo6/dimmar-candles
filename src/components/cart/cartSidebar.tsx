// src/components/CartSidebar.tsx
'use client'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    totalPrice, 
    closeCart, 
    removeItem, 
    updateQuantity 
  } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Shopping Cart</h2>
            <button 
              onClick={closeCart}
              className="text-2xl text-neutral-400 hover:text-neutral-600"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-neutral-500 text-center mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                    {item.imageUrl && item.imageUrl[0] ? (
                      <Image
                        src={item.imageUrl[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-neutral-600 text-sm">
                      ${item.price?.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}