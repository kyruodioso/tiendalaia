'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { processOrderPayment } from '@/app/actions/order-actions'

export default function SuccessContent() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const processedRef = useRef(false)

    useEffect(() => {
        const processPayment = async () => {
            // Prevent double execution in React Strict Mode
            if (processedRef.current) return
            processedRef.current = true

            const paymentId = searchParams.get('payment_id')
            const statusParam = searchParams.get('status')
            const externalReference = searchParams.get('external_reference') // This is our orderId

            if (statusParam === 'approved' && paymentId && externalReference) {
                try {
                    const result = await processOrderPayment(externalReference, paymentId, statusParam)
                    if (result.success) {
                        setStatus('success')
                    } else {
                        setStatus('error')
                        setMessage(result.message || 'Error processing order')
                    }
                } catch (error) {
                    console.error(error)
                    setStatus('error')
                    setMessage('Unexpected error occurred')
                }
            } else {
                // If params are missing or status is not approved, maybe we just show success if it was already processed?
                // Or maybe this is a direct visit?
                // Let's assume if no params, we just show the static success message (maybe user refreshed)
                // But for now, let's just default to success if we can't verify, or show a specific message.
                // Actually, if status is not approved, it shouldn't be on this page usually (MP redirects to failure for failure).
                // But if pending...
                if (statusParam && statusParam !== 'approved') {
                    setStatus('error')
                    setMessage(`Payment status: ${statusParam}`)
                } else {
                    // Fallback for when user refreshes and params might be gone (though usually they stay in URL)
                    // or if just testing.
                    setStatus('success')
                }
            }
        }

        processPayment()
    }, [searchParams])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Procesando tu compra...</h1>
                <p className="text-gray-600">Por favor no cierres esta ventana.</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hubo un problema</h1>
                    <p className="text-gray-600 mb-8">{message}</p>
                    <Link
                        href="/contact"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Contactar Soporte
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-8">Gracias por tu compra. Te hemos enviado un email con los detalles.</p>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Seguir Comprando
                </Link>
            </div>
        </div>
    )
}
