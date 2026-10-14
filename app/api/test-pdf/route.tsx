import { NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import TestDocument from '@/lib/pdf/test-pdf'

export async function GET() {
  const startTime = Date.now()

  try {
    // Génération du PDF
    const pdfStream = await pdf(<TestDocument />).toBuffer()

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`PDF généré en ${duration}ms`)

    return new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-dz-multiservices.pdf"',
        'X-PDF-Generation-Time': `${duration}ms`,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la génération PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération PDF', details: String(error) },
      { status: 500 }
    )
  }
}
