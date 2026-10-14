import { Suspense } from 'react'
import DashboardContent from './dashboard-content'

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
