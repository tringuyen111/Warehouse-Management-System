"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, Package, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const { t } = useLanguage()

  const actions = [
    {
      title: "New Goods Receipt",
      description: "Record incoming inventory",
      icon: <ArrowDownToLine className="h-5 w-5" />,
      href: "/goods-receipt/new",
      color: "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      title: "New Goods Issue",
      description: "Issue items from inventory",
      icon: <ArrowUpFromLine className="h-5 w-5" />,
      href: "/goods-issue/new",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      title: "Create Transfer",
      description: "Transfer between locations",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      href: "/transfer/new",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      title: "Add Product",
      description: "Register new product",
      icon: <Package className="h-5 w-5" />,
      href: "/products/new",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      title: "Inventory Check",
      description: "Perform stock count",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/inventory/check",
      color: "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-start space-y-2 w-full ${action.color}`}
              >
                <div className="flex items-center space-x-2">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs opacity-70">{action.description}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
