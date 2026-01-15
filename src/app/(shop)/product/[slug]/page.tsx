import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 60

async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug && status != 'sold'][0]{
      _id,
      name,
      price,
      description,
      mainImage,
      gallery,
      size,
      slug,
      category->{name}
    }`,
    { slug }
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return <div>Producto no encontrado</div>
  }

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
                className="object-cover object-center"
                priority
              />
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
                      className="object-cover object-center"
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
              <p className="text-2xl font-medium text-gray-900 mt-4">${product.price}</p>
            </div>

            <div className="prose prose-sm text-gray-700 mb-8">
              <PortableText value={product.description} />
            </div>

            {/* Add to Cart */}
            <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
