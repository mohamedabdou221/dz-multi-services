import { createClient } from '@/lib/supabase/server'

export default async function TermsPage() {
  const supabase = await createClient()

  // Get payment settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('is_public', true)
    .returns<{ key: string; value: unknown }[]>()

  const settingsMap = new Map(
    settings?.map((s: { key: string; value: unknown }) => [s.key, s.value]) || []
  )

  const depositPercent = (settingsMap.get('deposit_percent') as number) || 30
  const quoteValidity = (settingsMap.get('quote_validity_hours') as number) || 24

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Conditions générales de vente
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Nos conditions de vente et de prestation
        </p>

        <div className="prose prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Objet
            </h2>
            <p className="text-muted-foreground">
              Les présentes conditions générales de vente (CGV) régissent les relations 
              contractuelles entre Dz Multi-Services et ses clients pour la prestation 
              de services événementiels et connexes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Demande de devis
            </h2>
            <p className="text-muted-foreground">
              Toute demande de service doit être formulée via notre formulaire en ligne 
              ou par contact direct. Un devis détaillé sera envoyé au client sous {quoteValidity} heures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Acceptation du devis
            </h2>
            <p className="text-muted-foreground">
              Le devis est valide pendant {quoteValidity} heures à compter de son envoi. 
              Son acceptation par le client (signature ou paiement de l'acompte) vaut 
              conclusion du contrat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Modalités de paiement
            </h2>
            <p className="text-muted-foreground">
              Le paiement s'effectue en deux étapes :
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Acompte de {depositPercent}% à la signature du devis</li>
              <li>• Solde à la livraison ou réalisation du service</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Les modes de paiement acceptés sont : espèces, transfert bancaire, 
              Mobile Money, RIA, Western Union (pour la diaspora).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Annulation
            </h2>
            <p className="text-muted-foreground">
              En cas d'annulation par le client :
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Plus de 7 jours avant : remboursement intégral de l'acompte</li>
              <li>• Entre 3 et 7 jours : remboursement de 50% de l'acompte</li>
              <li>• Moins de 3 jours : aucun remboursement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Exécution du service
            </h2>
            <p className="text-muted-foreground">
              Dz Multi-Services s'engage à réaliser la prestation conformément au devis 
              accepté et dans les délais convenus. Le client s'engage à fournir toutes 
              les informations nécessaires à la bonne exécution du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Force majeure
            </h2>
            <p className="text-muted-foreground">
              Dz Multi-Services ne peut être tenu responsable des retards ou de 
              l'inexécution du service dus à des cas de force majeure (conditions 
              météorologiques, grèves, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Réclamations
            </h2>
            <p className="text-muted-foreground">
              Toute réclamation doit être formulée par écrit dans un délai de 7 jours 
              après la réalisation du service. Elle sera examinée et traitée dans les 
              plus brefs délais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Droit applicable
            </h2>
            <p className="text-muted-foreground">
              Les présentes CGV sont régies par le droit comorien. Tout litige sera 
              soumis aux tribunaux compétents de Moroni.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
