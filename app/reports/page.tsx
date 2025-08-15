import { Suspense } from "react"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { ReportsList } from "@/components/reports/reports-list"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ExportActions } from "@/components/reports/export-actions"

interface ReportsPageProps {
  searchParams: {
    type?: string
    date_from?: string
    date_to?: string
    location_id?: string
    supplier_id?: string
  }
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <ReportsHeader />

      {/* Filters */}
      <Suspense fallback={<div>Đang tải bộ lọc...</div>}>
        <ReportsFilters />
      </Suspense>

      {/* Export Actions */}
      <ExportActions />

      {/* Charts and Analytics */}
      <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
        <ReportsCharts filters={searchParams} />
      </Suspense>

      {/* Reports List */}
      <Suspense fallback={<div>Đang tải báo cáo...</div>}>
        <ReportsList filters={searchParams} />
      </Suspense>
    </div>
  )
}
