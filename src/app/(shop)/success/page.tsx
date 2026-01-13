import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
