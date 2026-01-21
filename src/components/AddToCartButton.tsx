'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { clsx } from 'clsx'

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    price: number
    image: any
    size: string
    slug: string
    stock?: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  // Calculate available stock considering what's already in the cart
  // Note: Assuming stock is global for the product, not per size, based on current schema
  const currentInCart = cartItems
    .filter((item) => item._id === product._id)
    .reduce((acc, item) => acc + item.quantity, 0)

  const maxStock = product.stock || 0
  const availableStock = Math.max(0, maxStock - currentInCart)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor selecciona un talle')
      return
    }

    if (quantity > availableStock) {
      toast.error(`Solo quedan ${availableStock} unidades disponibles`)
      return
    }

    // Add items one by one or modify store to accept quantity
    // Since store only has addItem (adds 1) or updateQuantity, we can loop or just add 1 for now
    // But wait, the store's addItem adds 1.
    // Let's call addItem 'quantity' times or update the store to accept quantity.
    // For now, calling it in a loop is a quick hack, but better to just add 1 if we don't change store.
    // However, user wants to select quantity? "que el comprador no pueda seleccionar mas de lo que hay en stock"
    // Usually implies a quantity selector.

    // Let's just add 1 for now to keep it simple and consistent with existing store, 
    // BUT if we want to support adding multiple, we should update the store.
    // Given the constraints, I will update the store logic in a separate step if needed, 
    // but for now I will just loop to add multiple items which is safe with the current store implementation.

    for (let i = 0; i < quantity; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        slug: product.slug,
      })
    }

    toast.success('Agregado al carrito')
    setQuantity(1) // Reset quantity selector
  }

  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Size Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-900">Talle</span>
        <div className="grid grid-cols-4 gap-2">
          {product.size?.split(',').map((s) => s.trim()).filter(Boolean).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-2 text-sm font-medium border transition-colors ${selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 text-gray-900 hover:border-black hover:bg-gray-50'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-900">Cantidad <span className="text-gray-500 font-normal text-xs ml-2">({availableStock} disponibles)</span></span>
        <div className="flex items-center border border-gray-300 w-fit">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= availableStock}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={availableStock === 0}
        className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {availableStock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
      </button>
    </div>
  )
}
