import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

/**
 * Service role client - ONLY FOR SERVER USE
 * This client has full access to the database and bypasses RLS.
 * NEVER use this in client-side code or expose the key to the browser.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
