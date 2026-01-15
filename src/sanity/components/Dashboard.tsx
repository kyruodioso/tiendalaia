import React, { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { Card, Grid, Text, Heading, Stack, Flex, Spinner } from '@sanity/ui'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
)

export default function Dashboard() {
    const client = useClient({ apiVersion: '2024-01-01' })
    const [data, setData] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await client.fetch(`
          *[_type == "product"] {
            name,
            price,
            costPrice,
            stock,
            status,
            "category": category->name,
            _updatedAt
          }
        `)
                const ordersData = await client.fetch(`
          *[_type == "order" && status == "paid"] | order(_createdAt asc) {
            _createdAt,
            totalAmount
          }
        `)
                setData(products)
                setOrders(ordersData)
            } catch (error) {
                console.error("Error fetching data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [client])

    if (loading) return <Flex justify="center" align="center" height="fill" padding={5}><Spinner /></Flex>

    // Process product data
    const categories: Record<string, { stock: number; profit: number }> = {}
    let totalStock = 0
    let totalProfit = 0
    
    // New metrics for sold items
    let realizedProfit = 0
    let totalSoldItems = 0
    const soldProducts: any[] = []

    data?.forEach((product: any) => {
        const cat = product.category || 'Sin Categoría'
        const stock = product.stock || 0
        const price = product.price || 0
        const cost = product.costPrice || 0
        const status = product.status || 'available'
        
        // Potential profit from available stock
        if (status === 'available') {
            const profit = (price - cost) * stock
            if (!categories[cat]) {
                categories[cat] = { stock: 0, profit: 0 }
            }
            categories[cat].stock += stock
            categories[cat].profit += profit
            totalStock += stock
            totalProfit += profit
        }

        // Realized profit from sold items
        if (status === 'sold') {
            const profit = price - cost
            realizedProfit += profit
            totalSoldItems += 1
            soldProducts.push({
                ...product,
                profit
            })
        }
    })

    // Process sales data
    const salesByMonth: Record<string, number> = {}
    orders.forEach((order: any) => {
        const date = new Date(order._createdAt)
        const monthYear = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
        
        if (!salesByMonth[monthYear]) {
            salesByMonth[monthYear] = 0
        }
        salesByMonth[monthYear] += order.totalAmount
    })

    const salesLabels = Object.keys(salesByMonth)
    const salesValues = Object.values(salesByMonth)


    const categoryLabels = Object.keys(categories)
    const stockData = categoryLabels.map(cat => categories[cat].stock)
    const profitData = categoryLabels.map(cat => categories[cat].profit)

    const chartDataStock = {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Stock por Categoría',
                data: stockData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    }

    const chartDataProfit = {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Ganancia Potencial',
                data: profitData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const chartDataSales = {
        labels: salesLabels,
        datasets: [
            {
                label: 'Ventas Mensuales ($)',
                data: salesValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    }

    return (
        <Card padding={4} tone="transparent" style={{ height: '100%', overflow: 'auto' }}>
            <Stack space={5}>
                <Heading as="h2" size={4}>Panel de Control de Inventario</Heading>

                <Grid columns={[1, 2, 4]} gap={4}>
                    <Card padding={4} shadow={1} radius={2} tone="primary">
                        <Stack space={3}>
                            <Text size={1} weight="bold">Total de Unidades en Stock</Text>
                            <Heading size={4}>{totalStock}</Heading>
                        </Stack>
                    </Card>
                    <Card padding={4} shadow={1} radius={2} tone="positive">
                        <Stack space={3}>
                            <Text size={1} weight="bold">Ganancia Potencial (Stock)</Text>
                            <Heading size={4}>${totalProfit.toLocaleString()}</Heading>
                            <Text size={1} muted>Proyectado</Text>
                        </Stack>
                    </Card>
                    <Card padding={4} shadow={1} radius={2} style={{ backgroundColor: '#e3f2fd' }}>
                        <Stack space={3}>
                            <Text size={1} weight="bold">Prendas Vendidas</Text>
                            <Heading size={4}>{totalSoldItems}</Heading>
                            <Text size={1} muted>Total histórico</Text>
                        </Stack>
                    </Card>
                    <Card padding={4} shadow={1} radius={2} style={{ backgroundColor: '#e8f5e9' }}>
                        <Stack space={3}>
                            <Text size={1} weight="bold">Ganancias Reales</Text>
                            <Heading size={4}>${realizedProfit.toLocaleString()}</Heading>
                            <Text size={1} muted>Total (Precio - Costo)</Text>
                        </Stack>
                    </Card>
                </Grid>

                {/* Sales History Chart */}
                <Card padding={4} shadow={1} radius={2}>
                    <Heading size={3} style={{ marginBottom: '1rem' }}>Histórico de Ventas</Heading>
                    <div style={{ height: '300px' }}>
                        <Line data={chartDataSales} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </Card>

                <Grid columns={[1, 1, 2]} gap={4}>
                    <Card padding={4} shadow={1} radius={2}>
                        <Heading size={3} style={{ marginBottom: '1rem' }}>Stock por Categoría</Heading>
                        <div style={{ height: '300px' }}>
                            <Bar data={chartDataStock} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </Card>
                    <Card padding={4} shadow={1} radius={2}>
                        <Heading size={3} style={{ marginBottom: '1rem' }}>Distribución de Ganancias (Potencial)</Heading>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={chartDataProfit} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </Card>
                </Grid>

                {/* Sold Items Table */}
                <Card padding={4} shadow={1} radius={2}>
                    <Heading size={3} style={{ marginBottom: '1rem' }}>Prendas Vendidas</Heading>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>Producto</th>
                                    <th style={{ padding: '10px' }}>Categoría</th>
                                    <th style={{ padding: '10px' }}>Precio Venta</th>
                                    <th style={{ padding: '10px' }}>Costo</th>
                                    <th style={{ padding: '10px' }}>Ganancia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldProducts.map((product: any, index: number) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '10px' }}>{product.name}</td>
                                        <td style={{ padding: '10px' }}>{product.category}</td>
                                        <td style={{ padding: '10px' }}>${product.price?.toLocaleString()}</td>
                                        <td style={{ padding: '10px' }}>${product.costPrice?.toLocaleString() || 0}</td>
                                        <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>+${product.profit?.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {soldProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                            No hay prendas vendidas registradas aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card padding={4} shadow={1} radius={2}>
                    <Heading size={3} style={{ marginBottom: '1rem' }}>Detalle de Stock por Categoría</Heading>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '10px' }}>Categoría</th>
                                <th style={{ padding: '10px' }}>Stock Total</th>
                                <th style={{ padding: '10px' }}>Ganancia Potencial</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryLabels.map((cat) => (
                                <tr key={cat} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '10px' }}>{cat}</td>
                                    <td style={{ padding: '10px' }}>{categories[cat].stock}</td>
                                    <td style={{ padding: '10px' }}>${categories[cat].profit.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </Stack>
        </Card>
    )
}
