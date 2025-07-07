import { createClient } from '@supabase/supabase-js'

const isWeb = typeof document !== 'undefined'

const url = isWeb
  ? import.meta.env.VITE_SUPABASE_URL
  : process.env.SUPABASE_URL

const anonKey = isWeb
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : process.env.SUPABASE_ANON_KEY

export const supabase = createClient(url, anonKey)
