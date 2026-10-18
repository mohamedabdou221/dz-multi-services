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

interface TechnicalSheetPDFProps {
  request: {
    reference: string
    service_type: string
    description: string
    preferred_date: string
    metadata?: any
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

export function TechnicalSheetPDF({
  request,
  client,
  agency,
}: TechnicalSheetPDFProps) {
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
        <Text style={styles.title}>FICHE TECHNIQUE</Text>
        <Text style={[styles.text, { textAlign: 'center', marginBottom: 20 }]}>
          Référence: {request.reference}
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

        {/* Request Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de la demande</Text>
          <Text style={styles.text}>Type de service: {request.service_type}</Text>
          <Text style={styles.text}>
            Date souhaitée:{' '}
            {new Date(request.preferred_date).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>{request.description || 'Aucune description'}</Text>
        </View>

        {/* Additional Info */}
        {request.metadata && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
            <Text style={styles.text}>
              {JSON.stringify(request.metadata, null, 2)}
            </Text>
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
