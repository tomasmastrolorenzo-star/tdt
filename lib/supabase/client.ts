import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://hvgawmcwzsgmhagpqgin.supabase.co"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseAnonKey) {
    throw new Error("Missing Supabase anon key")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
