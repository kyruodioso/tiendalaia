import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import { formatPrice } from '@/lib/utils'

export const revalidate = 60

async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      price,
      description,
      mainImage,
      gallery,
      size,
      slug,
      category->{name},
      status
    }`,
    { slug }
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Producto no encontrado</h2>
          <p className="mt-2 text-gray-600">El producto que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    )
  }

  const isSold = product.status === 'sold'

  return (
    <div className="min-h-screen bg-white pt-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            {/* Image Grid (Desktop) / Carousel (Mobile - Simplified as stack for now) */}
            <div className="w-full aspect-[3/4] relative overflow-hidden rounded-sm bg-gray-100 mb-4">
              <Image
                src={urlFor(product.mainImage).width(800).height(1000).url()}
                alt={product.name}
                fill
                className={`object-cover object-center ${isSold ? 'grayscale' : ''}`}
                priority
              />
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="bg-red-600 text-white px-6 py-2 text-lg font-bold uppercase tracking-widest transform -rotate-12">
                    Vendido
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnail Grid (Optional) */}
            {product.gallery && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.gallery.map((image: any, i: number) => (
                  <div key={i} className="aspect-[3/4] relative overflow-hidden rounded-sm bg-gray-100">
                    <Image
                      src={urlFor(image).width(200).height(300).url()}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className={`object-cover object-center ${isSold ? 'grayscale' : ''}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="mb-6">
              <h2 className="text-sm text-gray-700 uppercase tracking-widest mb-2">{product.category?.name}</h2>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter sm:text-4xl">{product.name}</h1>
              <p className="text-2xl font-medium text-gray-900 mt-4">{formatPrice(product.price)}</p>
            </div>

            <div className="prose prose-sm text-gray-700 mb-8">
              <PortableText value={product.description} />
            </div>

            {/* Add to Cart */}
            <div>
              {isSold ? (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-4 text-sm font-bold uppercase tracking-widest cursor-not-allowed"
                >
                  Producto Vendido
                </button>
              ) : (
                <AddToCartButton
                  product={{
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.mainImage,
                    size: product.size,
                    slug: product.slug.current,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
