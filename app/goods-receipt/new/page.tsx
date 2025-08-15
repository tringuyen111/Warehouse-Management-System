import { MainLayout } from "@/components/layout/main-layout"
import { CreateGoodsReceiptForm } from "@/components/goods-receipt/create-goods-receipt-form"

export default function NewGoodsReceiptPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Create Goods Receipt</h1>
        </div>

        <CreateGoodsReceiptForm />
      </div>
    </MainLayout>
  )
}
