import { NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { QuotePDF } from '@/lib/pdf/quote-pdf'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const quoteId = searchParams.get('quote_id')

  if (!quoteId) {
    return NextResponse.json({ error: 'quote_id parameter is required' }, { status: 400 })
  }

  try {
    // TODO: Fetch quote, client, request, and agency data from Supabase
    // For now, return a placeholder response
    const quote = {
      reference: 'DEV-001',
      total_amount: 500000,
      deposit_amount: 250000,
      valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Notes du devis',
      items: [
        {
          description: 'Photographie mariage',
          quantity: 1,
          unit_price: 300000,
          total: 300000,
        },
        {
          description: 'Album photo',
          quantity: 1,
          unit_price: 200000,
          total: 200000,
        },
      ],
    }

    const client = {
      first_name: 'Jean',
      last_name: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+269 123 45 67',
    }

    const request = {
      reference: 'REQ-001',
      service_type: 'Photographie',
    }

    const agency = {
      name: 'Dz Multi-Services',
      phone: '+269 777 77 77',
      email: 'contact@dzmultiservices.com',
      address: 'Moroni, Comores',
    }

    const pdfStream = await pdf(<QuotePDF quote={quote} client={client} request={request} agency={agency} />).toBlob()

    return new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${quote.reference}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
