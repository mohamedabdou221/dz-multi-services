/**
 * Script pour lire et afficher les migrations Supabase
 *
 * Utilisation :
 * node scripts/apply-migrations.js
 *
 * Ce script lit les fichiers de migration et affiche le SQL à copier-coller
 * dans l'interface SQL Editor de Supabase.
 *
 * Instructions:
 * 1. Exécutez ce script
 * 2. Pour chaque migration affichée:
 *    - Allez sur https://supabase.com/dashboard/project/sfpiifgzyzgdolldixum/sql
 *    - Cliquez sur "New Query"
 *    - Copiez le SQL affiché et collez-le dans l'éditeur
 *    - Cliquez sur "Run"
 * 3. Répétez pour chaque migration dans l'ordre
 */

const fs = require('fs')
const path = require('path')

const migrations = [
  { file: 'supabase/migrations/0001_schema.sql', name: 'Schema (types, tables, contraintes)' },
  { file: 'supabase/migrations/0002_functions_triggers.sql', name: 'Functions & Triggers' },
  { file: 'supabase/migrations/0003_security.sql', name: 'Security (RLS, droits)' },
  { file: 'supabase/migrations/0004_seed.sql', name: 'Seed data (données de départ)' }
]

function readMigration(migration) {
  const fullPath = path.join(process.cwd(), migration.file)

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Fichier de migration introuvable: ${migration.file}`)
    return null
  }

  return fs.readFileSync(fullPath, 'utf8')
}

function main() {
  console.log('� Instructions pour appliquer les migrations Supabase')
  console.log('')
  console.log('📍 Projet: https://supabase.com/dashboard/project/sfpiifgzyzgdolldixum/sql')
  console.log('')
  console.log('📋 Ordre d\'application:')
  console.log('')

  migrations.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration.name}`)
    console.log(`   Fichier: ${migration.file}`)
    console.log('')
  })

  console.log('='.repeat(80))
  console.log('')
  console.log('📄 Contenu des migrations à copier-coller:')
  console.log('')

  migrations.forEach((migration, index) => {
    const sql = readMigration(migration)

    if (!sql) {
      return
    }

    console.log('─'.repeat(80))
    console.log(`📄 Migration ${index + 1}/${migrations.length}: ${migration.name}`)
    console.log('─'.repeat(80))
    console.log('')
    console.log(sql)
    console.log('')
    console.log('─'.repeat(80))
    console.log('')
    console.log('✅ Copiez le SQL ci-dessus et collez-le dans SQL Editor, puis cliquez sur "Run"')
    console.log('')
    console.log('Appuyez sur Entrée pour continuer vers la migration suivante...')
    console.log('')

    // Pause pour permettre à l'utilisateur de lire
    // Commentez les lignes ci-dessous si vous voulez tout afficher d'un coup
    if (index < migrations.length - 1) {
      // Sans pause en mode non-interactif
    }
  })

  console.log('🎉 Toutes les migrations ont été affichées !')
  console.log('')
  console.log('📝 Instructions finales:')
  console.log('1. Allez sur https://supabase.com/dashboard/project/sfpiifgzyzgdolldixum/sql')
  console.log('2. Pour chaque migration ci-dessus:')
  console.log('   - Créez une nouvelle requête')
  console.log('   - Collez le SQL')
  console.log('   - Cliquez sur "Run"')
  console.log('3. Attendez que chaque migration se termine avant de passer à la suivante')
}

main()
