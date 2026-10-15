export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Comment ça marche
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Notre processus est simple et rapide
        </p>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Choisissez votre service
              </h3>
              <p className="text-muted-foreground">
                Parcourez notre catalogue et sélectionnez le service qui correspond à vos besoins.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Remplissez le formulaire
              </h3>
              <p className="text-muted-foreground">
                Donnez-nous les détails de votre demande (date, lieu, préférences, etc.).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Recevez votre devis
              </h3>
              <p className="text-muted-foreground">
                Notre équipe vous enverra un devis personnalisé sous 24h.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Validez et payez
              </h3>
              <p className="text-muted-foreground">
                Acceptez le devis et effectuez le paiement via nos moyens de paiement sécurisés.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              5
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Recevez votre service
              </h3>
              <p className="text-muted-foreground">
                Notre équipe réalise votre prestation avec professionnalisme.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/services"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-primary-foreground font-semibold transition-colors hover:opacity-90"
          >
            Voir nos services
          </a>
        </div>
      </div>
    </div>
  )
}
