"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { TrendingUp, TrendingDown, Package, AlertTriangle, ShoppingCart, DollarSign } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

function StatCard({ title, value, change, icon, trend = "neutral" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
            <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}>
              {change > 0 ? "+" : ""}
              {change}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title={t("dashboard.total-products")}
        value="1,234"
        change={12}
        trend="up"
        icon={<Package className="h-4 w-4" />}
      />
      <StatCard
        title={t("dashboard.low-stock")}
        value="23"
        change={-8}
        trend="down"
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      <StatCard
        title={t("dashboard.pending-orders")}
        value="45"
        change={5}
        trend="up"
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <StatCard title="Total Value" value="$125,430" change={18} trend="up" icon={<DollarSign className="h-4 w-4" />} />
    </div>
  )
}
