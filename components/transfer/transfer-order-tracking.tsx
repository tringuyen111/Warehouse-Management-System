"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Clock, Truck, Package } from "lucide-react"

interface TransferOrderTrackingProps {
  transferId: string
}

const mockTrackingEvents = [
  {
    id: "1",
    status: "created",
    title: "Transfer Order Created",
    description: "Transfer order TO-001 has been created",
    timestamp: "2024-01-15 10:30",
    user: "John Doe",
    completed: true,
  },
  {
    id: "2",
    status: "pending",
    title: "Pending Approval",
    description: "Waiting for manager approval",
    timestamp: "2024-01-15 10:31",
    user: "System",
    completed: false,
  },
  {
    id: "3",
    status: "approved",
    title: "Transfer Approved",
    description: "Transfer approved and ready for pickup",
    timestamp: "",
    user: "",
    completed: false,
  },
  {
    id: "4",
    status: "in-transit",
    title: "In Transit",
    description: "Items picked up and in transit",
    timestamp: "",
    user: "",
    completed: false,
  },
  {
    id: "5",
    status: "delivered",
    title: "Delivered",
    description: "Items delivered to destination",
    timestamp: "",
    user: "",
    completed: false,
  },
]

function getStatusIcon(status: string, completed: boolean) {
  if (completed) {
    return <Check className="h-4 w-4 text-green-600" />
  }

  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "approved":
      return <Package className="h-4 w-4 text-blue-600" />
    case "in-transit":
      return <Truck className="h-4 w-4 text-orange-600" />
    case "delivered":
      return <Check className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

export function TransferOrderTracking({ transferId }: TransferOrderTrackingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {mockTrackingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                  {getStatusIcon(event.status, event.completed)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${event.completed ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {event.title}
                    </p>
                    {event.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${event.completed ? "text-muted-foreground" : "text-muted-foreground/70"}`}
                  >
                    {event.description}
                  </p>
                  {event.timestamp && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{event.user}</p>
                      <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
