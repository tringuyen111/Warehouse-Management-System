import { MainLayout } from "@/components/layout/main-layout"
import { CreateUserForm } from "@/components/users/create-user-form"

export default function NewUserPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
        </div>

        <CreateUserForm />
      </div>
    </MainLayout>
  )
}
