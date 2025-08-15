"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, RotateCcw, Package, ArrowUpFromLine, ArrowDownToLine } from "lucide-react"

interface StockHistoryProps {
  productId: string
}

interface StockTransaction {
  id: string
  type: "adjustment" | "receipt" | "issue" | "transfer"
  action: "increase" | "decrease" | "set"
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason: string
  user: string
  timestamp: string
  reference?: string
}

const mockHistory: StockTransaction[] = [
  {
    id: "1",
    type: "receipt",
    action: "increase",
    quantity: 50,
    previousQuantity: 100,
    newQuantity: 150,
    reason: "Goods Receipt",
    user: "John Doe",
    timestamp: "2024-01-15 10:30",
    reference: "GR-001",
  },
  {
    id: "2",
    type: "issue",
    action: "decrease",
    quantity: 25,
    previousQuantity: 150,
    newQuantity: 125,
    reason: "Goods Issue",
    user: "Jane Smith",
    timestamp: "2024-01-14 14:20",
    reference: "GI-045",
  },
  {
    id: "3",
    type: "adjustment",
    action: "increase",
    quantity: 5,
    previousQuantity: 120,
    newQuantity: 125,
    reason: "Found Items",
    user: "Mike Johnson",
    timestamp: "2024-01-13 09:15",
  },
  {
    id: "4",
    type: "transfer",
    action: "decrease",
    quantity: 30,
    previousQuantity: 150,
    newQuantity: 120,
    reason: "Transfer Out",
    user: "Sarah Wilson",
    timestamp: "2024-01-12 16:45",
    reference: "TO-023",
  },
]

function getTransactionIcon(type: StockTransaction["type"], action: StockTransaction["action"]) {
  switch (type) {
    case "receipt":
      return <ArrowDownToLine className="h-4 w-4 text-green-600" />
    case "issue":
      return <ArrowUpFromLine className="h-4 w-4 text-red-600" />
    case "transfer":
      return <Package className="h-4 w-4 text-blue-600" />
    case "adjustment":
      return action === "increase" ? (
        <Plus className="h-4 w-4 text-green-600" />
      ) : action === "decrease" ? (
        <Minus className="h-4 w-4 text-red-600" />
      ) : (
        <RotateCcw className="h-4 w-4 text-blue-600" />
      )
    default:
      return <Package className="h-4 w-4" />
  }
}

function getQuantityBadge(action: StockTransaction["action"], quantity: number) {
  switch (action) {
    case "increase":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">+{quantity}</Badge>
    case "decrease":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">-{quantity}</Badge>
    case "set":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">={quantity}</Badge>
    default:
      return <Badge>{quantity}</Badge>
  }
}

export function StockHistory({ productId }: StockHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {mockHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                  {getTransactionIcon(transaction.type, transaction.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{transaction.reason}</p>
                    {getQuantityBadge(transaction.action, transaction.quantity)}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {transaction.previousQuantity} → {transaction.newQuantity}
                    </p>
                    {transaction.reference && (
                      <p className="text-xs text-muted-foreground font-mono">{transaction.reference}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{transaction.user}</p>
                    <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
