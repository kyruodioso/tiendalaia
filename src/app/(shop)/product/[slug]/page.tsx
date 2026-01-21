import { client } from '@/sanity/client'
import { PortableText } from 'next-sanity'
import AddToCartButton from '@/components/AddToCartButton'
import ProductGallery from '@/components/ProductGallery'
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
      status,
      stock
    }`,
    { slug }
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log('ProductPage received slug:', slug)
  const product = await getProduct(slug)
  console.log('ProductPage fetch result:', product ? 'Found' : 'Not Found')

  if (!product) {
    console.log('Product not found for slug:', slug)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Producto no encontrado</h2>
          <p className="mt-2 text-gray-600">El producto que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    )
  }

  const isSold = product.status === 'sold' || product.stock === 0

  return (
    <div className="min-h-screen bg-white pt-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Gallery */}
          <ProductGallery
            mainImage={product.mainImage}
            gallery={product.gallery}
            productName={product.name}
            isSold={isSold}
          />

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
                  Sin Stock
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
                    stock: product.stock
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
