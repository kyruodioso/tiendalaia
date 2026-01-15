'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
    mainImage: any
    gallery?: any[]
    productName: string
    isSold: boolean
}

export default function ProductGallery({ mainImage, gallery, productName, isSold }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(mainImage)
    const [isZoomOpen, setIsZoomOpen] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })

    // Combine main image and gallery for a complete list
    // Filter out any potential nulls if necessary
    const allImages = [mainImage, ...(gallery || [])].filter(Boolean)

    const handleImageClick = (image: any) => {
        setSelectedImage(image)
    }

    const handleMainImageClick = () => {
        setIsZoomOpen(true)
        setZoomLevel(1) // Reset zoom
    }

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        const currentIndex = allImages.indexOf(selectedImage)
        const nextIndex = (currentIndex + 1) % allImages.length
        setSelectedImage(allImages[nextIndex])
    }

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        const currentIndex = allImages.indexOf(selectedImage)
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length
        setSelectedImage(allImages[prevIndex])
    }

    const handleZoomToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (zoomLevel > 1) {
            setZoomLevel(1)
            setPanPosition({ x: 0, y: 0 })
        } else {
            setZoomLevel(2.5)
            // Calculate click position relative to image to center zoom there?
            // For simplicity, just zoom in center or follow mouse in a more complex implementation
            // Let's just zoom in center for now or implement a simple pan
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomLevel > 1) {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - left) / width) * 100
            const y = ((e.clientY - top) / height) * 100
            setPanPosition({ x, y })
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails - Mobile: Bottom (order-2), Desktop: Left (order-1) */}
            {allImages.length > 1 && (
                <div className="order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar py-2 lg:py-0">
                    {allImages.map((image, i) => (
                        <button
                            key={i}
                            onClick={() => handleImageClick(image)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === image ? 'border-black opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={urlFor(image).width(200).height(200).url()}
                                alt={`${productName} ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div
                className="order-1 lg:order-2 relative w-full aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden cursor-zoom-in group"
                onClick={handleMainImageClick}
            >
                <Image
                    src={urlFor(selectedImage).width(800).height(1000).url()}
                    alt={productName}
                    fill
                    className={`object-cover object-center transition-transform duration-300 ${isSold ? 'grayscale' : ''}`}
                    priority
                />

                {/* Hover Zoom Hint */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-white/80 p-2 rounded-full backdrop-blur-sm text-gray-800 shadow-sm">
                        <ZoomIn size={20} />
                    </div>
                </div>

                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                        <span className="bg-red-600 text-white px-6 py-2 text-lg font-bold uppercase tracking-widest transform -rotate-12">
                            Vendido
                        </span>
                    </div>
                )}
            </div>

            {/* Zoom Modal / Lightbox */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setIsZoomOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsZoomOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-4 z-50 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors hidden md:block"
                            >
                                <ChevronLeft size={40} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-4 z-50 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors hidden md:block"
                            >
                                <ChevronRight size={40} />
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center overflow-hidden"
                        onClick={handleZoomToggle}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomLevel(1)}
                        style={{ cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
                    >
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            style={{
                                transform: zoomLevel > 1 ? `scale(${zoomLevel})` : 'scale(1)',
                                transformOrigin: zoomLevel > 1 ? `${panPosition.x}% ${panPosition.y}%` : 'center',
                                transition: 'transform 0.2s ease-out'
                            }}
                        >
                            <Image
                                src={urlFor(selectedImage).width(1600).height(2000).url()}
                                alt={productName}
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                    </div>

                    {/* Mobile Navigation Hint or Dots could go here */}
                </div>
            )}
        </div>
    )
}
