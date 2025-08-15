"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"

interface UserPermissionsProps {
  userId: string
}

const mockPermissions = [
  { category: "Inventory", permissions: ["View Inventory", "Edit Inventory"] },
  { category: "Operations", permissions: ["Goods Receipt", "Goods Issue", "Create Transfers", "Approve Transfers"] },
  { category: "Administration", permissions: ["View Users", "Manage Users"] },
  { category: "Reports", permissions: ["View Reports", "Export Reports"] },
]

export function UserPermissions({ userId }: UserPermissionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {mockPermissions.map((group) => (
              <div key={group.category}>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">{group.category}</h4>
                <div className="space-y-2">
                  {group.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
