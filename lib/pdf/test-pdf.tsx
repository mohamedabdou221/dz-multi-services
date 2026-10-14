import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #8C0028',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C0028',
    marginBottom: 10,
  },
  content: {
    fontSize: 12,
    color: '#101010',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: '#2B2B2B',
    textAlign: 'center',
  },
})

export default function TestDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Dz Multi-Services</Text>
          <Text>Test de génération PDF</Text>
        </View>
        <View style={styles.content}>
          <Text>Ceci est un test pour vérifier que la génération PDF fonctionne correctement.</Text>
          <Text>En production, ce document contiendra :</Text>
          <Text>- Des devis avec en-tête et cachet</Text>
          <Text>- Des fiches de prestation de mariage</Text>
          <Text>- Des reçus de paiement</Text>
        </View>
        <View style={styles.footer}>
          <Text>Plus qu'un service, une solution.</Text>
        </View>
      </Page>
    </Document>
  )
}
