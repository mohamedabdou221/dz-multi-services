import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ServicesPage() {
  const supabase = await createClient()

  // Get services with categories
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('sort_order')
    .returns<any[]>()

  // Get categories
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .returns<any[]>()

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Nos Services
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Découvrez notre gamme complète de services pour vos événements et besoins
        </p>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Catégories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/services?category=${category.slug}`}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
                  {service.icon && (
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  {service.short_description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.short_description}
                    </p>
                  )}
                  {service.service_categories && (
                    <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                      {service.service_categories.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucun service disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
