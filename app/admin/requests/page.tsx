import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function RequestsContent() {
  const supabase = await createClient()

  // Get all requests with client info
  const { data: requests } = await supabase
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
    .order('created_at', { ascending: false })
    .returns<any[]>()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Demandes
        </h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {requests && requests.length > 0 ? (
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Date
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
              {requests.map((request: any) => (
                <tr key={request.id} className="border-t border-border">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {request.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {request.profiles?.first_name} {request.profiles?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {request.service_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(request.preferred_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/requests/${request.id}`}
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
            Aucune demande pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RequestsContent />
    </Suspense>
  )
}
