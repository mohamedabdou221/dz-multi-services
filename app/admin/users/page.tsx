import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function UsersContent() {
  const supabase = await createClient()

  // Get all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<any[]>()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Utilisateurs
        </h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {users && users.length > 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-foreground">
                  Rôle
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
              {users.map((user: any) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'AGENT' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Modifier
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
            Aucun utilisateur pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <UsersContent />
    </Suspense>
  )
}
