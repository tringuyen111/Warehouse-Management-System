import { createClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface Location {
  id: string
  code: string
  name: string
  type: string
  parent_id?: string
  address?: string
  capacity?: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  parent?: {
    id: string
    code: string
    name: string
  }
  children?: Location[]
}

// Server-side functions
export async function getLocations(filters?: {
  type?: string
  parent_id?: string
  is_active?: boolean
}) {
  const supabase = createClient()

  let query = supabase
    .from("locations")
    .select(`
      *,
      parent:locations!parent_id(id, code, name)
    `)
    .order("code", { ascending: true })

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }

  if (filters?.parent_id) {
    query = query.eq("parent_id", filters.parent_id)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`)
  }

  return data as Location[]
}

export async function getLocation(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("locations")
    .select(`
      *,
      parent:locations!parent_id(id, code, name),
      children:locations!parent_id(id, code, name, type)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch location: ${error.message}`)
  }

  return data as Location
}

// Client-side API class
export class LocationsAPI {
  private supabase = createClientComponentClient()

  async getLocations(filters?: {
    type?: string
    parent_id?: string
    is_active?: boolean
  }) {
    let query = this.supabase
      .from("locations")
      .select(`
        *,
        parent:locations!parent_id(id, code, name)
      `)
      .order("code", { ascending: true })

    if (filters?.type) {
      query = query.eq("type", filters.type)
    }

    if (filters?.parent_id) {
      query = query.eq("parent_id", filters.parent_id)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch locations: ${error.message}`)
    }

    return data as Location[]
  }
}
