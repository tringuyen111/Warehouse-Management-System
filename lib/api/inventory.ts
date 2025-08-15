import { createClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface InventoryItem {
  id: string
  product_id: string
  location_id: string
  quantity_on_hand: number
  quantity_reserved: number
  quantity_available: number
  unit_cost: number
  last_counted_at?: string
  last_counted_by?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    name: string
    barcode?: string
    unit?: {
      code: string
      name: string
    }
  }
  location?: {
    id: string
    code: string
    name: string
    type: string
  }
}

export interface InventoryTransaction {
  id: string
  product_id: string
  location_id: string
  transaction_type: string
  reference_type?: string
  reference_id?: string
  quantity: number
  unit_cost: number
  total_cost: number
  batch_number?: string
  serial_number?: string
  expiry_date?: string
  notes?: string
  created_at: string
  created_by?: string
  product?: {
    sku: string
    name: string
  }
  location?: {
    code: string
    name: string
  }
  created_by_user?: {
    full_name: string
  }
}

export interface StockAlert {
  id: string
  product_id: string
  location_id: string
  alert_type: string
  status: string
  message: string
  threshold_value?: number
  current_value?: number
  created_at: string
  acknowledged_at?: string
  acknowledged_by?: string
  resolved_at?: string
  resolved_by?: string
  product?: {
    sku: string
    name: string
  }
  location?: {
    code: string
    name: string
  }
}

// Server-side functions
export async function getInventory(filters?: {
  search?: string
  location_id?: string
  low_stock?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("inventory")
    .select(`
      *,
      product:products(id, sku, name, barcode, unit:units(code, name)),
      location:locations(id, code, name, type)
    `)
    .order("updated_at", { ascending: false })

  if (filters?.search) {
    query = query.or(`product.name.ilike.%${filters.search}%,product.sku.ilike.%${filters.search}%`)
  }

  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id)
  }

  if (filters?.low_stock) {
    query = query.lt("quantity_available", 10) // Adjust threshold as needed
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch inventory: ${error.message}`)
  }

  return data as InventoryItem[]
}

export async function getInventoryTransactions(filters?: {
  product_id?: string
  location_id?: string
  transaction_type?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("inventory_transactions")
    .select(`
      *,
      product:products(sku, name),
      location:locations(code, name),
      created_by_user:users(full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.product_id) {
    query = query.eq("product_id", filters.product_id)
  }

  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id)
  }

  if (filters?.transaction_type) {
    query = query.eq("transaction_type", filters.transaction_type)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch inventory transactions: ${error.message}`)
  }

  return data as InventoryTransaction[]
}

export async function getStockAlerts(filters?: {
  status?: string
  alert_type?: string
  limit?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("stock_alerts")
    .select(`
      *,
      product:products(sku, name),
      location:locations(code, name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.alert_type) {
    query = query.eq("alert_type", filters.alert_type)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch stock alerts: ${error.message}`)
  }

  return data as StockAlert[]
}

export async function adjustInventory(
  adjustments: {
    product_id: string
    location_id: string
    quantity: number
    unit_cost: number
    notes?: string
  }[],
) {
  const supabase = createClient()

  // Create inventory transactions for adjustments
  const transactions = adjustments.map((adj) => ({
    product_id: adj.product_id,
    location_id: adj.location_id,
    transaction_type: adj.quantity > 0 ? "adjustment_in" : "adjustment_out",
    reference_type: "manual_adjustment",
    quantity: Math.abs(adj.quantity),
    unit_cost: adj.unit_cost,
    notes: adj.notes,
  }))

  const { data, error } = await supabase.from("inventory_transactions").insert(transactions).select()

  if (error) {
    throw new Error(`Failed to adjust inventory: ${error.message}`)
  }

  return data
}

// Client-side API class
export class InventoryAPI {
  private supabase = createClientComponentClient()

  async getInventory(filters?: {
    search?: string
    location_id?: string
    low_stock?: boolean
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from("inventory")
      .select(`
        *,
        product:products(id, sku, name, barcode, unit:units(code, name)),
        location:locations(id, code, name, type)
      `)
      .order("updated_at", { ascending: false })

    if (filters?.search) {
      query = query.or(`product.name.ilike.%${filters.search}%,product.sku.ilike.%${filters.search}%`)
    }

    if (filters?.location_id) {
      query = query.eq("location_id", filters.location_id)
    }

    if (filters?.low_stock) {
      query = query.lt("quantity_available", 10)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`)
    }

    return data as InventoryItem[]
  }

  async adjustInventory(
    adjustments: {
      product_id: string
      location_id: string
      quantity: number
      unit_cost: number
      notes?: string
    }[],
  ) {
    const transactions = adjustments.map((adj) => ({
      product_id: adj.product_id,
      location_id: adj.location_id,
      transaction_type: adj.quantity > 0 ? "adjustment_in" : "adjustment_out",
      reference_type: "manual_adjustment",
      quantity: Math.abs(adj.quantity),
      unit_cost: adj.unit_cost,
      notes: adj.notes,
    }))

    const { data, error } = await this.supabase.from("inventory_transactions").insert(transactions).select()

    if (error) {
      throw new Error(`Failed to adjust inventory: ${error.message}`)
    }

    return data
  }

  async acknowledgeAlert(alertId: string) {
    const { data, error } = await this.supabase
      .from("stock_alerts")
      .update({
        status: "acknowledged",
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", alertId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to acknowledge alert: ${error.message}`)
    }

    return data
  }
}
