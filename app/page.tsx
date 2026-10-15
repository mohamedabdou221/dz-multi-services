import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 sm:px-16 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight text-foreground mb-4">
        Dz Multi-Services
      </h1>
      <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
        Plus qu'un service, une solution.
      </p>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        Plateforme de services (devis et commandes) pour clients locaux et diaspora aux Comores.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          href="/services"
          className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-8 text-primary-foreground font-semibold transition-colors hover:opacity-90"
        >
          Découvrir nos services
        </Link>
        <Link
          href="/contact"
          className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-foreground px-8 text-foreground font-semibold transition-colors hover:bg-secondary hover:text-secondary-foreground"
        >
          Commander pour un proche
        </Link>
      </div>
      <div>
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Connexion administrateur
        </Link>
      </div>
    </div>
  );
}
