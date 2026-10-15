export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Comment nous protégeons vos données personnelles
        </p>

        <div className="prose prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Collecte des données
            </h2>
            <p className="text-muted-foreground">
              Nous collectons les données personnelles que vous nous fournissez directement 
              via nos formulaires de contact, de demande de service et de création de compte. 
              Ces données incluent : nom, e-mail, numéro de téléphone, adresse, et informations 
              relatives à vos demandes de services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Utilisation des données
            </h2>
            <p className="text-muted-foreground">
              Vos données sont utilisées pour :
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Traiter vos demandes de services</li>
              <li>• Vous envoyer des devis et factures</li>
              <li>• Communiquer avec vous sur vos demandes</li>
              <li>• Améliorer nos services</li>
              <li>• Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Partage des données
            </h2>
            <p className="text-muted-foreground">
              Nous ne partageons vos données personnelles avec des tiers que dans les cas suivants :
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Avec votre consentement explicite</li>
              <li>• Pour exécuter nos services (prestataires externes)</li>
              <li>• Pour respecter une obligation légale</li>
              <li>• Pour protéger nos droits et intérêts légitimes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Sécurité des données
            </h2>
            <p className="text-muted-foreground">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données contre l'accès non autorisé, la modification, 
              la divulgation ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Vos droits
            </h2>
            <p className="text-muted-foreground">
              Conformément à la législation applicable, vous disposez des droits suivants :
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Droit d'accès à vos données</li>
              <li>• Droit de rectification</li>
              <li>• Droit à l'effacement</li>
              <li>• Droit à la portabilité</li>
              <li>• Droit d'opposition</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Pour exercer ces droits, contactez-nous à : contact@dzmultiservices.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Cookies
            </h2>
            <p className="text-muted-foreground">
              Ce site utilise des cookies pour améliorer votre expérience de navigation. 
              Vous pouvez configurer votre navigateur pour refuser les cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Modifications
            </h2>
            <p className="text-muted-foreground">
              Nous nous réservons le droit de modifier cette politique de confidentialité 
              à tout moment. Les modifications seront publiées sur cette page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
