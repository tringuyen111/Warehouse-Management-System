"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownToLine, ArrowUpFromLine, Edit, Eye } from "lucide-react"

interface UserActivityProps {
  userId: string
}

const mockActivities = [
  {
    id: "1",
    action: "Created goods receipt",
    details: "GR-001 for Electronics Supplier",
    timestamp: "2024-01-15 10:30",
    icon: <ArrowDownToLine className="h-4 w-4 text-green-600" />,
  },
  {
    id: "2",
    action: "Approved goods issue",
    details: "GI-045 for Production Department",
    timestamp: "2024-01-15 09:15",
    icon: <ArrowUpFromLine className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "3",
    action: "Updated inventory",
    details: "Product ABC-001 stock adjustment",
    timestamp: "2024-01-14 16:45",
    icon: <Edit className="h-4 w-4 text-orange-600" />,
  },
  {
    id: "4",
    action: "Viewed report",
    details: "Monthly inventory report",
    timestamp: "2024-01-14 14:20",
    icon: <Eye className="h-4 w-4 text-purple-600" />,
  },
]

export function UserActivity({ userId }: UserActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg border border-border">
                <div className="flex-shrink-0 p-1 rounded-full bg-muted">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
