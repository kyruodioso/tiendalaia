'use server'

import { serverClient } from '@/sanity/serverClient'
import { sendOrderNotification } from '@/lib/mail'

export async function processOrderPayment(orderId: string, paymentId: string, status: string) {
    if (!orderId || !paymentId) {
        return { success: false, message: 'Missing orderId or paymentId' }
    }

    try {
        // 1. Fetch the order
        const order = await serverClient.fetch(
            `*[_type == "order" && _id == $orderId][0]{
        ...,
        products[]{
          ...,
          product->{
            name
          }
        }
      }`,
            { orderId }
        )

        if (!order) {
            return { success: false, message: 'Order not found' }
        }

        // 2. Check if already paid to avoid duplicate emails
        if (order.status === 'paid') {
            return { success: true, message: 'Order already processed' }
        }

        // 3. Update order status if payment is approved
        if (status === 'approved') {
            await serverClient
                .patch(orderId)
                .set({
                    status: 'paid',
                    mpPaymentId: paymentId,
                    paidAt: new Date().toISOString()
                })
                .commit()

            // 4. Send email notification
            // We pass the updated order object (or the one we fetched, since we just need the data)
            // The fetched order has 'products' expanded with 'product->name', which matches what sendOrderNotification expects
            await sendOrderNotification(order)

            return { success: true, message: 'Order processed and email sent' }
        } else {
            // Handle other statuses if needed (e.g., 'pending', 'rejected')
            return { success: false, message: `Payment status is ${status}` }
        }

    } catch (error) {
        console.error('Error processing order:', error)
        return { success: false, message: 'Internal server error' }
    }
}
