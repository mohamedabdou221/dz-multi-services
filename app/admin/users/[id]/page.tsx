import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function UserDetailContent({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get user
  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()
    .returns<any>() as any

  if (!user) {
    redirect('/admin/users')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/users"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Retour aux utilisateurs
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Détail de l'utilisateur
          </h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors">
            Modifier
          </button>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-colors">
            Désactiver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Informations personnelles
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Nom :</span>{' '}
              {user.first_name} {user.last_name}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Email :</span>{' '}
              {user.email}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Téléphone :</span>{' '}
              {user.phone}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Date de création :</span>{' '}
              {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Role and Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Rôle et statut
          </h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="text-muted-foreground">Rôle :</span>{' '}
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                user.role === 'AGENT' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Statut :</span>{' '}
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Actif' : 'Inactif'}
              </span>
            </p>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Activité récente
          </h2>
          <p className="text-muted-foreground">
            Fonctionnalité à implémenter : afficher l'historique des actions de l'utilisateur
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <UserDetailContent params={params} />
    </Suspense>
  )
}
