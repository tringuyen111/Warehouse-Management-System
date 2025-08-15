"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownToLine, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function GoodsReceiptStats() {
  const stats = [
    {
      title: "Total Receipts",
      value: "156",
      icon: <ArrowDownToLine className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: "12",
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: "134",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: "10",
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-600",
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
