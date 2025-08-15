import { MainLayout } from "@/components/layout/main-layout"
import { TransferOrderDetails } from "@/components/transfer/transfer-order-details"
import { TransferOrderTracking } from "@/components/transfer/transfer-order-tracking"
import { TransferOrderActions } from "@/components/transfer/transfer-order-actions"

interface TransferOrderPageProps {
  params: {
    id: string
  }
}

export default function TransferOrderPage({ params }: TransferOrderPageProps) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Transfer Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransferOrderDetails transferId={params.id} />
          </div>
          <div className="space-y-6">
            <TransferOrderActions transferId={params.id} />
            <TransferOrderTracking transferId={params.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
