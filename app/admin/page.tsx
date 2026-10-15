import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function DashboardContent() {
  const supabase = await createClient()

  // Get today's requests count
  const { count: todayRequests } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date().toISOString().split('T')[0])

  // Get pending quotes count
  const { count: pendingQuotes } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'SENT')

  // Get upcoming services count
  const { count: upcomingServices } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })
    .in('status', ['ACCEPTED', 'IN_PROGRESS'])
    .gte('preferred_date', new Date().toISOString().split('T')[0])

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Demandes du jour
          </h2>
          <p className="text-4xl font-bold text-primary">{todayRequests ?? 0}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Devis en attente
          </h2>
          <p className="text-4xl font-bold text-primary">{pendingQuotes ?? 0}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Prestations à venir
          </h2>
          <p className="text-4xl font-bold text-primary">{upcomingServices ?? 0}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/requests"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Voir les demandes
          </Link>
          <Link
            href="/admin/quotes"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Voir les devis
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
