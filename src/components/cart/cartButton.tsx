// src/components/CartButton.tsx
'use client'
import { useCartStore } from '@/store/cartStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

export default function CartButton() {
  const totalItems = useCartStore(state => state.totalItems)
  const toggleCart = useCartStore(state => state.toggleCart)

  return (
    <button 
      onClick={toggleCart}
      className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors group"
    >
      <FontAwesomeIcon
        icon={faCartShopping}
        className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors"
      />
      
      {/* Show count badge if items in cart */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {totalItems}
        </span>
      )}
    </button>
  )
}