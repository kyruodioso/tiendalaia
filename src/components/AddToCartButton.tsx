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
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor selecciona un talle')
      return
    }

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      slug: product.slug,
    })
    toast.success('Agregado al carrito')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        {product.size?.split(',').map((s) => s.trim()).filter(Boolean).map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`py-2 text-sm font-medium border transition-colors ${
              selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
      >
        Agregar al Carrito
      </button>
    </div>
  )
}
