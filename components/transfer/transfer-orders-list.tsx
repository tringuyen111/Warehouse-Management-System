"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Check, Truck, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

interface TransferOrder {
  id: string
  transferNumber: string
  fromLocation: string
  toLocation: string
  totalItems: number
  status: "pending" | "approved" | "in-transit" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  createdAt: string
  createdBy: string
  estimatedDelivery?: string
}

const mockTransfers: TransferOrder[] = [
  {
    id: "1",
    transferNumber: "TO-001",
    fromLocation: "Warehouse A",
    toLocation: "Warehouse B",
    totalItems: 3,
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15",
    createdBy: "John Doe",
    estimatedDelivery: "2024-01-17",
  },
  {
    id: "2",
    transferNumber: "TO-002",
    fromLocation: "Store Front",
    toLocation: "Warehouse A",
    totalItems: 2,
    status: "in-transit",
    priority: "medium",
    createdAt: "2024-01-14",
    createdBy: "Jane Smith",
    estimatedDelivery: "2024-01-16",
  },
  {
    id: "3",
    transferNumber: "TO-003",
    fromLocation: "Warehouse B",
    toLocation: "Online Fulfillment",
    totalItems: 5,
    status: "completed",
    priority: "low",
    createdAt: "2024-01-13",
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    transferNumber: "TO-004",
    fromLocation: "Warehouse A",
    toLocation: "Store Front",
    totalItems: 1,
    status: "approved",
    priority: "medium",
    createdAt: "2024-01-12",
    createdBy: "Sarah Wilson",
    estimatedDelivery: "2024-01-15",
  },
]

function getStatusBadge(status: TransferOrder["status"]) {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    case "approved":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Approved</Badge>
    case "in-transit":
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">In Transit</Badge>
    case "completed":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

function getPriorityBadge(priority: TransferOrder["priority"]) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge variant="secondary">Medium</Badge>
    case "low":
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

export function TransferOrdersList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transfer Orders</CardTitle>
          <Button asChild>
            <Link href="/transfer/new">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer #</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransfers.map((transfer) => (
                <TableRow key={transfer.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{transfer.transferNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{transfer.fromLocation}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{transfer.toLocation}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{transfer.totalItems}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell>{getPriorityBadge(transfer.priority)}</TableCell>
                  <TableCell>{transfer.createdBy}</TableCell>
                  <TableCell>{transfer.createdAt}</TableCell>
                  <TableCell>{transfer.estimatedDelivery || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/transfer/${transfer.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {transfer.status === "pending" && (
                          <DropdownMenuItem>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {transfer.status === "approved" && (
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Start Transit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/transfer/${transfer.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
