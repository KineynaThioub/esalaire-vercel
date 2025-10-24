import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Test 1: Connexion à la base de données...')
    await prisma.$connect()
    console.log('✅ Connexion réussie!')

    console.log('\n🔍 Test 2: Recherche de l\'utilisateur SOPH001...')
    const user = await prisma.user.findUnique({
      where: { identifier: 'SOPH001' }
    })

    if (!user) {
      console.log('❌ Utilisateur SOPH001 non trouvé!')
      return
    }

    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      identifier: user.identifier,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: user.password.substring(0, 20) + '...'
    })

    console.log('\n🔍 Test 3: Vérification du mot de passe...')
    const isValid = await bcrypt.compare('password123', user.password)
    
    if (isValid) {
      console.log('✅ Mot de passe valide!')
    } else {
      console.log('❌ Mot de passe invalide!')
      console.log('Le hash stocké commence par:', user.password.substring(0, 10))
    }

    console.log('\n🔍 Test 4: Création d\'un nouveau hash pour comparaison...')
    const newHash = await bcrypt.hash('password123', 10)
    console.log('Nouveau hash:', newHash.substring(0, 20) + '...')
    const isNewHashValid = await bcrypt.compare('password123', newHash)
    console.log('Nouveau hash valide?', isNewHashValid ? '✅' : '❌')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()