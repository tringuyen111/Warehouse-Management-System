import { MainLayout } from "@/components/layout/main-layout"
import { GoodsReceiptList } from "@/components/goods-receipt/goods-receipt-list"
import { GoodsReceiptStats } from "@/components/goods-receipt/goods-receipt-stats"

export default function GoodsReceiptPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Goods Receipt</h1>
        </div>

        <GoodsReceiptStats />
        <GoodsReceiptList />
      </div>
    </MainLayout>
  )
}
