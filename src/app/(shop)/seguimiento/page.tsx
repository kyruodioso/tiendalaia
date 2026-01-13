'use client'

import { useActionState } from 'react'
import { trackOrder } from '@/app/actions/track-order'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react'
import { clsx } from 'clsx'

const initialState = {
  message: '',
  errors: {},
}

export default function TrackingPage() {
  const [state, formAction, isPending] = useActionState(trackOrder, initialState)

  const steps = [
    { status: 'pending', label: 'Pendiente', icon: Clock },
    { status: 'paid', label: 'Pagado', icon: CheckCircle },
    { status: 'shipped', label: 'Enviado', icon: Truck },
    { status: 'delivered', label: 'Entregado', icon: Package },
  ]

  const getCurrentStepIndex = (status: string) => {
    const statusMap: { [key: string]: number } = {
      pending: 0,
      paid: 1,
      shipped: 2,
      delivered: 3,
      failed: -1,
    }
    return statusMap[status] || 0
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
            Seguí tu Pedido
          </h1>
          <p className="text-lg text-gray-600">
            Ingresá tu número de pedido y email para ver el estado de tu envío.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-8">
            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                    Número de Pedido (ej: LAIA-XXXX)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="orderNumber"
                      id="orderNumber"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                      placeholder="LAIA-..."
                    />
                  </div>
                  {state?.errors?.orderNumber && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.orderNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                      placeholder="tu@email.com"
                    />
                  </div>
                  {state?.errors?.email && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.email}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                {isPending ? 'Buscando...' : 'Rastrear Pedido'}
              </button>

              {state?.error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {state?.success && state.order && (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Pedido #{state.order.orderNumber}
                </h2>
                <p className="text-sm text-gray-700">
                  Realizado el {new Date(state.order._createdAt).toLocaleDateString()}
                </p>
              </div>
              {state.order.trackingNumber && (
                <a
                  href={`https://www.viacargo.com.ar/tracking?guia=${state.order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Seguir en Vía Cargo
                </a>
              )}
            </div>

            {/* Timeline */}
            <div className="px-8 py-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-between">
                  {steps.map((step, stepIdx) => {
                    const currentStepIndex = getCurrentStepIndex(state.order.status)
                    const isCompleted = stepIdx <= currentStepIndex
                    const isCurrent = stepIdx === currentStepIndex

                    return (
                      <div key={step.label} className="flex flex-col items-center">
                        <div
                          className={clsx(
                            'relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white',
                            isCompleted ? 'border-black' : 'border-gray-300'
                          )}
                        >
                          <step.icon
                            className={clsx(
                              'h-5 w-5',
                              isCompleted ? 'text-black' : 'text-gray-400'
                            )}
                            aria-hidden="true"
                          />
                        </div>
                        <span
                          className={clsx(
                            'mt-2 text-xs font-medium uppercase tracking-wide',
                            isCompleted ? 'text-black' : 'text-gray-700'
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="px-8 py-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Envío</h3>
              <div className="flex items-start space-x-3 text-gray-600 mb-8">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{state.order.customerName}</p>
                  <p>{state.order.shippingAddress.street} {state.order.shippingAddress.number}</p>
                  <p>
                    {state.order.shippingAddress.city}, {state.order.shippingAddress.province}
                  </p>
                  <p>{state.order.shippingAddress.zipCode}</p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">Productos</h3>
              <ul className="divide-y divide-gray-200">
                {state.order.products.map((item: any, index: number) => (
                  <li key={index} className="py-4 flex">
                    <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden">
                      {item.product.mainImage && (
                        <Image
                          src={urlFor(item.product.mainImage).width(100).height(100).url()}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h4>{item.product.name}</h4>
                          <p>${item.price}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">Talle: {item.size}</p>
                        <p className="mt-1 text-sm text-gray-700">Cant: {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
