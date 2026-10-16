import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()

  // Get service by slug
  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()
    .returns<any>()

  if (!service) {
    notFound()
  }

  // @ts-ignore - TypeScript inference issue with nested select
  const serviceData = service as any

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          ← Retour aux services
        </Link>

        {serviceData.service_categories && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded">
              {serviceData.service_categories.name}
            </span>
          </div>
        )}

        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          {serviceData.name}
        </h1>

        {serviceData.icon && (
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
            <span className="text-4xl">{serviceData.icon}</span>
          </div>
        )}

        {serviceData.description && (
          <div className="prose prose max-w-none mb-12">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {serviceData.description}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/wedding-form"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Demander un devis
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 border-2 border-foreground text-foreground rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            Voir les autres services
          </Link>
        </div>
      </div>
    </div>
  )
}
