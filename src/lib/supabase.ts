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

/*
  // Add this to src/lib/supabase.ts temporarily for debugging
  console.log('Environment check:')
  console.log('NODE_ENV:', import.meta.env.MODE)
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('All env vars:', import.meta.env)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:')
    console.error('URL:', supabaseUrl)
    console.error('Key exists:', !!supabaseAnonKey)
    throw new Error('Missing Supabase environment variables')
  }
*/