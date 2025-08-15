"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductsAPI, type CreateProductData } from "@/lib/api/products"
import type { Supplier } from "@/lib/api/suppliers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateProductFormProps {
  suppliers: Supplier[]
}

export function CreateProductForm({ suppliers }: CreateProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateProductData>({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    unit_id: "",
    barcode: "",
    unit_price: 0,
    cost_price: 0,
    min_stock_level: 0,
    max_stock_level: 0,
    reorder_point: 0,
    weight: 0,
    is_serialized: false,
    is_batch_tracked: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productsAPI = new ProductsAPI()
      const product = await productsAPI.createProduct(formData)

      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công",
      })

      router.push(`/products/${product.id}`)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateProductData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Nhập mã SKU"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Mã vạch</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
                placeholder="Nhập mã vạch"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên Sản phẩm *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả sản phẩm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="office">Văn phòng phẩm</SelectItem>
                  <SelectItem value="furniture">Nội thất</SelectItem>
                  <SelectItem value="safety">Thiết bị an toàn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Đơn vị tính</Label>
              <Select value={formData.unit_id} onValueChange={(value) => handleInputChange("unit_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Cái (PCS)</SelectItem>
                  <SelectItem value="kg">Kilogram (KG)</SelectItem>
                  <SelectItem value="box">Hộp (BOX)</SelectItem>
                  <SelectItem value="pack">Gói (PACK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Giá cả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price">Giá bán (₫)</Label>
              <Input
                id="unit_price"
                type="number"
                value={formData.unit_price}
                onChange={(e) => handleInputChange("unit_price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_price">Giá vốn (₫)</Label>
              <Input
                id="cost_price"
                type="number"
                value={formData.cost_price}
                onChange={(e) => handleInputChange("cost_price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý Tồn kho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_stock">Tồn kho Tối thiểu</Label>
              <Input
                id="min_stock"
                type="number"
                value={formData.min_stock_level}
                onChange={(e) => handleInputChange("min_stock_level", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_stock">Tồn kho Tối đa</Label>
              <Input
                id="max_stock"
                type="number"
                value={formData.max_stock_level}
                onChange={(e) => handleInputChange("max_stock_level", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_point">Điểm Đặt hàng lại</Label>
              <Input
                id="reorder_point"
                type="number"
                value={formData.reorder_point}
                onChange={(e) => handleInputChange("reorder_point", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theo dõi Số serial</Label>
                <p className="text-sm text-muted-foreground">Bật để theo dõi từng sản phẩm bằng số serial</p>
              </div>
              <Switch
                checked={formData.is_serialized}
                onCheckedChange={(checked) => handleInputChange("is_serialized", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theo dõi Lô hàng</Label>
                <p className="text-sm text-muted-foreground">Bật để theo dõi sản phẩm theo lô và hạn sử dụng</p>
              </div>
              <Switch
                checked={formData.is_batch_tracked}
                onCheckedChange={(checked) => handleInputChange("is_batch_tracked", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Tạo Sản phẩm
        </Button>
      </div>
    </form>
  )
}
