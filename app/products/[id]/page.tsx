import { getProduct } from "@/lib/api/products"
import { getSuppliers } from "@/lib/api/suppliers"
import { getInventoryTransactions } from "@/lib/api/inventory"
import { ProductDetails } from "@/components/products/product-details"
import { EditProductForm } from "@/components/products/edit-product-form"
import { ProductInventoryHistory } from "@/components/products/product-inventory-history"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  try {
    const [product, suppliers, transactions] = await Promise.all([
      getProduct(params.id),
      getSuppliers({ is_active: true }),
      getInventoryTransactions({ product_id: params.id, limit: 50 }),
    ])

    const activeTab = searchParams.tab || "details"

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
            <TabsTrigger value="history">Lịch sử Tồn kho</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProductDetails product={product} />
          </TabsContent>

          <TabsContent value="edit">
            <div className="max-w-4xl">
              <EditProductForm product={product} suppliers={suppliers} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ProductInventoryHistory transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
