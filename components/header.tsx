import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
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

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xl">Dz</span>
            </div>
            <span className="text-xl font-heading font-bold text-foreground hidden sm:block">
              {agencyName}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/services"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/faq"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Contact info */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
            {agencyPhone && (
              <a
                href={`tel:${agencyPhone}`}
                className="hover:text-foreground transition-colors"
              >
                {agencyPhone}
              </a>
            )}
            {agencyEmail && (
              <a
                href={`mailto:${agencyEmail}`}
                className="hover:text-foreground transition-colors"
              >
                {agencyEmail}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground hover:text-muted-foreground">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
