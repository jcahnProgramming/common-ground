import Constants from 'expo-constants'

export const getEnv = () => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = Constants.expoConfig?.extra ?? {}
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  }
}
