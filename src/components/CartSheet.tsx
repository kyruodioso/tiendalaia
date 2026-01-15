'use client'

import { useCartStore } from '@/store/cart'
import { urlFor } from '@/sanity/image'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { toast } from 'sonner'




import ShippingForm from './ShippingForm'
import { formatPrice } from '@/lib/utils'

interface CartSheetProps {
  triggerClassName?: string
}

export default function CartSheet({ triggerClassName }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, getCartTotal, shippingCost, customerData, shippingMethod, setShippingMethod, setShippingCost } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, shippingCost, customerData, shippingMethod }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      if (data.init_point) {
        window.location.href = data.init_point
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Hubo un error al procesar tu compra. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={clsx("relative p-2 transition-colors", triggerClassName || "text-gray-600 hover:text-gray-900")}
      >
        <ShoppingBag className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Carrito de Compras</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-700">
                <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={`${item._id}-${item.size}`} className="flex py-2">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.image && (
                        <Image
                          src={urlFor(item.image).width(200).height(200).url()}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">Talle: {item.size}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item._id, item.size)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="mb-8">
              <h3 className="text-lg font-display font-bold text-gray-900 mb-4 uppercase tracking-wide">Método de Entrega</h3>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => {
                    setShippingMethod('shipping')
                  }}
                  className={clsx(
                    'flex-1 py-3 px-4 border rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-200',
                    shippingMethod === 'shipping'
                      ? 'border-black bg-black text-white shadow-md transform scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-black hover:shadow-sm'
                  )}
                >
                  Envío
                </button>
                <button
                  onClick={() => {
                    setShippingMethod('pickup')
                    setShippingCost(0)
                  }}
                  className={clsx(
                    'flex-1 py-3 px-4 border rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-200',
                    shippingMethod === 'pickup'
                      ? 'border-black bg-black text-white shadow-md transform scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-black hover:shadow-sm'
                  )}
                >
                  Coordinar
                </button>
              </div>

              {shippingMethod === 'pickup' && (
                <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm text-blue-800 border border-blue-100">
                  <p>Una vez realizada la compra, nos pondremos en contacto con vos para coordinar el punto de entrega en las zonas habilitadas (Castelar y alrededores).</p>
                </div>
              )}

              <h3 className="text-lg font-display font-bold text-gray-900 mb-4 uppercase tracking-wide">Información de Envío</h3>
              <ShippingForm shippingMethod={shippingMethod} />
            </div>

            <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
              <p>Subtotal</p>
              <p>{formatPrice(getCartTotal())}</p>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Envío</p>
                <p>{formatPrice(shippingCost)}</p>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
              <p>Total</p>
              <p>{formatPrice(getCartTotal() + shippingCost)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-600 mb-6">
              Impuestos calculados al finalizar la compra.
            </p>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || isLoading || !customerData}
              className="w-full flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-4 text-base font-bold uppercase tracking-widest text-white shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98]"
            >
              {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
            {!customerData && items.length > 0 && (
              <p className="text-xs text-red-500 text-center mt-2">
                Por favor completa los datos de envío para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
