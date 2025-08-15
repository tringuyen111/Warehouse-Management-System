import { MainLayout } from "@/components/layout/main-layout"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { InventoryStats } from "@/components/inventory/inventory-stats"

export default function InventoryPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        </div>

        <InventoryStats />
        <InventoryFilters />
        <InventoryTable />
      </div>
    </MainLayout>
  )
}
