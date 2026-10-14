import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { AppRole } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', user.id)
    .single<{ role: AppRole; first_name: string; last_name: string }>()

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
    redirect('/')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-texte">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-heading font-bold text-foreground">
                Dz Multi-Services
              </Link>
              <span className="text-sm text-muted-foreground">/ Administration</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {profile.first_name} {profile.last_name}
              </span>
              <Link
                href="/logout"
                className="text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                Déconnexion
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-16">
          <div className="flex gap-6 py-3">
            <Link
              href="/admin"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/requests"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Demandes
            </Link>
            <Link
              href="/admin/quotes"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Devis
            </Link>
            {profile.role === 'SUPER_ADMIN' && (
              <Link
                href="/admin/users"
                className="text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                Utilisateurs
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-16 py-8">
        <Suspense fallback={<div>Chargement...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
