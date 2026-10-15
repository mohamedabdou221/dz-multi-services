import { createClient } from '@/lib/supabase/server'

export default async function AboutPage() {
  const supabase = await createClient()

  // Get agency info from settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('is_public', true)
    .returns<{ key: string; value: unknown }[]>()

  const settingsMap = new Map(
    settings?.map((s: { key: string; value: unknown }) => [s.key, s.value]) || []
  )

  const agencyName = (settingsMap.get('agency_name') as string) || 'Dz Multi-Services'
  const agencyAddress = (settingsMap.get('agency_address') as string) || ''
  const agencyCity = (settingsMap.get('agency_city') as string) || ''
  const agencyCountry = (settingsMap.get('agency_country') as string) || ''

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          À propos de nous
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {agencyName} : Plus qu'un service, une solution.
        </p>

        <div className="prose prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Notre mission
            </h2>
            <p className="text-muted-foreground">
              Nous offrons une gamme complète de services pour accompagner les Comoriens, 
              locaux et de la diaspora, dans leurs moments importants. Notre engagement est de fournir 
              un service de qualité supérieure avec professionnalisme et attention aux détails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Nos valeurs
            </h2>
            <ul className="text-muted-foreground space-y-2">
              <li>• Professionnalisme et qualité</li>
              <li>• Respect des délais</li>
              <li>• Satisfaction client</li>
              <li>• Innovation et modernité</li>
              <li>• Proximité et disponibilité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Nos services
            </h2>
            <p className="text-muted-foreground">
              Nous proposons des services de photographie, de publicité, d'imprimerie, 
              et bien d'autres pour répondre à tous vos besoins événementiels et professionnels.
            </p>
          </section>

          {agencyAddress && (
            <section>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                Notre localisation
              </h2>
              <p className="text-muted-foreground">
                {agencyAddress}
                {agencyCity && `, ${agencyCity}`}
                {agencyCountry && `, ${agencyCountry}`}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
