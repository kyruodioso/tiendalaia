'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

export default function RegretButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [orderId, setOrderId] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderId.trim()) return

        // Here you would typically send this to your backend
        console.log('Solicitud de devolución para orden:', orderId)
        toast.success('Solicitud iniciada. Te contactaremos pronto.')
        setIsOpen(false)
        setOrderId('')
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium hover:underline text-gray-600 hover:text-black transition-colors"
            >
                Botón de Arrepentimiento
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-2">Botón de Arrepentimiento</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Ingresa tu número de pedido para iniciar el proceso de devolución.
                            Tienes 10 días corridos desde la recepción del producto.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Pedido
                                </label>
                                <input
                                    type="text"
                                    id="orderId"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="#12345"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
                            >
                                Iniciar Devolución
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
