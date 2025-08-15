import { getSuppliers } from "@/lib/api/suppliers"
import { CreateProductForm } from "@/components/products/create-product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
  const suppliers = await getSuppliers({ is_active: true })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Thêm Sản phẩm Mới</h1>
          <p className="text-muted-foreground">Tạo sản phẩm mới trong hệ thống</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <CreateProductForm suppliers={suppliers} />
      </div>
    </div>
  )
}
