import { supabase } from './supabase'

export interface Subscriber {
  id: string
  email: string
  created_at: string
}

export const addSubscriber = async (email: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('subscribers').insert([{ email }])
  if (error) {
    console.error('Error adding subscriber:', error)
    return { error: error.message }
  }
  return { error: null }
}

export const listSubscribers = async (): Promise<Subscriber[]> => {
  const { data, error } = await supabase.from('subscribers').select('*')
  if (error) {
    console.error('Error fetching subscribers:', error)
    return []
  }
  return data as Subscriber[]
}
