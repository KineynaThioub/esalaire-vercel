import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from "@/lib/prisma"


export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json()
    
    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { error: 'Identifiant invalide' },
        { status: 400 }
      )
    }

    const prisma = await getPrismaClient()


    const user = await prisma.user.findUnique({
      where: { identifier: identifier.trim() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        identifier: true
      }
    })

    return NextResponse.json({
      exists: !!user,
      user: user || null
    })
  } catch (error) {
    console.error('[v0] Error checking user:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}