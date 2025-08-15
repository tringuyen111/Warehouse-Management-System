"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, UserCheck, UserX } from "lucide-react"

export function UsersStats() {
  const stats = [
    {
      title: "Total Users",
      value: "24",
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Administrators",
      value: "3",
      icon: <Shield className="h-4 w-4" />,
      color: "text-purple-600",
    },
    {
      title: "Active Users",
      value: "22",
      icon: <UserCheck className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Inactive Users",
      value: "2",
      icon: <UserX className="h-4 w-4" />,
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
