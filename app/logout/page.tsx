'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }

    logout()
  }, [router])

  return (
    <div className="flex flex-col flex-1 bg-background font-texte min-h-screen">
      <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-4 sm:px-16">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Déconnexion en cours...</p>
        </div>
      </main>
    </div>
  )
}
