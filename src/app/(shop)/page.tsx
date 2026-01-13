import { client } from '@/sanity/client'
import ProductCard from '@/components/ProductCard'
import Hero from '@/components/Hero'

interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  mainImage: any
  gallery: any[]
  category: { name: string }
}

async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    name,
    slug,
    price,
    mainImage,
    gallery,
    category->{name}
  }`
  return client.fetch(query, {}, { next: { revalidate: 60 } })
}

export default async function Home() {
  const products: Product[] = await getProducts()

  // Featured product (first one)
  const featuredProduct = products[0]
  const otherProducts = products.slice(1)

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-12 text-black">
          Últimos Lanzamientos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </section>
    </main>
  )
}
