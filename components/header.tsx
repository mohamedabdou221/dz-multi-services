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

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-heading font-bold text-2xl">Dz</span>
            </div>
            <div>
              <span className="text-xl font-heading font-bold text-foreground block">
                {agencyName}
              </span>
              <span className="text-xs text-muted-foreground block tracking-wide uppercase">
                Multi-Services
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-primary hover:opacity-90 transition-colors"
              >
                Mon Dashboard
              </Link>
            )}
          </nav>

          {/* Contact info */}
          <div className="hidden xl:flex items-center gap-6 text-sm">
            {agencyPhone && (
              <a
                href={`tel:${agencyPhone}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.286 3 8V5z" />
                </svg>
                {agencyPhone}
              </a>
            )}
            {agencyEmail && (
              <a
                href={`mailto:${agencyEmail}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {agencyEmail}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-foreground hover:text-primary transition-colors">
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
