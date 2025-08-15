import { MainLayout } from "@/components/layout/main-layout"
import { TransferOrdersList } from "@/components/transfer/transfer-orders-list"
import { TransferOrdersStats } from "@/components/transfer/transfer-orders-stats"

export default function TransferOrdersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Transfer Orders</h1>
        </div>

        <TransferOrdersStats />
        <TransferOrdersList />
      </div>
    </MainLayout>
  )
}
