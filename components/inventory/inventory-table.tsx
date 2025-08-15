"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { MoreHorizontal, Edit, Eye, AlertTriangle, Package } from "lucide-react"
import Link from "next/link"

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  minStock: number
  location: string
  unitPrice: number
  totalValue: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  lastUpdated: string
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "ABC-001",
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 150,
    minStock: 20,
    location: "Warehouse A",
    unitPrice: 99.99,
    totalValue: 14998.5,
    status: "in-stock",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    sku: "DEF-002",
    name: "Cotton T-Shirt",
    category: "Clothing",
    quantity: 15,
    minStock: 50,
    location: "Warehouse B",
    unitPrice: 19.99,
    totalValue: 299.85,
    status: "low-stock",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    sku: "GHI-003",
    name: "Office Chair",
    category: "Furniture",
    quantity: 0,
    minStock: 5,
    location: "Store Front",
    unitPrice: 299.99,
    totalValue: 0,
    status: "out-of-stock",
    lastUpdated: "2024-01-13",
  },
  {
    id: "4",
    sku: "JKL-004",
    name: "Notebook Set",
    category: "Stationery",
    quantity: 200,
    minStock: 30,
    location: "Warehouse A",
    unitPrice: 12.99,
    totalValue: 2598,
    status: "in-stock",
    lastUpdated: "2024-01-15",
  },
  {
    id: "5",
    sku: "MNO-005",
    name: "Bluetooth Speaker",
    category: "Electronics",
    quantity: 8,
    minStock: 15,
    location: "Online",
    unitPrice: 79.99,
    totalValue: 639.92,
    status: "low-stock",
    lastUpdated: "2024-01-12",
  },
]

function getStatusBadge(status: InventoryItem["status"]) {
  switch (status) {
    case "in-stock":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">In Stock</Badge>
    case "low-stock":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Low Stock</Badge>
    case "out-of-stock":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Out of Stock</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

function getStatusIcon(status: InventoryItem["status"]) {
  switch (status) {
    case "in-stock":
      return <Package className="h-4 w-4 text-green-600" />
    case "low-stock":
    case "out-of-stock":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export function InventoryTable() {
  const { t } = useLanguage()
  const [sortField, setSortField] = useState<keyof InventoryItem>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const sortedInventory = [...mockInventory].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("sku")}>
                  SKU
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                  Product Name
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("category")}>
                  Category
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("location")}>
                  Location
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("unitPrice")}
                >
                  Unit Price
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("totalValue")}
                >
                  Total Value
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>{getStatusIcon(item.status)}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-xs text-muted-foreground">Min: {item.minStock}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${item.totalValue.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/${item.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/${item.id}/edit`}>
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
