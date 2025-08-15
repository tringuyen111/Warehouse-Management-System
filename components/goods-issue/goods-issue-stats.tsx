"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpFromLine, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function GoodsIssueStats() {
  const stats = [
    {
      title: "Total Issues",
      value: "89",
      icon: <ArrowUpFromLine className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: "8",
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: "76",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: "5",
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
