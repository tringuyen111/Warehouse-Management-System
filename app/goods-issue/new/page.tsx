import { MainLayout } from "@/components/layout/main-layout"
import { CreateGoodsIssueForm } from "@/components/goods-issue/create-goods-issue-form"

export default function NewGoodsIssuePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Create Goods Issue</h1>
        </div>

        <CreateGoodsIssueForm />
      </div>
    </MainLayout>
  )
}
