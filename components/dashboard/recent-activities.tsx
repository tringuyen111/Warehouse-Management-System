"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, AlertTriangle, Package, User } from "lucide-react"

interface Activity {
  id: string
  type: "goods-receipt" | "goods-issue" | "transfer" | "alert" | "inventory" | "user"
  title: string
  description: string
  time: string
  severity: "success" | "warning" | "error" | "info"
}

const activities: Activity[] = [
  {
    id: "1",
    type: "goods-receipt",
    title: "New goods receipt #GR-001",
    description: "150 units of Product ABC received from Supplier XYZ",
    time: "2 hours ago",
    severity: "success",
  },
  {
    id: "2",
    type: "transfer",
    title: "Transfer order #TO-045 completed",
    description: "50 units moved from Warehouse A to Warehouse B",
    time: "4 hours ago",
    severity: "success",
  },
  {
    id: "3",
    type: "alert",
    title: "Low stock alert",
    description: "Product ABC-123 is below minimum stock level",
    time: "6 hours ago",
    severity: "warning",
  },
  {
    id: "4",
    type: "goods-issue",
    title: "Goods issue #GI-089 approved",
    description: "75 units issued to Production Department",
    time: "8 hours ago",
    severity: "success",
  },
  {
    id: "5",
    type: "user",
    title: "New user registered",
    description: "John Doe added as Warehouse Operator",
    time: "1 day ago",
    severity: "info",
  },
]

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "goods-receipt":
      return <ArrowDownToLine className="h-4 w-4" />
    case "goods-issue":
      return <ArrowUpFromLine className="h-4 w-4" />
    case "transfer":
      return <ArrowRightLeft className="h-4 w-4" />
    case "alert":
      return <AlertTriangle className="h-4 w-4" />
    case "inventory":
      return <Package className="h-4 w-4" />
    case "user":
      return <User className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

function getSeverityColor(severity: Activity["severity"]) {
  switch (severity) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function RecentActivities() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.recent-activities")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
              <div className="flex-shrink-0 p-2 rounded-full bg-muted">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <Badge className={getSeverityColor(activity.severity)}>{activity.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
