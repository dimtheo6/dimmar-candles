// src/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item } from '@/constants'

// Extend Item to include quantity for cart
interface CartItem extends Item {
  quantity: number
}

// Define what our cart store will contain
interface CartStore {
  // State
  items: CartItem[]       // Array of items in cart
  isOpen: boolean        // Is cart sidebar open?
  
  // Computed values (derived from state)
  totalItems: number     // Total quantity of all items
  totalPrice: number     // Total price of all items
  
  // Actions
  addItem: (item: Item) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

// Helper functions to calculate totals
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity
  }, 0)
}

export const useCartStore = create<CartStore>()(
  // persist middleware saves cart to localStorage
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      
      // Actions
      addItem: (newItem) => set((state) => {
        // Check if item already exists in cart
        const existingItem = state.items.find(item => item.id === newItem.id)
        
        let newItems: CartItem[]
        
        if (existingItem) {
          // If exists, increase quantity
          newItems = state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          // If new item, add to cart with quantity 1
          newItems = [...state.items, { ...newItem, quantity: 1 }]
        }
        
        return {
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems)
        }
      }),
      
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter(item => item.id !== id)
        
        return {
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems)
        }
      }),
      
      updateQuantity: (id, quantity) => set((state) => {
        let newItems: CartItem[]
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          newItems = state.items.filter(item => item.id !== id)
        } else {
          newItems = state.items.map(item =>
            item.id === id
              ? { ...item, quantity }
              : item
          )
        }
        
        return {
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems)
        }
      }),
      
      clearCart: () => set({
        items: [],
        isOpen: false,
        totalItems: 0,
        totalPrice: 0
      }),
      
      toggleCart: () => set((state) => ({
        isOpen: !state.isOpen
      })),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false })
    }),
    {
      name: 'cart-storage', // localStorage key
      // Only persist items, not isOpen state
      partialize: (state) => ({ items: state.items }),
      // Rehydrate totals when loading from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.totalItems = calculateTotalItems(state.items)
          state.totalPrice = calculateTotalPrice(state.items)
        }
      }
    }
  )
)