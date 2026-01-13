import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { client } from '@/sanity/client'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { items, shippingCost, customerData, shippingMethod } = await req.json()
    
    // Server-side validation of shipping cost
    // If pickup, force shippingCost to 0
    const validatedShippingCost = shippingMethod === 'pickup' ? 0 : Number(shippingCost)

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Verify prices from Sanity
    const productIds = items.map((item: any) => item._id)
    const products = await client.fetch(
      `*[_type == "product" && _id in $productIds]{
        _id,
        name,
        price
      }`,
      { productIds }
    )

    const preferenceItems = items.map((item: any) => {
      const product = products.find((p: any) => p._id === item._id)
      if (!product) throw new Error(`Product ${item.name} not found`)

      return {
        title: `${product.name} - ${item.size}`,
        quantity: item.quantity,
        unit_price: product.price,
        currency_id: 'ARS',
      }
    })

    if (validatedShippingCost > 0) {
      preferenceItems.push({
        title: 'Costo de Envío',
        unit_price: validatedShippingCost,
        quantity: 1,
        currency_id: 'ARS',
      })
    }

    const orderNumber = `LAIA-${nanoid()}`

    // Create Order in Sanity
    const order = await client.create({
      _type: 'order',
      orderNumber,
      shippingMethod,
      customerName: customerData.fullName,
      customerDNI: customerData.dni,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      shippingAddress: {
        street: customerData.address,
        number: '', // You might want to split address or add a field
        city: customerData.city,
        province: customerData.province,
        zipCode: customerData.zipCode,
        apartment: customerData.apartment,
      },
      products: items.map((item: any) => ({
        _key: `${item._id}-${item.size}`, // Unique key for array items
        product: { _type: 'reference', _ref: item._id },
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
      totalAmount: preferenceItems.reduce((acc: number, item: any) => acc + item.unit_price * item.quantity, 0),
      shippingCost: Number(shippingCost),
      status: 'pending',
    })

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    
    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: customerData.fullName,
          email: customerData.email,
          phone: {
            area_code: '',
            number: customerData.phone,
          },
          address: {
            zip_code: customerData.zipCode,
            street_name: customerData.address,
            street_number: '',
          },
        },
        external_reference: order._id,
        back_urls: {
          success: `http://localhost:3000/success`,
          failure: `http://localhost:3000/canceled`,
          pending: `http://localhost:3000/canceled`,
        },
        // auto_return: 'approved',
      },
    })

    // Update order with preference ID
    await client.patch(order._id).set({ mpPreferenceId: result.id }).commit()

    return NextResponse.json({ init_point: result.init_point })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
