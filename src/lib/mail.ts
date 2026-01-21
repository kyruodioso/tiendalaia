import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOrderNotification = async (order: any) => {
    const { orderNumber, customerName, customerEmail, customerPhone, shippingAddress, products, totalAmount, shippingMethod } = order

    const productList = products.map((item: any) => {
        return `<li>${item.product?.name || 'Producto'} (Talle: ${item.size}) x ${item.quantity} - $${item.price}</li>`
    }).join('')

    const addressString = shippingMethod === 'shipping'
        ? `<p><strong>Dirección de Envío:</strong> ${shippingAddress.street} ${shippingAddress.number}, ${shippingAddress.city}, ${shippingAddress.province} (CP: ${shippingAddress.zipCode})</p>`
        : '<p><strong>Método de Entrega:</strong> Retiro en punto de encuentro</p>'

    try {
        const data = await resend.emails.send({
            from: 'Tienda Laia <onboarding@resend.dev>', // Usamos el dominio de prueba de Resend
            to: ['contacto.laia23@gmail.com'], // Solo se puede enviar al email registrado en el plan gratuito sin dominio
            subject: `Nueva Compra Recibida - Orden #${orderNumber}`,
            html: `
        <h1>¡Nueva Compra Realizada!</h1>
        <p>Se ha registrado una nueva compra en la tienda.</p>
        
        <h2>Datos del Comprador</h2>
        <p><strong>Nombre:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Teléfono:</strong> ${customerPhone}</p>
        ${addressString}

        <h2>Detalle del Pedido</h2>
        <ul>
          ${productList}
        </ul>
        
        <p><strong>Total:</strong> $${totalAmount}</p>
        
        <p>Revisa el panel de administración para más detalles.</p>
      `,
        })

        console.log('Email de notificación enviado correctamente:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Error enviando email:', error)
        return { success: false, error }
    }
}
