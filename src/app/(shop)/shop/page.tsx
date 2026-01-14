import { client } from '@/sanity/client'
import ProductCard from '@/components/ProductCard'
import { groq } from 'next-sanity'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage(props: Props) {
    const searchParams = await props.searchParams
    const categorySlug = searchParams.category

    const query = categorySlug
        ? groq`*[_type == "product" && category->slug.current == $categorySlug]{
        _id,
        name,
        slug,
        price,
        mainImage,
        "category": { "name": category->name }
      }`
        : groq`*[_type == "product"]{
        _id,
        name,
        slug,
        price,
        mainImage,
        "category": { "name": category->name }
      }`

    const products = await client.fetch(query, { categorySlug }, { next: { revalidate: 60 } })

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-4xl font-display font-bold mb-12 capitalize text-center">
                {categorySlug ? `${categorySlug}` : 'Todos los Productos'}
            </h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product: any, index: number) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No se encontraron productos en esta categoría.</p>
                </div>
            )}
        </div>
    )
}
