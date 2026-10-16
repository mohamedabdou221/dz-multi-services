import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function QuotesContent() {
  const supabase = await createClient()

  // Get all quotes with request info
  const { data: quotes } = await supabase
    .from('quotes')
    .select(`
      *,
      requests (
        reference,
        service_type,
        preferred_date
      ),
      profiles (
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .returns<any[]>()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Devis
        </h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {quotes && quotes.length > 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Demande
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: any) => (
                <tr key={quote.id} className="border-t border-border">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {quote.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {quote.profiles?.first_name} {quote.profiles?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {quote.requests?.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {quote.total_amount.toLocaleString('fr-FR')} KMF
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      quote.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      quote.status === 'SENT' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/quotes/${quote.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun devis pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}

export default function QuotesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <QuotesContent />
    </Suspense>
  )
}
