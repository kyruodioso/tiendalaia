'use client'

import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const items = useCartStore((state) => state.items)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  if (!isMounted) return null

  return (
    <motion.nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200 py-2" : "bg-transparent py-4"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            href="/" 
            className={clsx(
              "text-3xl font-display font-black tracking-tighter uppercase transition-colors duration-300",
              isScrolled ? "text-gray-900" : "text-white drop-shadow-md"
            )}
          >
            Laia
          </Link>
          <Link 
            href="/carrito"
            className={clsx(
              "relative p-2 transition-colors duration-300 hover:opacity-80",
              isScrolled ? "text-gray-900" : "text-white drop-shadow-md"
            )}
          >
            <ShoppingBag className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
