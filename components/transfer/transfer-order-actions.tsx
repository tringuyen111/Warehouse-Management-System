"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Truck, Edit, FileText } from "lucide-react"

interface TransferOrderActionsProps {
  transferId: string
}

export function TransferOrderActions({ transferId }: TransferOrderActionsProps) {
  // Mock status - in real app this would come from API
  const status = "pending"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "pending" && (
          <>
            <Button className="w-full" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Approve Transfer
            </Button>
            <Button variant="destructive" className="w-full" size="sm">
              <X className="h-4 w-4 mr-2" />
              Reject Transfer
            </Button>
          </>
        )}

        {status === "approved" && (
          <Button className="w-full" size="sm">
            <Truck className="h-4 w-4 mr-2" />
            Start Transit
          </Button>
        )}

        {status === "in-transit" && (
          <Button className="w-full" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark as Delivered
          </Button>
        )}

        <Button variant="outline" className="w-full bg-transparent" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Transfer
        </Button>

        <Button variant="outline" className="w-full bg-transparent" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  )
}
