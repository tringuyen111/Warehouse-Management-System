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
import { Plus, Trash2, AlertTriangle } from "lucide-react"

interface IssueItem {
  id: string
  productId: string
  productName: string
  sku: string
  availableQuantity: number
  requestedQuantity: number
  unitPrice: number
  totalPrice: number
}

const mockInventory = [
  { id: "1", name: "Wireless Headphones", sku: "ABC-001", availableQuantity: 150, unitPrice: 99.99 },
  { id: "2", name: "Cotton T-Shirt", sku: "DEF-002", availableQuantity: 15, unitPrice: 19.99 },
  { id: "3", name: "Office Chair", sku: "GHI-003", availableQuantity: 0, unitPrice: 299.99 },
  { id: "4", name: "Notebook Set", sku: "JKL-004", availableQuantity: 200, unitPrice: 12.99 },
]

export function CreateGoodsIssueForm() {
  const [department, setDepartment] = useState("")
  const [requestedBy, setRequestedBy] = useState("")
  const [purpose, setPurpose] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<IssueItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")

  const addItem = () => {
    const product = mockInventory.find((p) => p.id === selectedProduct)
    if (!product || product.availableQuantity === 0) return

    const newItem: IssueItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      availableQuantity: product.availableQuantity,
      requestedQuantity: 1,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice,
    }

    setItems([...items, newItem])
    setSelectedProduct("")
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              requestedQuantity: quantity,
              totalPrice: quantity * item.unitPrice,
            }
          : item,
      ),
    )
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating goods issue:", { department, requestedBy, purpose, notes, items, totalValue })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="it">IT Department</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requested-by">Requested By *</Label>
              <Input
                id="requested-by"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Employee name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Select value={purpose} onValueChange={setPurpose} required>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production Use</SelectItem>
                <SelectItem value="office">Office Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="project">Project Requirements</SelectItem>
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
      <Card>
        <CardHeader>
          <CardTitle>Add Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product to issue" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventory.map((product) => (
                    <SelectItem key={product.id} value={product.id} disabled={product.availableQuantity === 0}>
                      <div className="flex items-center justify-between w-full">
                        <span className={product.availableQuantity === 0 ? "text-muted-foreground" : ""}>
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="outline">{product.sku}</Badge>
                          <Badge
                            variant={product.availableQuantity === 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
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

      {/* Items Table */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issue Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Requested</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
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
                            value={item.requestedQuantity}
                            onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                            className="w-20 text-right"
                            min="1"
                            max={item.availableQuantity}
                          />
                          {item.requestedQuantity > item.availableQuantity && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">${item.totalPrice.toFixed(2)}</TableCell>
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
                <div className="text-lg font-bold">Total Value: ${totalValue.toFixed(2)}</div>
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
        <Button type="submit" disabled={items.length === 0 || !department || !requestedBy || !purpose}>
          Create Issue Request
        </Button>
      </div>
    </form>
  )
}
