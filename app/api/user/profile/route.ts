import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/session"

interface UserRow {
  id: string
  identifier: string
  first_name: string
  last_name: string
  email: string
  department: string
  position: string
  created_at: string
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Get user profile
    const users = await query<UserRow[]>(
      "SELECT id, identifier, first_name, last_name, email, department, position, created_at FROM users WHERE id = ? LIMIT 1",
      [session.userId],
    )

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({
      user: {
        id: user.id,
        identifier: user.identifier,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        department: user.department,
        position: user.position,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
