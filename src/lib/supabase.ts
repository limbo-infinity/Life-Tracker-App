import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzlfwzleuzzncmgobnrn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bGZ3emxldXp6bmNtZ29ibnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDM5MDAsImV4cCI6MjA3MjExOTkwMH0.1YXAJLUapkIBXBYKXbmoZkDq4Gs1Lep_K3t_0bbCGa8'

// Log for debugging (remove in production)
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  // Don't throw error in production, use fallback values
  if (import.meta.env.MODE === 'production') {
    console.warn('Using fallback Supabase values')
  } else {
    throw new Error('Missing Supabase environment variables')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AuthUser = {
  id: string
  email: string
  created_at: string
}


