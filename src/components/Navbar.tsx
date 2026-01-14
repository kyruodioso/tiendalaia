'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { client } from '@/sanity/client'
import { CATEGORIES_QUERY } from '@/sanity/queries'

interface Category {
  _id: string
  name: string
  slug: { current: string }
}

export default function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const items = useCartStore((state) => state.items)
  const [isMounted, setIsMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    client.fetch(CATEGORIES_QUERY).then(setCategories)
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
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="relative w-24 h-12"
            >
              <Image
                src="/logo.jpg"
                alt="Laia Store"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div
                className="relative group"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button
                  className={clsx(
                    "flex items-center gap-1 font-medium text-sm uppercase tracking-wider transition-colors",
                    isScrolled ? "text-gray-900 hover:text-gray-600" : "text-white hover:text-gray-200 drop-shadow-sm"
                  )}
                >
                  Categorías
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 ring-1 ring-black ring-opacity-5"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/shop?category=${category.slug.current}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 uppercase tracking-wide"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

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
