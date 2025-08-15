import { Suspense } from "react"
import { getProducts } from "@/lib/api/products"
import { getSuppliers } from "@/lib/api/suppliers"
import { ProductsStats } from "@/components/products/products-stats"
import { ProductsList } from "@/components/products/products-list"
import { ProductsFilters } from "@/components/products/products-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface ProductsPageProps {
  searchParams: {
    search?: string
    category_id?: string
    is_active?: string
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 20
  const offset = (page - 1) * limit

  const [products, suppliers] = await Promise.all([
    getProducts({
      search: searchParams.search,
      category_id: searchParams.category_id,
      is_active: searchParams.is_active === "true" ? true : searchParams.is_active === "false" ? false : undefined,
      limit,
      offset,
    }),
    getSuppliers({ is_active: true }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh mục sản phẩm và thông tin chi tiết</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm Sản phẩm
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <Suspense fallback={<div>Đang tải thống kê...</div>}>
        <ProductsStats />
      </Suspense>

      {/* Filters */}
      <ProductsFilters />

      {/* Products List */}
      <Suspense fallback={<div>Đang tải danh sách sản phẩm...</div>}>
        <ProductsList products={products} />
      </Suspense>
    </div>
  )
}
