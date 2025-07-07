import { createClient } from '@supabase/supabase-js'
import { getEnv } from './getEnv'

const { url, anonKey } = getEnv()

// Custom fetch (optional, can fallback to global fetch in mobile)
const supabase = createClient(url, anonKey, {
  global: {
    fetch: typeof fetch !== 'undefined' ? fetch : require('cross-fetch'),
  },
})

export { supabase }
