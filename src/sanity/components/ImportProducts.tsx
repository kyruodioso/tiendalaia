import React, { useState } from 'react'
import { useClient } from 'sanity'
import Papa from 'papaparse'
import { Card, Stack, Heading, Text, Button, Flex, Box, Label, ToastProvider, useToast } from '@sanity/ui'
import { nanoid } from 'nanoid'

export default function ImportProducts() {
    const client = useClient({ apiVersion: '2024-01-01' })
    const [isUploading, setIsUploading] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const toast = useToast()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setLogs([])

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const products = results.data
                await processProducts(products)
                setIsUploading(false)
            },
            error: (error) => {
                console.error('Error parsing CSV:', error)
                toast.push({ status: 'error', title: 'Error al leer el archivo CSV' })
                setIsUploading(false)
            }
        })
    }

    const processProducts = async (products: any[]) => {
        let successCount = 0
        let errorCount = 0

        for (const product of products) {
            // Basic validation: Skip empty rows or rows without essential data
            if (!product.name || product.name.trim() === '' || !product.price) {
                continue
            }

            try {
                // 1. Handle Category
                let categoryId = null
                if (product.category) {
                    // Try to find existing category
                    const existingCategory = await client.fetch(
                        `*[_type == "category" && title == $title][0]._id`,
                        { title: product.category }
                    )

                    if (existingCategory) {
                        categoryId = existingCategory
                    } else {
                        // Create new category
                        const newCategory = await client.create({
                            _type: 'category',
                            title: product.category,
                            slug: { _type: 'slug', current: product.category.toLowerCase().replace(/\s+/g, '-') }
                        })
                        categoryId = newCategory._id
                        setLogs(prev => [...prev, `Categoría creada: ${product.category}`])
                    }
                }

                // 2. Create Product
                const doc: any = {
                    _type: 'product',
                    name: product.name,
                    code: product.code || nanoid(8),
                    slug: { _type: 'slug', current: product.slug || product.name.toLowerCase().replace(/\s+/g, '-') + '-' + nanoid(4) },
                    price: parseFloat(product.price),
                    costPrice: product.costPrice ? parseFloat(product.costPrice) : 0,
                    stock: product.stock ? parseInt(product.stock) : 0,
                    status: 'available',
                    description: product.description ? [
                        {
                            _key: nanoid(),
                            _type: 'block',
                            children: [{ _key: nanoid(), _type: 'span', text: product.description }],
                            markDefs: [],
                            style: 'normal'
                        }
                    ] : []
                }

                if (categoryId) {
                    doc.category = {
                        _type: 'reference',
                        _ref: categoryId
                    }
                }

                if (product.size) {
                    doc.sizes = product.size.toString().split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
                }

                await client.create(doc)
                successCount++
                setLogs(prev => [...prev, `✅ Producto importado: ${product.name} (Code: ${doc.code})`])

            } catch (err) {
                console.error('Error creating product:', err)
                errorCount++
                setLogs(prev => [...prev, `❌ Error importando ${product.name}`])
            }
        }

        toast.push({
            status: successCount > 0 ? 'success' : 'error',
            title: `Importación completada: ${successCount} éxitos, ${errorCount} errores`
        })
    }

    return (
        <Card padding={4} tone="transparent" style={{ height: '100%', overflow: 'auto' }}>
            <Stack space={5}>
                <Heading as="h2" size={4}>Importación Masiva de Productos</Heading>

                <Card padding={4} shadow={1} radius={2}>
                    <Stack space={4}>
                        <Text>Sube un archivo CSV con las siguientes columnas (la primera fila debe ser el encabezado):</Text>
                        <Box padding={3} style={{ background: '#f4f4f4', borderRadius: '4px' }}>
                            <Text size={1} style={{ fontFamily: 'monospace' }}>name, code, price, costPrice, stock, category, description, size</Text>
                        </Box>

                        <Label>Seleccionar archivo CSV</Label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />

                        {isUploading && <Text>Procesando... por favor espera.</Text>}
                    </Stack>
                </Card>

                {logs.length > 0 && (
                    <Card padding={4} shadow={1} radius={2} tone="default">
                        <Heading size={3} style={{ marginBottom: '1rem' }}>Log de Importación</Heading>
                        <Stack space={2}>
                            {logs.map((log, i) => (
                                <Text key={i} size={1} muted>{log}</Text>
                            ))}
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Card>
    )
}
