import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use placeholder values during build/prerender when env vars are absent.
  // At real runtime in the browser, missing values surface as auth errors instead of crashing the app.
  return createBrowserClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-anon-key'
  )
}
