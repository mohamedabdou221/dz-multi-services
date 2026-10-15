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
  const agencyCity = (settingsMap.get('agency_city') as string) || ''
  const agencyCountry = (settingsMap.get('agency_country') as string) || ''

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-heading font-bold text-foreground mb-4">
              {agencyName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plus qu'un service, une solution.
            </p>
            {agencyAddress && (
              <p className="text-sm text-muted-foreground mb-2">
                {agencyAddress}
                {agencyCity && `, ${agencyCity}`}
                {agencyCountry && `, ${agencyCountry}`}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              {agencyPhone && (
                <li>
                  <a
                    href={`tel:${agencyPhone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {agencyPhone}
                  </a>
                </li>
              )}
              {agencyEmail && (
                <li>
                  <a
                    href={`mailto:${agencyEmail}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {agencyEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Liens</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {agencyName}. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link
              href="/legal/mentions"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/legal/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
