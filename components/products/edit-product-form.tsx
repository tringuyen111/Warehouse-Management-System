"use client"

import type { Product } from "@/lib/api/products"
import type { Supplier } from "@/lib/api/suppliers"

interface EditProductFormProps {
  product: Product
  suppliers: Supplier[]
}

export function EditProductForm({ product }: EditProductFormProps) {
  return (
    <div>
      Chức năng chỉnh sửa sản phẩm cho <strong>{product.name}</strong> sẽ sớm có mặt.
    </div>
  )
}
