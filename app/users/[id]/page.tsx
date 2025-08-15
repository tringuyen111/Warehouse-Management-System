import { MainLayout } from "@/components/layout/main-layout"
import { UserProfile } from "@/components/users/user-profile"
import { UserActivity } from "@/components/users/user-activity"
import { UserPermissions } from "@/components/users/user-permissions"

interface UserPageProps {
  params: {
    id: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserProfile userId={params.id} />
          </div>
          <div className="space-y-6">
            <UserPermissions userId={params.id} />
            <UserActivity userId={params.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
