import { MainLayout } from "@/components/layout/main-layout"
import { GoodsIssueList } from "@/components/goods-issue/goods-issue-list"
import { GoodsIssueStats } from "@/components/goods-issue/goods-issue-stats"

export default function GoodsIssuePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Goods Issue</h1>
        </div>

        <GoodsIssueStats />
        <GoodsIssueList />
      </div>
    </MainLayout>
  )
}
