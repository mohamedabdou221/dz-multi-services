import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function PaymentPageContent({
  searchParams,
}: {
  searchParams: { quote_id?: string }
}) {
  const supabase = await createClient()

  if (!searchParams.quote_id) {
    redirect('/dashboard')
  }

  // Get quote details
  const { data: quote } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', searchParams.quote_id)
    .single()
    .returns<any>() as any

  if (!quote) {
    redirect('/dashboard')
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block"
      >
        ← Retour au dashboard
      </Link>

      <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
        Paiement
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Résumé du devis
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Référence :</span>{' '}
              {quote.reference}
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
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Mode de paiement
          </h2>
          <p className="text-muted-foreground mb-6">
            Fonctionnalité à implémenter : Intégration avec des fournisseurs de paiement
          </p>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:bg-background transition-colors">
              <input type="radio" name="payment_method" className="w-4 h-4" />
              <div>
                <p className="font-semibold text-foreground">RIA</p>
                <p className="text-sm text-muted-foreground">Transfert rapide via RIA</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:bg-background transition-colors">
              <input type="radio" name="payment_method" className="w-4 h-4" />
              <div>
                <p className="font-semibold text-foreground">Mobile Money</p>
                <p className="text-sm text-muted-foreground">Paiement mobile</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:bg-background transition-colors">
              <input type="radio" name="payment_method" className="w-4 h-4" />
              <div>
                <p className="font-semibold text-foreground">Western Union</p>
                <p className="text-sm text-muted-foreground">Transfert international</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:bg-background transition-colors">
              <input type="radio" name="payment_method" className="w-4 h-4" />
              <div>
                <p className="font-semibold text-foreground">Espèces</p>
                <p className="text-sm text-muted-foreground">Paiement en espèces</p>
              </div>
            </label>
          </div>
          <button className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors">
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { quote_id?: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaymentPageContent searchParams={searchParams} />
    </Suspense>
  )
}
