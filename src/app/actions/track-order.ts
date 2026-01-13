'use server'

import { client } from '@/sanity/client'
import { z } from 'zod'

const trackOrderSchema = z.object({
  orderNumber: z.string().min(1, 'El número de pedido es requerido'),
  email: z.string().email('Email inválido'),
})

// Simple in-memory rate limiting (for demonstration purposes)
// In production, use Redis or a database
const rateLimitMap = new Map<string, { count: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_ATTEMPTS = 5

export async function trackOrder(prevState: any, formData: FormData) {
  const orderNumber = formData.get('orderNumber') as string
  const email = formData.get('email') as string

  // Rate Limiting
  const ip = 'user-ip' // In a real app, get IP from headers
  const now = Date.now()
  const userRateLimit = rateLimitMap.get(ip) || { count: 0, lastAttempt: now }

  if (now - userRateLimit.lastAttempt > RATE_LIMIT_WINDOW) {
    userRateLimit.count = 0
    userRateLimit.lastAttempt = now
  }

  if (userRateLimit.count >= MAX_ATTEMPTS) {
    return { error: 'Demasiados intentos. Por favor espera un momento.' }
  }

  userRateLimit.count++
  rateLimitMap.set(ip, userRateLimit)

  // Validation
  const validatedFields = trackOrderSchema.safeParse({ orderNumber, email })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber && customerEmail == $email][0]{
        _id,
        orderNumber,
        status,
        trackingNumber,
        customerName,
        shippingAddress,
        products[]{
          quantity,
          size,
          price,
          product->{
            name,
            mainImage
          }
        },
        _createdAt
      }`,
      { orderNumber, email }
    )

    if (!order) {
      return { error: 'No se encontró un pedido con esos datos.' }
    }

    return { success: true, order }
  } catch (error) {
    console.error('Error tracking order:', error)
    return { error: 'Error al buscar el pedido. Intenta nuevamente.' }
  }
}
