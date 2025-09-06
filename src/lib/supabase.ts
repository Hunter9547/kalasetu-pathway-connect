import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'artisan' | 'mentor'
  location?: string
  skills?: string[]
  bio?: string
  created_at: string
  updated_at: string
}

export interface MentorshipRequest {
  id: string
  artisan_id: string
  mentor_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}