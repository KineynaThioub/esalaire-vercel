import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/session"

interface ConnectionLog {
  id: string
  userId: string
  timestamp: string
  ip_address: string
  user_agent: string
  success: boolean
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Get connection logs for the current user
    const logs = await query<ConnectionLog[]>(
      "SELECT * FROM connection_logs WHERE userId = ? ORDER BY timestamp DESC LIMIT 50",
      [session.identifier],
    )

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[v0] Error fetching logs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
