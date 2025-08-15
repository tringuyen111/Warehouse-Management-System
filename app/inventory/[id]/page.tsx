import { MainLayout } from "@/components/layout/main-layout"
import { ProductDetails } from "@/components/inventory/product-details"
import { StockHistory } from "@/components/inventory/stock-history"
import { StockAdjustment } from "@/components/inventory/stock-adjustment"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Product Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductDetails productId={params.id} />
          </div>
          <div className="space-y-6">
            <StockAdjustment productId={params.id} />
            <StockHistory productId={params.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
