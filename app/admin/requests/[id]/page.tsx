import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function RequestDetailContent({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

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
    .eq('id', params.id)
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
            Détail de la demande
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/admin/quotes/create?request_id=${request.id}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Créer un devis
          </Link>
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
              {request.profiles?.first_name} {request.profiles?.last_name}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Email :</span>{' '}
              {request.profiles?.email}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Téléphone :</span>{' '}
              {request.profiles?.phone}
            </p>
          </div>
        </div>

        {/* Request Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Détails de la demande
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Référence :</span>{' '}
              {request.reference}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Type de service :</span>{' '}
              {request.service_type}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Date souhaitée :</span>{' '}
              {new Date(request.preferred_date).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Statut :</span>{' '}
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                request.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status}
              </span>
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Créée le :</span>{' '}
              {new Date(request.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Description
          </h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {request.description || 'Aucune description fournie'}
          </p>
        </div>

        {/* Additional Details */}
        {request.metadata && (
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Informations supplémentaires
            </h2>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(request.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RequestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RequestDetailContent params={params} />
    </Suspense>
  )
}
