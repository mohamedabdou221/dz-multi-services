import { Suspense } from 'react'
import Link from 'next/link'

function ConfirmationContent({ reference }: { reference: string }) {
  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Demande soumise avec succès !
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Votre demande a été enregistrée et nous vous enverrons un devis sous 24h.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            Détails de votre demande
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Référence :</span>
              <span className="font-semibold text-foreground">{reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut :</span>
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                En attente
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vous recevrez un e-mail de confirmation avec les détails de votre demande.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-foreground text-foreground rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RequestConfirmationPage({
  searchParams,
}: {
  searchParams: { reference?: string }
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConfirmationContent reference={searchParams.reference || 'N/A'} />
    </Suspense>
  )
}
