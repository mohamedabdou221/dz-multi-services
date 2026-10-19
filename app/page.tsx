import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function HomePage() {
  const supabase = await createClient()

  // Get public settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('is_public', true)
    .returns<{ key: string; value: unknown }[]>()

  const settingsMap = new Map(
    settings?.map(s => [s.key, s.value]) || []
  )

  const agencyName = (settingsMap.get('agency_name') as string) || 'Dz Multi-Services'
  const agencyPhone = (settingsMap.get('agency_phone') as string) || ''
  const agencyEmail = (settingsMap.get('agency_email') as string) || ''
  const agencyAddress = (settingsMap.get('agency_address') as string) || ''

  // Get services
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        id,
        name,
        slug,
        icon
      )
    `)
    .order('name')
    .returns<any[]>() as any

  return (
    <div className="min-h-screen">
      {/* Top Announcement Bar */}
      <div className="bg-secondary text-secondary-foreground text-xs py-2.5 px-6 tracking-wide border-b border-white/10">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              📞 {agencyPhone}
            </span>
            <span className="hidden md:flex items-center gap-1.5 opacity-80">
              ✉️ {agencyEmail}
            </span>
            <span className="hidden lg:flex items-center gap-1.5 opacity-80">
              📍 {agencyAddress}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/40 border border-primary/50 text-[#ffb2b7] font-semibold text-[11px]">
              🌍 Diaspora : Commandez sereinement pour vos proches
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[rgba(245, 243, 236, 0.92)] backdrop-blur-md border-b border-[#E5E2DA] transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-heading font-bold text-2xl">Dz</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-foreground">
                {agencyName}
              </span>
              <span className="text-xs text-muted-foreground tracking-wide uppercase">
                Multi-Services
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="#accueil"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-background transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/wedding-form"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative overflow-hidden py-24 lg:py-32 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-sm font-semibold text-primary">
                  La passerelle de confiance Union des Comores & Diaspora
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight">
                Plus qu'un service,
                <br />
                <span className="text-primary">une solution</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Commandez sereinement des services professionnels pour vos proches aux Comores depuis la diaspora. Photographie, imprimerie, publicité et bien plus encore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/wedding-form"
                  className="px-8 py-4 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 text-center"
                >
                  Commander pour un proche
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 text-base font-semibold text-foreground border border-border rounded-xl hover:bg-background transition-colors text-center"
                >
                  Voir nos services
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">
                        Suivre une commande
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Entrez votre référence
                      </p>
                    </div>
                  </div>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Ex: REQ-123456"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full px-6 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors"
                    >
                      Rechercher
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-card">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Nos Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre gamme complète de services professionnels pour tous vos besoins
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="px-6 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl transition-colors">
              Tous
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-muted-foreground bg-background border border-border rounded-xl hover:bg-border transition-colors">
              Photographie
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-muted-foreground bg-background border border-border rounded-xl hover:bg-border transition-colors">
              Imprimerie
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-muted-foreground bg-background border border-border rounded-xl hover:bg-border transition-colors">
              Publicité
            </button>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service: any) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-background border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="text-3xl">{service.icon || '✨'}</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                  {service.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  <span>En savoir plus</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un processus simple et sécurisé pour commander des services pour vos proches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-4xl">1</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground">
                Faites votre demande
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Remplissez le formulaire de demande avec les détails du service souhaité
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-4xl">2</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground">
                Recevez un devis
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Notre équipe vous envoie un devis personnalisé dans les 24h
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-4xl">3</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground">
                Paiement sécurisé
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Payez via RIA, Mobile Money ou Western Union en toute sécurité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-card">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
                  Contactez-nous
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">{agencyPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">{agencyEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                    <p className="text-muted-foreground">{agencyAddress}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-heading font-bold text-xl">Dz</span>
                </div>
                <div>
                  <span className="text-lg font-heading font-bold text-secondary-foreground block">
                    {agencyName}
                  </span>
                  <span className="text-xs text-muted-foreground block tracking-wide uppercase">
                    Multi-Services
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plus qu'un service, une solution. Votre partenaire de confiance pour tous vos besoins aux Comores et dans la diaspora.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
                Contact
              </h3>
              <div className="space-y-3">
                {agencyAddress && (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-xl">📍</span>
                    <span>{agencyAddress}</span>
                  </div>
                )}
                {agencyPhone && (
                  <a
                    href={`tel:${agencyPhone}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                  >
                    <span className="text-xl">📞</span>
                    {agencyPhone}
                  </a>
                )}
                {agencyEmail && (
                  <a
                    href={`mailto:${agencyEmail}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                  >
                    <span className="text-xl">✉️</span>
                    {agencyEmail}
                  </a>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
                Navigation
              </h3>
              <div className="space-y-3">
                <Link
                  href="/services"
                  className="block text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  Comment ça marche
                </Link>
                <Link
                  href="/about"
                  className="block text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  À propos
                </Link>
                <Link
                  href="/faq"
                  className="block text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {agencyName}. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link
                href="/legal/mentions"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/legal/privacy"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
