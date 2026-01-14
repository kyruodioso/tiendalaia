import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface CartItem {
  _id: string
  name: string
  price: number
  image: SanityImageSource
  size: string
  quantity: number
  slug: string
}

export interface CustomerData {
  name: string
  dni: string
  email: string
  phone: string
  address: {
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    province: string
    zipCode: string
  }
}

interface CartStore {
  items: CartItem[]
  shippingZip: string
  shippingCost: number
  shippingMethod: 'shipping' | 'pickup'
  customerData: CustomerData | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  setShippingZip: (zip: string) => void
  setShippingCost: (cost: number) => void
  setShippingMethod: (method: 'shipping' | 'pickup') => void
  setCustomerData: (data: CustomerData | null) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingZip: '',
      shippingCost: 0,
      shippingMethod: 'shipping',
      customerData: null,
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (i) => i._id === item._id && i.size === item.size
        )

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i._id === item._id && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (id, size) => {
        set({
          items: get().items.filter((i) => !(i._id === id && i.size === size)),
        })
      },
      updateQuantity: (id, size, quantity) => {
        if (quantity < 1) return
        set({
          items: get().items.map((i) =>
            i._id === id && i.size === size ? { ...i, quantity } : i
          ),
        })
      },
      clearCart: () => set({ items: [], shippingCost: 0, shippingZip: '', customerData: null }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      setShippingZip: (zip) => set({ shippingZip: zip }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      setShippingMethod: (method) => set({ shippingMethod: method }),
      setCustomerData: (data) => set({ customerData: data }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
