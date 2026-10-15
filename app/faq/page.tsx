import { createClient } from '@/lib/supabase/server'

export default async function FAQPage() {
  const supabase = await createClient()

  // Get published FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
    .returns<any[]>()

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Questions fréquentes
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Trouvez les réponses aux questions les plus courantes
        </p>

        {faqs && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq: any) => (
              <div key={faq.id} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune FAQ disponible pour le moment.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Vous ne trouvez pas votre réponse ?
          </p>
          <a
            href="/contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-primary-foreground font-semibold transition-colors hover:opacity-90"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  )
}
