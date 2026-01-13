import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CanceledPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
        <p className="text-gray-600 mb-8">Your payment was canceled. No charges were made.</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Return to Store
        </Link>
      </div>
    </div>
  )
}
