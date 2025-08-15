"use client"
import type { Product } from "@/lib/api/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Edit, MoreHorizontal, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductsListProps {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
          <p className="text-gray-500 text-center mb-4">
            Chưa có sản phẩm nào được tạo. Hãy thêm sản phẩm đầu tiên của bạn.
          </p>
          <Link href="/products/new">
            <Button>Thêm Sản phẩm</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Hình ảnh</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tên Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Giá bán</TableHead>
              <TableHead>Giá vốn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product.category ? (
                    <Badge variant="secondary">{product.category.name}</Badge>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </TableCell>
                <TableCell>{product.unit ? product.unit.name : <span className="text-gray-400">--</span>}</TableCell>
                <TableCell>
                  {product.unit_price > 0 ? (
                    <span className="font-medium">{product.unit_price.toLocaleString("vi-VN")} ₫</span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </TableCell>
                <TableCell>
                  {product.cost_price > 0 ? (
                    <span>{product.cost_price.toLocaleString("vi-VN")} ₫</span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Hoạt động" : "Ngừng"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}?tab=edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
