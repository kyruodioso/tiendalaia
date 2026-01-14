import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    {
      name: 'shippingDetails',
      title: 'Shipping Details',
      type: 'object',
      fields: [
        { name: 'weight', title: 'Weight (kg)', type: 'number' },
        { name: 'width', title: 'Width (cm)', type: 'number' },
        { name: 'height', title: 'Height (cm)', type: 'number' },
        { name: 'depth', title: 'Depth (cm)', type: 'number' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      price: 'price',
      stock: 'stock',
    },
    prepare(selection) {
      const { title, media, price, stock } = selection
      return {
        title,
        media,
        subtitle: `$${price} | Stock: ${stock ?? 0}`,
      }
    },
  },
})
