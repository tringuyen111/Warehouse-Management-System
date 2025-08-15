"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, MapPin, Calendar, User, FileText } from "lucide-react"

interface TransferOrderDetailsProps {
  transferId: string
}

// Mock data - in real app this would come from API
const mockTransfer = {
  id: "1",
  transferNumber: "TO-001",
  fromLocation: {
    id: "warehouse-a",
    name: "Warehouse A",
    address: "123 Industrial Blvd",
  },
  toLocation: {
    id: "warehouse-b",
    name: "Warehouse B",
    address: "456 Storage Ave",
  },
  status: "pending" as const,
  priority: "high" as const,
  reason: "Stock Rebalancing",
  notes: "Urgent transfer needed to fulfill customer orders at Warehouse B location.",
  createdAt: "2024-01-15",
  createdBy: "John Doe",
  estimatedDelivery: "2024-01-17",
  items: [
    {
      id: "1",
      productName: "Wireless Headphones",
      sku: "ABC-001",
      transferQuantity: 50,
      availableQuantity: 150,
    },
    {
      id: "2",
      productName: "Cotton T-Shirt",
      sku: "DEF-002",
      transferQuantity: 25,
      availableQuantity: 75,
    },
    {
      id: "3",
      productName: "Notebook Set",
      sku: "JKL-004",
      transferQuantity: 100,
      availableQuantity: 200,
    },
  ],
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    case "approved":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Approved</Badge>
    case "in-transit":
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">In Transit</Badge>
    case "completed":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High Priority</Badge>
    case "medium":
      return <Badge variant="secondary">Medium Priority</Badge>
    case "low":
      return <Badge variant="outline">Low Priority</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

export function TransferOrderDetails({ transferId }: TransferOrderDetailsProps) {
  const transfer = mockTransfer // In real app, fetch by transferId

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{transfer.transferNumber}</CardTitle>
            <p className="text-muted-foreground mt-1">Transfer Order Details</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(transfer.status)}
            {getPriorityBadge(transfer.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Route Information</h3>
          <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.fromLocation.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{transfer.fromLocation.address}</p>
                <p className="text-xs text-muted-foreground mt-1">Source Location</p>
              </div>
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.toLocation.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{transfer.toLocation.address}</p>
                <p className="text-xs text-muted-foreground mt-1">Destination Location</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Transfer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Transfer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reason:</span>
                <span className="text-sm">{transfer.reason}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created By:</span>
                <span className="text-sm">{transfer.createdBy}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{transfer.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Est. Delivery:</span>
                <span className="text-sm">{transfer.estimatedDelivery}</span>
              </div>
            </div>
          </div>
          {transfer.notes && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Notes:</p>
              <p className="text-sm text-muted-foreground">{transfer.notes}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Transfer Items</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Transfer Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="text-right">{item.availableQuantity}</TableCell>
                    <TableCell className="text-right font-medium">{item.transferQuantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Items: {transfer.items.length}</div>
              <div className="text-sm font-medium">
                Total Quantity: {transfer.items.reduce((sum, item) => sum + item.transferQuantity, 0)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
