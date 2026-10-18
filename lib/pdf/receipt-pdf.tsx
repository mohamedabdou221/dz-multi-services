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

interface ReceiptPDFProps {
  receipt: {
    reference: string
    amount: number
    payment_method: string
    payment_date: string
    quote_reference: string
  }
  client: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  agency: {
    name: string
    phone: string
    email: string
    address: string
  }
}

export function ReceiptPDF({
  receipt,
  client,
  agency,
}: ReceiptPDFProps) {
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
        <Text style={styles.title}>REÇU DE PAIEMENT</Text>
        <Text style={[styles.text, { textAlign: 'center', marginBottom: 20 }]}>
          Référence: {receipt.reference}
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

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du paiement</Text>
          <Text style={styles.text}>Référence du devis: {receipt.quote_reference}</Text>
          <Text style={styles.text}>
            Mode de paiement: {receipt.payment_method}
          </Text>
          <Text style={styles.text}>
            Date de paiement: {new Date(receipt.payment_date).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Montant payé</Text>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', color: '#8C0028' }]}>
            {receipt.amount.toLocaleString('fr-FR')} KMF
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {agency.name} - {agency.address} - Tél: {agency.phone} - Email:{' '}
          {agency.email}
        </Text>
      </Page>
    </Document>
  )
}
