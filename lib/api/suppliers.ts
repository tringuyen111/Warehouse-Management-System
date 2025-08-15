import { createClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface Supplier {
  id: string
  code: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  tax_id?: string
  payment_terms?: string
  credit_limit: number
  is_active: boolean
  rating?: number
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateSupplierData {
  code: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  tax_id?: string
  payment_terms?: string
  credit_limit?: number
  rating?: number
  notes?: string
}

// Server-side functions
export async function getSuppliers(filters?: {
  search?: string
  is_active?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase.from("suppliers").select("*").order("name", { ascending: true })

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`,
    )
  }

  if (filters?.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch suppliers: ${error.message}`)
  }

  return data as Supplier[]
}

export async function getSupplier(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Failed to fetch supplier: ${error.message}`)
  }

  return data as Supplier
}

export async function createSupplier(supplierData: CreateSupplierData) {
  const supabase = createClient()

  const { data, error } = await supabase.from("suppliers").insert([supplierData]).select().single()

  if (error) {
    throw new Error(`Failed to create supplier: ${error.message}`)
  }

  return data as Supplier
}

export async function updateSupplier(id: string, supplierData: Partial<CreateSupplierData>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("suppliers")
    .update({ ...supplierData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update supplier: ${error.message}`)
  }

  return data as Supplier
}

// Client-side API class
export class SuppliersAPI {
  private supabase = createClientComponentClient()

  async getSuppliers(filters?: {
    search?: string
    is_active?: boolean
    limit?: number
    offset?: number
  }) {
    let query = this.supabase.from("suppliers").select("*").order("name", { ascending: true })

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`,
      )
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch suppliers: ${error.message}`)
    }

    return data as Supplier[]
  }

  async createSupplier(supplierData: CreateSupplierData) {
    const { data, error } = await this.supabase.from("suppliers").insert([supplierData]).select().single()

    if (error) {
      throw new Error(`Failed to create supplier: ${error.message}`)
    }

    return data as Supplier
  }

  async updateSupplier(id: string, supplierData: Partial<CreateSupplierData>) {
    const { data, error } = await this.supabase
      .from("suppliers")
      .update({ ...supplierData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update supplier: ${error.message}`)
    }

    return data as Supplier
  }
}
