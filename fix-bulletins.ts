// fix-bulletins.ts
// Script pour réassigner tous les bulletins à un utilisateur spécifique

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixBulletins() {
  try {
    console.log('🔄 Réassignation des bulletins...\n')

    // 1. Trouvez l'utilisateur SOPH001
    const user = await prisma.user.findUnique({
      where: { identifier: 'SOPH001' }
    })

    if (!user) {
      console.error('❌ Utilisateur SOPH001 non trouvé !')
      process.exit(1)
    }

    console.log(`✅ Utilisateur trouvé: ${user.firstName} ${user.lastName}`)
    console.log(`   ID: ${user.id}\n`)

    // 2. Listez tous les bulletins
    const bulletins = await prisma.bulletin.findMany()
    console.log(`📊 ${bulletins.length} bulletins trouvés\n`)

    // 3. Réassignez tous les bulletins à SOPH001
    const result = await prisma.bulletin.updateMany({
      data: {
        userId: user.id
      }
    })

    console.log(`✅ ${result.count} bulletins réassignés à ${user.firstName} ${user.lastName}`)
    console.log('\n🎉 Opération terminée !')

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixBulletins()