import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function QuoteDetailContent({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get quote with request and client info
  const { data: quote } = await supabase
    .from('quotes')
    .select(`
      *,
      requests (
        reference,
        service_type,
        preferred_date,
        description
      ),
      profiles (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('id', params.id)
    .single()
    .returns<any>() as any

  if (!quote) {
    redirect('/admin/quotes')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/quotes"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Retour aux devis
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Détail du devis
          </h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors">
            Télécharger PDF
          </button>
          {quote.status === 'DRAFT' && (
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors">
              Envoyer le devis
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Client
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Nom :</span>{' '}
              {quote.profiles?.first_name} {quote.profiles?.last_name}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Email :</span>{' '}
              {quote.profiles?.email}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Téléphone :</span>{' '}
              {quote.profiles?.phone}
            </p>
          </div>
        </div>

        {/* Quote Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Détails du devis
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Référence :</span>{' '}
              {quote.reference}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Demande liée :</span>{' '}
              {quote.requests?.reference}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Montant total :</span>{' '}
              {quote.total_amount.toLocaleString('fr-FR')} KMF
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Acompte requis :</span>{' '}
              {quote.deposit_amount?.toLocaleString('fr-FR')} KMF
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Validité :</span>{' '}
              {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Statut :</span>{' '}
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                quote.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                quote.status === 'SENT' ? 'bg-yellow-100 text-yellow-800' :
                quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {quote.status}
              </span>
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Créé le :</span>{' '}
              {new Date(quote.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Demande originale
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Type de service :</span>{' '}
              {quote.requests?.service_type}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Date souhaitée :</span>{' '}
              {quote.requests?.preferred_date ? new Date(quote.requests.preferred_date).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Description :</span>{' '}
            </p>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {quote.requests?.description || 'Aucune description'}
            </p>
          </div>
        </div>

        {/* Quote Items */}
        <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Éléments du devis
          </h2>
          {quote.items && quote.items.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-sm font-semibold text-foreground">Description</th>
                  <th className="text-right py-2 text-sm font-semibold text-foreground">Quantité</th>
                  <th className="text-right py-2 text-sm font-semibold text-foreground">Prix unitaire</th>
                  <th className="text-right py-2 text-sm font-semibold text-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-2 text-sm text-foreground">{item.description}</td>
                    <td className="py-2 text-sm text-foreground text-right">{item.quantity}</td>
                    <td className="py-2 text-sm text-foreground text-right">{item.unit_price.toLocaleString('fr-FR')} KMF</td>
                    <td className="py-2 text-sm text-foreground text-right">{item.total.toLocaleString('fr-FR')} KMF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">Aucun élément dans ce devis</p>
          )}
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Notes
            </h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QuoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <QuoteDetailContent params={params} />
    </Suspense>
  )
}
