import { createClient } from '@supabase/supabase-js'
import { getEnv } from './getEnv'

// Detect platform
const isWeb = typeof window !== 'undefined'

// Only import AsyncStorage on mobile (no crash in web builds)
const AsyncStorage = !isWeb
  ? require('@react-native-async-storage/async-storage').default
  : undefined

const { url, anonKey } = getEnv()

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: isWeb ? localStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: typeof fetch !== 'undefined' ? fetch : require('cross-fetch'),
  },
})

