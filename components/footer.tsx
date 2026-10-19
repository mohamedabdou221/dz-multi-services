import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
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

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
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
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{agencyAddress}</span>
                </div>
              )}
              {agencyPhone && (
                <a
                  href={`tel:${agencyPhone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.286 3 8V5z" />
                  </svg>
                  {agencyPhone}
                </a>
              )}
              {agencyEmail && (
                <a
                  href={`mailto:${agencyEmail}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
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
  )
}
