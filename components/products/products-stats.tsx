"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsAPI } from "@/lib/api/products"
import { Package, AlertTriangle, TrendingUp, Archive } from "lucide-react"

interface ProductStats {
  total: number
  active: number
  inactive: number
  lowStock: number
}

export function ProductsStats() {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const productsAPI = new ProductsAPI()
        const [allProducts, activeProducts, inactiveProducts] = await Promise.all([
          productsAPI.getProducts({ limit: 1000 }),
          productsAPI.getProducts({ is_active: true, limit: 1000 }),
          productsAPI.getProducts({ is_active: false, limit: 1000 }),
        ])

        setStats({
          total: allProducts.length,
          active: activeProducts.length,
          inactive: inactiveProducts.length,
          lowStock: 0, // This would need inventory integration
        })
      } catch (error) {
        console.error("Failed to fetch product stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Tổng Sản phẩm",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đang Hoạt động",
      value: stats.active,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ngừng Hoạt động",
      value: stats.inactive,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Sắp Hết hàng",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang tải...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
