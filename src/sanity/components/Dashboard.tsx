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
    ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

export default function Dashboard() {
    const client = useClient({ apiVersion: '2024-01-01' })
    const [data, setData] = useState<any>(null)
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
            "category": category->title
          }
        `)
                setData(products)
            } catch (error) {
                console.error("Error fetching data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [client])

    if (loading) return <Flex justify="center" align="center" height="fill" padding={5}><Spinner /></Flex>

    // Process data
    const categories: Record<string, { stock: number; profit: number }> = {}
    let totalStock = 0
    let totalProfit = 0

    data?.forEach((product: any) => {
        const cat = product.category || 'Sin Categoría'
        const stock = product.stock || 0
        const price = product.price || 0
        const cost = product.costPrice || 0
        const profit = (price - cost) * stock

        if (!categories[cat]) {
            categories[cat] = { stock: 0, profit: 0 }
        }
        categories[cat].stock += stock
        categories[cat].profit += profit
        totalStock += stock
        totalProfit += profit
    })

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

    return (
        <Card padding={4} tone="transparent" style={{ height: '100%', overflow: 'auto' }}>
            <Stack space={5}>
                <Heading as="h2" size={4}>Panel de Control de Inventario</Heading>

                <Grid columns={[1, 2, 2]} gap={4}>
                    <Card padding={4} shadow={1} radius={2} tone="primary">
                        <Stack space={3}>
                            <Text size={1} weight="bold">Total de Unidades en Stock</Text>
                            <Heading size={4}>{totalStock}</Heading>
                        </Stack>
                    </Card>
                    <Card padding={4} shadow={1} radius={2} tone="positive">
                        <Stack space={3}>
                            <Text size={1} weight="bold">Ganancia Potencial Total</Text>
                            <Heading size={4}>${totalProfit.toLocaleString()}</Heading>
                            <Text size={1} muted>Basado en stock actual * (Precio - Costo)</Text>
                        </Stack>
                    </Card>
                </Grid>

                <Grid columns={[1, 1, 2]} gap={4}>
                    <Card padding={4} shadow={1} radius={2}>
                        <Heading size={3} style={{ marginBottom: '1rem' }}>Stock por Categoría</Heading>
                        <div style={{ height: '300px' }}>
                            <Bar data={chartDataStock} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </Card>
                    <Card padding={4} shadow={1} radius={2}>
                        <Heading size={3} style={{ marginBottom: '1rem' }}>Distribución de Ganancias</Heading>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={chartDataProfit} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </Card>
                </Grid>
            </Stack>
        </Card>
    )
}
