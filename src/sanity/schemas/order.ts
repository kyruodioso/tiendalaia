export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'shippingMethod',
      title: 'Shipping Method',
      type: 'string',
      options: {
        list: [
          { title: 'Shipping', value: 'shipping' },
          { title: 'Pickup', value: 'pickup' },
        ],
      },
    },
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number (Vía Cargo)',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'customerDNI',
      title: 'Customer DNI',
      type: 'string',
    },
    {
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
    },
    {
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'street', title: 'Street', type: 'string' },
        { name: 'number', title: 'Number', type: 'string' },
        { name: 'floor', title: 'Floor', type: 'string' },
        { name: 'apartment', title: 'Apartment', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'province', title: 'Province', type: 'string' },
        { name: 'zipCode', title: 'Zip Code', type: 'string' },
      ],
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'size', title: 'Size', type: 'string' },
            { name: 'price', title: 'Price', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'shippingCost',
      title: 'Shipping Cost',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'mpPreferenceId',
      title: 'Mercado Pago Preference ID',
      type: 'string',
    },
  ],
}
