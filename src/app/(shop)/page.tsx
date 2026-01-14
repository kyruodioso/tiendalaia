import { client } from '@/sanity/client'
import ProductCard from '@/components/ProductCard'
import Hero from '@/components/Hero'
import { CATEGORIES_WITH_PRODUCTS_QUERY } from '@/sanity/queries'
import Link from 'next/link'

interface CategoryWithProducts {
  _id: string
  name: string
  slug: { current: string }
  products: any[]
}

async function getCategoriesWithProducts() {
  return client.fetch(CATEGORIES_WITH_PRODUCTS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function Home() {
  const categories: CategoryWithProducts[] = await getCategoriesWithProducts()

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      {categories.map((category) => (
        <section key={category._id} className="max-w-7xl mx-auto px-4 py-16 border-b border-gray-100 last:border-0">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black">
              {category.name}
            </h2>
            <Link
              href={`/shop?category=${category.slug.current}`}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider"
            >
              Ver todo {category.name} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {category.products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
