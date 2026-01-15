import { groq } from 'next-sanity'

export const CATEGORIES_WITH_PRODUCTS_QUERY = groq`
  *[_type == "category" && count(*[_type == "product" && references(^._id) && status != 'sold']) > 0] {
    _id,
    name,
    slug,
    "products": *[_type == "product" && references(^._id) && status != 'sold'][0...4] {
      _id,
      name,
      slug,
      price,
      mainImage,
      "category": {
        "name": category->name
      }
    }
  }
`

export const CATEGORIES_QUERY = groq`
  *[_type == "category" && count(*[_type == "product" && references(^._id) && status != 'sold']) > 0] {
    _id,
    name,
    slug
  }
`
