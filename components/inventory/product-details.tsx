"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Edit, Package, MapPin, DollarSign, Calendar, AlertTriangle } from "lucide-react"

interface ProductDetailsProps {
  productId: string
}

// Mock data - in real app this would come from API
const mockProduct = {
  id: "1",
  sku: "ABC-001",
  name: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
  category: "Electronics",
  brand: "TechBrand",
  quantity: 150,
  minStock: 20,
  maxStock: 500,
  location: "Warehouse A - Section B2",
  unitPrice: 99.99,
  totalValue: 14998.5,
  status: "in-stock" as const,
  supplier: "Electronics Supplier Co.",
  lastRestocked: "2024-01-10",
  createdAt: "2023-06-15",
  updatedAt: "2024-01-15",
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const product = mockProduct // In real app, fetch by productId

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">In Stock</Badge>
      case "low-stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Low Stock</Badge>
        )
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Out of Stock</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <p className="text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(product.status)}
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm">{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Brand:</span>
                <span className="text-sm">{product.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Supplier:</span>
                <span className="text-sm">{product.supplier}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{product.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Restocked:</span>
                <span className="text-sm">{product.lastRestocked}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stock Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stock Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{product.quantity}</div>
              <div className="text-sm text-muted-foreground">Current Stock</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{product.minStock}</div>
              <div className="text-sm text-muted-foreground">Minimum Stock</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{product.maxStock}</div>
              <div className="text-sm text-muted-foreground">Maximum Stock</div>
            </div>
          </div>

          {product.quantity <= product.minStock && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Stock level is below minimum threshold. Consider restocking.
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Financial Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Unit Price</span>
              </div>
              <div className="text-2xl font-bold text-foreground">${product.unitPrice.toFixed(2)}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Value</span>
              </div>
              <div className="text-2xl font-bold text-green-600">${product.totalValue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
