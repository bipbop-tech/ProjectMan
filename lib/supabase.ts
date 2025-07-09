import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface DatabaseProject {
  id: string
  name: string
  description: string
  status: string
  priority: string
  progress: number
  start_date: string
  end_date: string
  image?: string
  phases: any
  deliverables: any
  todos: any
  created_at: string
  updated_at: string
}

export interface DatabaseGeneralTodo {
  id: string
  text: string
  completed: boolean
  priority: string
  due_date?: string
  project_id?: string
  created_at: string
  updated_at: string
}

export interface DatabaseActivity {
  id: string
  type: string
  message: string
  timestamp: string
  project_id?: string
  created_at: string
}

// Project operations
export const projectService = {
  async getAll() {
    const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(project: Omit<DatabaseProject, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("projects").insert([project]).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, project: Partial<DatabaseProject>) {
    const { data, error } = await supabase
      .from("projects")
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error
  },
}

// General todos operations
export const generalTodoService = {
  async getAll() {
    const { data, error } = await supabase.from("general_todos").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(todo: Omit<DatabaseGeneralTodo, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("general_todos").insert([todo]).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, todo: Partial<DatabaseGeneralTodo>) {
    const { data, error } = await supabase
      .from("general_todos")
      .update({ ...todo, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("general_todos").delete().eq("id", id)

    if (error) throw error
  },
}

// Activity operations
export const activityService = {
  async getAll() {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  },

  async create(activity: Omit<DatabaseActivity, "id" | "created_at">) {
    const { data, error } = await supabase.from("activities").insert([activity]).select().single()

    if (error) throw error
    return data
  },
}
