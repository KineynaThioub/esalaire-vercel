// import-data.ts
// Script pour importer les données MySQL exportées vers PostgreSQL

import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()

async function importAllData() {
  try {
    console.log('🔄 Importation des données dans PostgreSQL...\n')

    // Lecture du fichier JSON
    const rawData = readFileSync('mysql-backup.json', 'utf-8')
    const data = JSON.parse(rawData)

    // Vérification des clés présentes
    const users = data.users ?? []
    const bulletins = data.bulletins ?? []
    const logs = data.connectionLogs ?? data.loginLogs ?? []

    console.log(`📊 Données détectées :`)
    console.log(`   - Utilisateurs : ${users.length}`)
    console.log(`   - Bulletins : ${bulletins.length}`)
    console.log(`   - Logs : ${logs.length}\n`)

    // --- Import des utilisateurs ---
    if (users.length > 0) {
      console.log('👥 Import des utilisateurs...')
      for (const user of users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            identifier: user.identifier,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            department: user.department,
            position: user.position,
            createdAt: new Date(user.createdAt),
          },
          create: {
            id: user.id,
            identifier: user.identifier,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            department: user.department,
            position: user.position,
            createdAt: new Date(user.createdAt),
          },
        })
      }
      console.log('✅ Utilisateurs importés\n')
    } else {
      console.log('⚠️  Aucun utilisateur trouvé\n')
    }

    // --- Import des bulletins ---
    if (bulletins.length > 0) {
      console.log('📄 Import des bulletins...')
      for (const bulletin of bulletins) {
        await prisma.bulletin.upsert({
          where: { id: bulletin.id },
          update: {
            userId: bulletin.userId,
            title: bulletin.title,
            period: bulletin.period,
            date: new Date(bulletin.date),
            fileSize: bulletin.fileSize,
            status: bulletin.status,
            employeeNumber: bulletin.employeeNumber,
            employeeName: bulletin.employeeName,
            department: bulletin.department,
            position: bulletin.position,
            category: bulletin.category,
            grossSalary: bulletin.grossSalary,
            totalDeductions: bulletin.totalDeductions,
            netSalary: bulletin.netSalary,
            createdAt: new Date(bulletin.createdAt),
          },
          create: {
            id: bulletin.id,
            userId: bulletin.userId,
            title: bulletin.title,
            period: bulletin.period,
            date: new Date(bulletin.date),
            fileSize: bulletin.fileSize,
            status: bulletin.status,
            employeeNumber: bulletin.employeeNumber,
            employeeName: bulletin.employeeName,
            department: bulletin.department,
            position: bulletin.position,
            category: bulletin.category,
            grossSalary: bulletin.grossSalary,
            totalDeductions: bulletin.totalDeductions,
            netSalary: bulletin.netSalary,
            createdAt: new Date(bulletin.createdAt),
          },
        })
      }
      console.log('✅ Bulletins importés\n')
    } else {
      console.log('⚠️  Aucun bulletin trouvé\n')
    }

    // --- Import des logs ---
    if (logs.length > 0) {
      console.log('📝 Import des logs...')
      for (const log of logs) {
        await prisma.connectionLog.create({
          data: {
            id: log.id,
            userId: log.userId,
            timestamp: new Date(log.timestamp),
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            success: log.success,
          },
        })
      }
      console.log('✅ Logs importés\n')
    } else {
      console.log('⚠️  Aucun log trouvé\n')
    }

    console.log('🎉 Importation terminée avec succès !')

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation :')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importAllData()