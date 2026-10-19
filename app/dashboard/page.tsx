import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function ClientDashboardContent() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's requests
  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .returns<any[]>() as any

  // Get user's quotes
  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .returns<any[]>() as any

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
        Mon Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Demandes
          </h3>
          <p className="text-4xl font-bold text-primary">{requests?.length || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Devis
          </h3>
          <p className="text-4xl font-bold text-primary">{quotes?.length || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Statut
          </h3>
          <p className="text-lg text-muted-foreground">Client actif</p>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Mes demandes récentes
          </h2>
          <Link
            href="/services"
            className="text-sm text-primary hover:underline"
          >
            Nouvelle demande
          </Link>
        </div>
        {requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.slice(0, 5).map((request: any) => (
              <div
                key={request.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{request.reference}</p>
                    <p className="text-sm text-muted-foreground">{request.service_type}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucune demande pour le moment</p>
        )}
      </div>

      {/* Recent Quotes */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Mes devis
        </h2>
        {quotes && quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.slice(0, 5).map((quote: any) => (
              <div
                key={quote.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{quote.reference}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.total_amount.toLocaleString('fr-FR')} KMF
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    quote.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                    quote.status === 'SENT' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun devis pour le moment</p>
        )}
      </div>
    </div>
  )
}

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ClientDashboardContent />
    </Suspense>
  )
}
