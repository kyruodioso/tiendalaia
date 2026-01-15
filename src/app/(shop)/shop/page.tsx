import { client } from '@/sanity/client'
import ProductCard from '@/components/ProductCard'
import { groq } from 'next-sanity'

import Link from 'next/link'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import SearchFilter from '@/components/SearchFilter'

export default async function ShopPage(props: Props) {
    const searchParams = await props.searchParams
    const categorySlug = searchParams.category
    const searchQuery = searchParams.q

    let query = ''
    let params: any = {}

    if (categorySlug) {
        query = groq`*[_type == "product" && category->slug.current == $categorySlug && status != 'sold']{
            _id,
            name,
            slug,
            price,
            mainImage,
            "category": { "name": category->name }
        }`
        params = { categorySlug }
    } else if (searchQuery) {
        query = groq`*[_type == "product" && name match $searchQuery + "*" && status != 'sold']{
            _id,
            name,
            slug,
            price,
            mainImage,
            "category": { "name": category->name }
        }`
        params = { searchQuery }
    } else {
        query = groq`*[_type == "product" && status != 'sold']{
            _id,
            name,
            slug,
            price,
            mainImage,
            "category": { "name": category->name }
        }`
    }

    const products = await client.fetch(query, params, { next: { revalidate: 60 } })

    let title = 'Todos los Productos'
    if (categorySlug) title = `${categorySlug}`
    if (searchQuery) title = `Resultados para "${searchQuery}"`

    return (
        <div className="min-h-screen">
            <SearchFilter />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-display font-bold mb-12 capitalize text-center">
                    {title}
                </h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8 md:gap-x-8 md:gap-y-16">
                        {products.map((product: any, index: number) => (
                            <ProductCard key={product._id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 mb-8">No se encontraron productos.</p>
                        <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                            Ver todos los productos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
