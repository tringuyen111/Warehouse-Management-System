"use client"

import type { Product } from "@/lib/api/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Barcode, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover"
                />
              ) : (
                <Package className="h-24 w-24 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin Cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">SKU</label>
                <p className="text-lg font-semibold">{product.sku}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <div className="mt-1">
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Danh mục</label>
                <p className="text-lg">{product.category ? product.category.name : "Chưa phân loại"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Đơn vị tính</label>
                <p className="text-lg">
                  {product.unit ? `${product.unit.name} (${product.unit.code})` : "Chưa xác định"}
                </p>
              </div>
            </div>

            {product.barcode && (
              <div>
                <label className="text-sm font-medium text-gray-500">Mã vạch</label>
                <div className="flex items-center gap-2 mt-1">
                  <Barcode className="h-4 w-4" />
                  <p className="text-lg font-mono">{product.barcode}</p>
                </div>
              </div>
            )}

            {product.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                <p className="text-gray-700 mt-1">{product.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Thông tin Giá cả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Giá bán</label>
              <p className="text-2xl font-bold text-green-600">
                {product.unit_price > 0 ? `${product.unit_price.toLocaleString("vi-VN")} ₫` : "Chưa xác định"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Giá vốn</label>
              <p className="text-2xl font-bold text-blue-600">
                {product.cost_price > 0 ? `${product.cost_price.toLocaleString("vi-VN")} ₫` : "Chưa xác định"}
              </p>
            </div>
          </div>

          {product.unit_price > 0 && product.cost_price > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Lợi nhuận gộp:</span>
                <span className="font-bold text-green-600">
                  {(((product.unit_price - product.cost_price) / product.unit_price) * 100).toFixed(1)}%
                </span>
                <span className="text-gray-600">
                  ({(product.unit_price - product.cost_price).toLocaleString("vi-VN")} ₫)
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Quản lý Tồn kho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Tồn kho Tối thiểu</label>
              <p className="text-xl font-semibold">{product.min_stock_level}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Tồn kho Tối đa</label>
              <p className="text-xl font-semibold">{product.max_stock_level}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Điểm Đặt hàng lại</label>
              <p className="text-xl font-semibold">{product.reorder_point}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theo dõi Số serial</span>
              <Badge variant={product.is_serialized ? "default" : "secondary"}>
                {product.is_serialized ? "Có" : "Không"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theo dõi Lô hàng</span>
              <Badge variant={product.is_batch_tracked ? "default" : "secondary"}>
                {product.is_batch_tracked ? "Có" : "Không"}
              </Badge>
            </div>
          </div>

          {product.shelf_life_days && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Hạn sử dụng:</span>
                <span className="font-semibold">{product.shelf_life_days} ngày</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Bổ sung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
              <p>{new Date(product.created_at).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
              <p>{new Date(product.updated_at).toLocaleDateString("vi-VN")}</p>
            </div>
            {product.weight && (
              <div>
                <label className="text-sm font-medium text-gray-500">Trọng lượng</label>
                <p>{product.weight} kg</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
