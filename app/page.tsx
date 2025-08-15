import { MainLayout } from "@/components/layout/main-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { StockLevelsChart } from "@/components/dashboard/stock-levels-chart"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryChart />
          <StockLevelsChart />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </MainLayout>
  )
}
