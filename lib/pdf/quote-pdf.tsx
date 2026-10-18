import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register Montserrat font
Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw0aXpsog.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr6Hw0aXpsog.woff2',
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    backgroundColor: '#F5F3EC',
    padding: 40,
  },
  header: {
    marginBottom: 30,
  },
  agencyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C0028',
    marginBottom: 10,
  },
  agencyInfo: {
    fontSize: 10,
    color: '#101010',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#101010',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8C0028',
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    color: '#101010',
    marginBottom: 5,
  },
  table: {
    flexDirection: 'column',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD0',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    color: '#101010',
  },
  tableHeader: {
    backgroundColor: '#8C0028',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101010',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
})

interface QuotePDFProps {
  quote: {
    reference: string
    total_amount: number
    deposit_amount: number
    valid_until: string
    notes?: string
    items: Array<{
      description: string
      quantity: number
      unit_price: number
      total: number
    }>
  }
  client: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  request: {
    reference: string
    service_type: string
  }
  agency: {
    name: string
    phone: string
    email: string
    address: string
  }
}

export function QuotePDF({
  quote,
  client,
  request,
  agency,
}: QuotePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.agencyName}>{agency.name}</Text>
          <Text style={styles.agencyInfo}>{agency.address}</Text>
          <Text style={styles.agencyInfo}>Tél: {agency.phone}</Text>
          <Text style={styles.agencyInfo}>Email: {agency.email}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>DEVIS</Text>
        <Text style={[styles.text, { textAlign: 'center', marginBottom: 20 }]}>
          Référence: {quote.reference}
        </Text>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.text}>
            {client.first_name} {client.last_name}
          </Text>
          <Text style={styles.text}>{client.email}</Text>
          <Text style={styles.text}>{client.phone}</Text>
        </View>

        {/* Request Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demande concernée</Text>
          <Text style={styles.text}>Référence: {request.reference}</Text>
          <Text style={styles.text}>Service: {request.service_type}</Text>
        </View>

        {/* Quote Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail des prestations</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Qté</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Prix unitaire</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Total</Text>
            </View>
            {quote.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.unit_price.toLocaleString('fr-FR')} KMF
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.total.toLocaleString('fr-FR')} KMF
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={{ width: '40%' }}>
            <Text style={styles.text}>Total:</Text>
            <Text style={styles.text}>
              {quote.total_amount.toLocaleString('fr-FR')} KMF
            </Text>
            <Text style={styles.text}>
              Acompte (50%): {quote.deposit_amount?.toLocaleString('fr-FR')} KMF
            </Text>
          </View>
        </View>

        {/* Validity */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Validité</Text>
          <Text style={styles.text}>
            Ce devis est valide jusqu'au:{' '}
            {new Date(quote.valid_until).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {agency.name} - {agency.address} - Tél: {agency.phone} - Email:{' '}
          {agency.email}
        </Text>
      </Page>
    </Document>
  )
}
