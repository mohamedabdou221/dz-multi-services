import { createClient } from '@/lib/supabase/client'
import type { AppRole, Database } from './types'

export async function getUserRole() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single<{ role: AppRole; is_active: boolean }>()

  if (!profile || !profile.is_active) {
    return null
  }

  return profile.role
}

export async function isStaff() {
  const role = await getUserRole()
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export async function isAdmin() {
  const role = await getUserRole()
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export async function isSuperAdmin() {
  const role = await getUserRole()
  return role === 'SUPER_ADMIN'
}
