export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Mentions légales
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Informations légales sur l'entreprise
        </p>

        <div className="prose prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Éditeur du site
            </h2>
            <p className="text-muted-foreground">
              Dz Multi-Services<br />
              Service de prestation événementielle<br />
              Moroni, Comores
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground">
              E-mail : contact@dzmultiservices.com<br />
              Téléphone : +269 XX XX XX XX
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Hébergement
            </h2>
            <p className="text-muted-foreground">
              Ce site est hébergé par Netlify, Inc.<br />
              San Francisco, CA, États-Unis
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-muted-foreground">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) 
              est protégé par le droit d'auteur. Toute reproduction, même partielle, 
              est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Données personnelles
            </h2>
            <p className="text-muted-foreground">
              Les données personnelles collectées sur ce site sont traitées conformément 
              à notre politique de confidentialité. Pour plus d'informations, 
              consultez notre page de confidentialité.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
