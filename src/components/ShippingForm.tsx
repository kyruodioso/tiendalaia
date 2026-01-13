'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCartStore } from '@/store/cart'
import { useEffect } from 'react'

const shippingSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  dni: z.string().min(7, 'Valid DNI is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  province: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  apartment: z.string().optional(),
  zipCode: z.string().optional(),
})

export type ShippingFormData = z.infer<typeof shippingSchema>

export default function ShippingForm({ shippingMethod }: { shippingMethod: 'shipping' | 'pickup' }) {
  const { setCustomerData, customerData, setShippingZip } = useCartStore()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: customerData || {},
  })

  // Watch Zip Code to update shipping cost automatically if needed
  const zipCode = watch('zipCode')

  useEffect(() => {
    if (shippingMethod === 'shipping' && zipCode && zipCode.length >= 4) {
      setShippingZip(zipCode)
    }
  }, [zipCode, setShippingZip, shippingMethod])

  const onSubmit = (data: ShippingFormData) => {
    setCustomerData(data)
  }

  return (
    <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-900">Nombre Completo</label>
        <input
          {...register('fullName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">El nombre completo es requerido</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900">DNI</label>
          <input
            {...register('dni')}
            type="tel"
            inputMode="numeric"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
          />
          {errors.dni && <p className="text-red-500 text-xs mt-1">DNI válido requerido</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900">Teléfono</label>
          <input
            {...register('phone')}
            type="tel"
            inputMode="numeric"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">Teléfono válido requerido</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">Email válido requerido</p>}
      </div>

      {shippingMethod === 'shipping' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900">Provincia</label>
              <input
                {...register('province')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
              />
              {errors.province && <p className="text-red-500 text-xs mt-1">Provincia requerida</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900">Ciudad</label>
              <input
                {...register('city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">Ciudad requerida</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900">Dirección</label>
            <input
              {...register('address')}
              placeholder="Calle y Número"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">Dirección requerida</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900">Depto/Piso (Opcional)</label>
              <input
                {...register('apartment')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900">Código Postal</label>
              <input
                {...register('zipCode')}
                inputMode="numeric"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500"
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">Código Postal requerido</p>}
            </div>
          </div>
        </>
      )}
    </form>
  )
}
