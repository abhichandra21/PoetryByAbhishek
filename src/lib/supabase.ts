import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Comment {
  id: string
  poem_id: number
  author: string
  content: string
  created_at: string
  updated_at: string
  likes_count?: number
}

export interface Like {
  id: string
  comment_id: string
  session_id: string
  created_at: string
}
