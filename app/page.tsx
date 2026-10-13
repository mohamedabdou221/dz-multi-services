export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background font-texte">
      <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-4 sm:px-16">
        <div className="flex flex-col items-center gap-8 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight text-foreground">
            Dz Multi-Services
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Plus qu'un service, une solution.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Plateforme de services (devis et commandes) pour clients locaux et diaspora aux Comores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-8 text-primary-foreground font-semibold transition-colors hover:opacity-90"
              href="#services"
            >
              Découvrir nos services
            </a>
            <a
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-foreground px-8 text-foreground font-semibold transition-colors hover:bg-secondary hover:text-secondary-foreground"
              href="#contact"
            >
              Commander pour un proche
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
