'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function WhatsAppButton() {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show button after a small delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    const handleClick = () => {
        const phoneNumber = '5491112345678' // Replace with actual number
        let message = 'Hola Laia!'

        if (pathname?.startsWith('/product/')) {
            // Try to get product name from H1
            const productName = document.querySelector('h1')?.innerText || 'este producto'
            const url = window.location.href
            message = `Hola Laia! Me interesa este producto: ${productName} - ${url}`
        }

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
    }

    if (!isVisible) return null

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
            aria-label="Contactar por WhatsApp"
        >
            <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></div>
            <MessageCircle size={28} fill="white" className="relative z-10" />
        </button>
    )
}
