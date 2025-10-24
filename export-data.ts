const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function exportAllData() {
  try {
    console.log('🔄 Exportation des données MySQL...\n')

    const users = await prisma.user.findMany()
    const bulletins = await prisma.bulletin.findMany()
    const connectionLogs = await prisma.connectionLog.findMany()

    const exportData = {
      users,
      bulletins,
      connectionLogs,
      exportDate: new Date().toISOString(),
      totalRecords: users.length + bulletins.length + connectionLogs.length
    }

    fs.writeFileSync('mysql-backup.json', JSON.stringify(exportData, null, 2))

    console.log('✅ Données exportées avec succès !')
    console.log(`📊 Statistiques :`)
    console.log(`   - Utilisateurs : ${users.length}`)
    console.log(`   - Bulletins : ${bulletins.length}`)
    console.log(`   - Logs de connexion : ${connectionLogs.length}`)
    console.log(`   - Total : ${exportData.totalRecords} enregistrements`)
    console.log(`\n💾 Fichier : mysql-backup.json`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'exportation :', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportAllData()
