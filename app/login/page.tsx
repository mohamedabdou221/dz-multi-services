import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginForm redirect={searchParams.redirect} />
    </Suspense>
  )
}
