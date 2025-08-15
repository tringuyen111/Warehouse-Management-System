"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, ArrowRight, AlertTriangle } from "lucide-react"

interface TransferItem {
  id: string
  productId: string
  productName: string
  sku: string
  availableQuantity: number
  transferQuantity: number
  location: string
}

const mockLocations = [
  { id: "warehouse-a", name: "Warehouse A", address: "123 Industrial Blvd" },
  { id: "warehouse-b", name: "Warehouse B", address: "456 Storage Ave" },
  { id: "store-front", name: "Store Front", address: "789 Main St" },
  { id: "online-fulfillment", name: "Online Fulfillment", address: "321 Distribution Way" },
]

const mockInventoryByLocation = {
  "warehouse-a": [
    { id: "1", name: "Wireless Headphones", sku: "ABC-001", availableQuantity: 150 },
    { id: "2", name: "Cotton T-Shirt", sku: "DEF-002", availableQuantity: 75 },
    { id: "4", name: "Notebook Set", sku: "JKL-004", availableQuantity: 200 },
  ],
  "warehouse-b": [
    { id: "1", name: "Wireless Headphones", sku: "ABC-001", availableQuantity: 50 },
    { id: "3", name: "Office Chair", sku: "GHI-003", availableQuantity: 25 },
  ],
  "store-front": [
    { id: "2", name: "Cotton T-Shirt", sku: "DEF-002", availableQuantity: 30 },
    { id: "3", name: "Office Chair", sku: "GHI-003", availableQuantity: 10 },
  ],
}

export function CreateTransferOrderForm() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [priority, setPriority] = useState("medium")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<TransferItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")

  const availableProducts = fromLocation
    ? mockInventoryByLocation[fromLocation as keyof typeof mockInventoryByLocation] || []
    : []

  const addItem = () => {
    const product = availableProducts.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = items.find((item) => item.productId === product.id)
    if (existingItem) return // Don't add duplicate items

    const newItem: TransferItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      availableQuantity: product.availableQuantity,
      transferQuantity: 1,
      location: fromLocation,
    }

    setItems([...items, newItem])
    setSelectedProduct("")
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, transferQuantity: Math.max(1, quantity) } : item)))
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleFromLocationChange = (location: string) => {
    setFromLocation(location)
    setItems([]) // Clear items when changing from location
    setSelectedProduct("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating transfer order:", {
      fromLocation,
      toLocation,
      priority,
      estimatedDelivery,
      reason,
      notes,
      items,
    })
  }

  const canSubmit =
    fromLocation && toLocation && fromLocation !== toLocation && items.length > 0 && reason && estimatedDelivery

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transfer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-location">From Location *</Label>
              <Select value={fromLocation} onValueChange={handleFromLocationChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-location">To Location *</Label>
              <Select value={toLocation} onValueChange={setToLocation} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations
                    .filter((location) => location.id !== fromLocation)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-muted-foreground">{location.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {fromLocation && toLocation && (
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-medium">{mockLocations.find((l) => l.id === fromLocation)?.name}</div>
                  <div className="text-xs text-muted-foreground">Source</div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="font-medium">{mockLocations.find((l) => l.id === toLocation)?.name}</div>
                  <div className="text-xs text-muted-foreground">Destination</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-delivery">Estimated Delivery *</Label>
              <Input
                id="estimated-delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Transfer *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock-rebalancing">Stock Rebalancing</SelectItem>
                <SelectItem value="customer-demand">Customer Demand</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="seasonal-adjustment">Seasonal Adjustment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      {fromLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts
                      .filter((product) => !items.some((item) => item.productId === product.id))
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{product.name}</span>
                            <div className="flex items-center gap-2 ml-2">
                              <Badge variant="outline">{product.sku}</Badge>
                              <Badge variant="secondary" className="text-xs">
                                {product.availableQuantity} available
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={addItem} disabled={!selectedProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Table */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Transfer Qty</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="text-right">{item.availableQuantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.transferQuantity}
                            onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                            className="w-20 text-right"
                            min="1"
                            max={item.availableQuantity}
                          />
                          {item.transferQuantity > item.availableQuantity && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Items: {items.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Quantity: {items.reduce((sum, item) => sum + item.transferQuantity, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          Create Transfer Order
        </Button>
      </div>
    </form>
  )
}
