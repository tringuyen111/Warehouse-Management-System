"use client"

import type { Product } from "@/lib/api/products"
import type { Supplier } from "@/lib/api/suppliers"

interface EditProductFormProps {
  product: Product
  suppliers: Supplier[]
}

export function EditProductForm({ product, suppliers }: EditProductFormProps) {
  return (
    <div>
      <p>Chức năng chỉnh sửa sản phẩm đang được phát triển.</p>
    </div>
  )
}
