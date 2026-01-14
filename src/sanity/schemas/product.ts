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
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Código único del producto (SKU)',
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
      name: 'costPrice',
      title: 'Cost Price',
      type: 'number',
      description: 'Costo de la prenda para calcular ganancias',
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(0),
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
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
          { title: 'Único', value: 'Único' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'available' },
          { title: 'Vendido', value: 'sold' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
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
      status: 'status',
      code: 'code',
    },
    prepare(selection) {
      const { title, media, price, status, code } = selection
      const statusText = status === 'sold' ? '🔴 Vendido' : '🟢 Disponible'
      return {
        title,
        media,
        subtitle: `[${code || 'No Code'}] $${price} | ${statusText}`,
      }
    },
  },
})
