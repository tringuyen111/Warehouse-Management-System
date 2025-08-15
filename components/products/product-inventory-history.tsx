import type { InventoryTransaction } from "@/lib/api/inventory"

interface ProductInventoryHistoryProps {
  transactions: InventoryTransaction[]
}

export function ProductInventoryHistory({ transactions }: ProductInventoryHistoryProps) {
  if (!transactions.length) {
    return <p className="text-sm text-muted-foreground">Chưa có lịch sử tồn kho</p>
  }

  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {transactions.map((t) => (
        <li key={t.id}>
          {t.created_at}: {t.transaction_type} {t.quantity}
        </li>
      ))}
    </ul>
  )
}
