import { MainLayout } from "@/components/layout/main-layout"
import { CreateTransferOrderForm } from "@/components/transfer/create-transfer-order-form"

export default function NewTransferOrderPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Create Transfer Order</h1>
        </div>

        <CreateTransferOrderForm />
      </div>
    </MainLayout>
  )
}
