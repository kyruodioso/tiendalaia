'use client'

import { useCartStore } from '@/store/cart'
import { urlFor } from '@/sanity/image'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'
import ShippingForm from '@/components/ShippingForm'

export default function CartPage() {
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

      const { init_point } = await response.json()
      
      if (init_point) {
        window.location.href = init_point
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4 uppercase tracking-wide">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Parece que aún no has agregado productos. Explorá nuestra colección y encontrá tu estilo.</p>
          <Link 
            href="/"
            className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-lg"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-black text-gray-900 mb-12 uppercase tracking-tighter">Tu Carrito</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Product List */}
          <section className="lg:col-span-7">
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={`${item._id}-${item.size}`} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-gray-200 relative">
                      {item.image && (
                        <Image
                          src={urlFor(item.image).width(400).height(400).url()}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg">
                            <Link href={`/product/${encodeURIComponent(item.slug)}`} className="font-bold text-gray-900 hover:text-gray-700 uppercase tracking-wide">
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-600">Talle: <span className="font-medium text-gray-900">{item.size}</span></p>
                        </div>
                        <p className="mt-1 text-lg font-medium text-gray-900">${item.price * item.quantity}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center border border-gray-300 rounded-md w-max">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => removeItem(item._id, item.size)}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <span className="sr-only">Eliminar</span>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary */}
          <section className="lg:col-span-5 mt-16 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-display font-bold text-gray-900 mb-6 uppercase tracking-wide">Resumen del Pedido</h2>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Método de Entrega</h3>
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

                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide mt-6">Información de Envío</h3>
                <ShippingForm shippingMethod={shippingMethod} />
              </div>

              <dl className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${getCartTotal()}</dd>
                </div>
                {shippingCost > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Envío</dt>
                    <dd className="text-sm font-medium text-gray-900">${shippingCost}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">${getCartTotal() + shippingCost}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isLoading || !customerData}
                  className="w-full bg-black border border-transparent rounded-md shadow-lg py-4 px-4 text-base font-bold text-white uppercase tracking-widest hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
                >
                  {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
                </button>
                {!customerData && items.length > 0 && (
                  <p className="text-xs text-red-500 text-center mt-3">
                    Por favor completa los datos de envío para continuar
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
