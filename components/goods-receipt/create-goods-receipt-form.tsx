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
import { Plus, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ReceiptItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

const mockProducts = [
  { id: "1", name: "Wireless Headphones", sku: "ABC-001", unitPrice: 99.99 },
  { id: "2", name: "Cotton T-Shirt", sku: "DEF-002", unitPrice: 19.99 },
  { id: "3", name: "Office Chair", sku: "GHI-003", unitPrice: 299.99 },
  { id: "4", name: "Notebook Set", sku: "JKL-004", unitPrice: 12.99 },
]

export function CreateGoodsReceiptForm() {
  const { t } = useLanguage()
  const [supplier, setSupplier] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<ReceiptItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")

  const addItem = () => {
    const product = mockProducts.find((p) => p.id === selectedProduct)
    if (!product) return

    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: 1,
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
              quantity,
              totalPrice: quantity * item.unitPrice,
            }
          : item,
      ),
    )
  }

  const updateItemPrice = (itemId: string, unitPrice: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              unitPrice,
              totalPrice: item.quantity * unitPrice,
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
    console.log("Creating goods receipt:", { supplier, referenceNumber, notes, items, totalValue })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("goodsReceipt.receiptInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">{t("goodsReceipt.supplier")} *</Label>
              <Select value={supplier} onValueChange={setSupplier} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("goodsReceipt.selectSupplier")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics-supplier">Electronics Supplier Co.</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies Ltd.</SelectItem>
                  <SelectItem value="furniture-world">Furniture World</SelectItem>
                  <SelectItem value="tech-components">Tech Components Inc.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">{t("goodsReceipt.referenceNumber")}</Label>
              <Input
                id="reference"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="PO-12345"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t("common.notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("goodsReceipt.additionalNotes")}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t("goodsReceipt.addItems")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder={t("goodsReceipt.selectProductToAdd")} />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{product.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {product.sku}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addItem} disabled={!selectedProduct}>
              <Plus className="h-4 w-4 mr-2" />
              {t("goodsReceipt.addItem")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("goodsReceipt.receiptItems")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("inventory.product")}</TableHead>
                    <TableHead>{t("inventory.sku")}</TableHead>
                    <TableHead className="text-right">{t("inventory.quantity")}</TableHead>
                    <TableHead className="text-right">{t("goodsReceipt.unitPrice")}</TableHead>
                    <TableHead className="text-right">{t("common.total")}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                          className="w-20 text-right"
                          min="1"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                          className="w-24 text-right"
                          step="0.01"
                          min="0"
                        />
                      </TableCell>
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
                <div className="text-sm text-muted-foreground">
                  {t("goodsReceipt.totalItems")}: {items.length}
                </div>
                <div className="text-lg font-bold">
                  {t("goodsReceipt.totalValue")}: ${totalValue.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          {t("goodsReceipt.saveAsDraft")}
        </Button>
        <Button type="submit" disabled={items.length === 0 || !supplier}>
          {t("goodsReceipt.createReceipt")}
        </Button>
      </div>
    </form>
  )
}
