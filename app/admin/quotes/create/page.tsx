import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function CreateQuoteContent({
  searchParams,
}: {
  searchParams: { request_id?: string }
}) {
  const supabase = await createClient()

  if (!searchParams.request_id) {
    redirect('/admin/requests')
  }

  // Get request with client info
  const { data: request } = await supabase
    .from('requests')
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('id', searchParams.request_id)
    .single()
    .returns<any>() as any

  if (!request) {
    redirect('/admin/requests')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/requests"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Retour aux demandes
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Créer un devis
          </h1>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Demande concernée
        </h2>
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="text-muted-foreground">Référence :</span>{' '}
            {request.reference}
          </p>
          <p className="text-foreground">
            <span className="text-muted-foreground">Client :</span>{' '}
            {request.profiles?.first_name} {request.profiles?.last_name}
          </p>
          <p className="text-foreground">
            <span className="text-muted-foreground">Type de service :</span>{' '}
            {request.service_type}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Formulaire de création de devis
        </h2>
        <p className="text-muted-foreground">
          Fonctionnalité à implémenter : Formulaire de création de devis avec les éléments suivants :
        </p>
        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
          <li>Description des prestations</li>
          <li>Liste des éléments avec quantité et prix unitaire</li>
          <li>Calcul automatique du total</li>
          <li>Configuration de l'acompte (pourcentage par défaut)</li>
          <li>Date de validité du devis</li>
          <li>Notes additionnelles</li>
        </ul>
      </div>
    </div>
  )
}

export default function CreateQuotePage({
  searchParams,
}: {
  searchParams: { request_id?: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CreateQuoteContent searchParams={searchParams} />
    </Suspense>
  )
}
