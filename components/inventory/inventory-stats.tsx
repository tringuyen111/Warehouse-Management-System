"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Package, AlertTriangle, TrendingUp, Warehouse } from "lucide-react"

export function InventoryStats() {
  const { t } = useLanguage()

  const stats = [
    {
      title: "Total Items",
      value: "1,234",
      icon: <Package className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: "23",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
    },
    {
      title: "Total Value",
      value: "$125,430",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Locations",
      value: "8",
      icon: <Warehouse className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={stat.color}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
