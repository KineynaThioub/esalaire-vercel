import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { createSession, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] === DEBUT LOGIN ===')
    
    // Étape 1: Lire le body
    const body = await request.json()
    console.log('[v0] Body reçu:', { identifier: body.identifier, passwordLength: body.password?.length })

    const { identifier, password } = body

    // Étape 2: Validation
    if (!identifier || !password) {
      console.log('[v0] ❌ Données manquantes')
      return NextResponse.json(
        { error: 'Identifiant et mot de passe requis' },
        { status: 400 }
      )
    }

    const prisma = await getPrismaClient()

    // Étape 3: Rechercher l'utilisateur
    console.log('[v0] Recherche utilisateur:', identifier)
    const user = await prisma.user.findUnique({
      where: { identifier: identifier.trim() }
    })

    if (!user) {
      console.log('[v0] ❌ Utilisateur non trouvé')
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    console.log('[v0] ✅ Utilisateur trouvé:', user.identifier)
    console.log('[v0] Hash stocké (début):', user.password.substring(0, 20))

    // Étape 4: Vérifier le mot de passe
    console.log('[v0] Vérification du mot de passe...')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('[v0] Mot de passe valide?', isPasswordValid)

    if (!isPasswordValid) {
      console.log('[v0] ❌ Mot de passe incorrect')
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Étape 5: Créer le log de connexion
    console.log('[v0] Création du log de connexion...')
    await prisma.connectionLog.create({
      data: {
        userId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    console.log('[v0] ✅ Log créé')

    // Étape 6: Créer la session
    console.log('[v0] Création de la session...')
    const sessionData = {
      userId: user.id,
      identifier: user.identifier,
      firstName: user.firstName,
      lastName: user.lastName,
      loginTime: new Date().toISOString()
    }

    const token = await createSession(sessionData)
    console.log('[v0] ✅ Token créé')

    await setSessionCookie(token)
    console.log('[v0] ✅ Cookie défini')

    // Étape 7: Retourner la réponse
    console.log('[v0] === FIN LOGIN (SUCCESS) ===')
    return NextResponse.json({
      user: {
        id: user.id,
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        position: user.position,
      }
    })

  } catch (error) {
    console.error('[v0] === ERREUR LOGIN ===')
    console.error('[v0] Type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('[v0] Message:', error instanceof Error ? error.message : String(error))
    console.error('[v0] Stack:', error instanceof Error ? error.stack : 'N/A')
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    )
  }
}