'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    slug: { current: string }
    price: number
    mainImage: any
    gallery?: any[]
    category: { name: string }
  }
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-lg overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.05), transparent 40%)`
        }}
      />

      <Link href={`/product/${product.slug.current}`} className="block relative z-20">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm">
          {/* Main Image */}
          {product.mainImage && (
            <Image
              src={urlFor(product.mainImage).width(600).height(800).url()}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'
                } ${isHovered && product.gallery?.[0] ? 'opacity-0' : 'opacity-100'}`}
            />
          )}

          {/* Second Image (Hover) */}
          {product.gallery?.[0] && (
            <Image
              src={urlFor(product.gallery[0]).width(600).height(800).url()}
              alt={product.name}
              fill
              className={`object-cover absolute inset-0 transition-all duration-700 ease-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
            />
          )}

          {/* Quick Add Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-full bg-white text-black py-3 font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors shadow-lg text-center">
              Ver Producto
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1 p-2">
          <p className="text-xs text-gray-700 uppercase tracking-widest">{product.category?.name}</p>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{product.name}</h3>
          <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
