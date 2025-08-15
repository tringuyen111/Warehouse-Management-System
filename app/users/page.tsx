import { MainLayout } from "@/components/layout/main-layout"
import { UsersList } from "@/components/users/users-list"
import { UsersStats } from "@/components/users/users-stats"

export default function UsersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        </div>

        <UsersStats />
        <UsersList />
      </div>
    </MainLayout>
  )
}
