import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/session"

interface BulletinRow {
  id: string
  userId: string
  title: string
  period: string
  date: string
  fileSize: string
  status: string
  employeeNumber: string
  employeeName: string
  department: string
  position: string
  category: string
  grossSalary: number
  totalDeductions: number
  netSalary: number
}

interface SalaryComponentRow {
  label: string
  base: number
  rate: number
  amount: number
}

interface DeductionRow {
  label: string
  amount: number
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = params

    // 🧩 Récupération du bulletin pour cet ID, appartenant à l'utilisateur connecté
    const bulletins = await query<BulletinRow[]>(
      `SELECT * FROM bulletins WHERE id = ? AND userId = ? LIMIT 1`,
      [id, session.userId],
    )

    if (!bulletins || bulletins.length === 0) {
      return NextResponse.json({ error: "Bulletin non trouvé" }, { status: 404 })
    }

    const bulletin = bulletins[0]

    // 🔹 Récupération des composantes salariales
    const salaryComponents = await query<SalaryComponentRow[]>(
      `SELECT label, base, rate, amount FROM salary_components WHERE bulletinId = ?`,
      [bulletin.id],
    )

    // 🔹 Récupération des déductions
    const deductions = await query<DeductionRow[]>(
      `SELECT label, amount FROM deductions WHERE bulletinId = ?`,
      [bulletin.id],
    )

    const bulletinWithDetails = {
      ...bulletin,
      salaryComponents,
      deductions,
      grossSalary: Number(bulletin.grossSalary),
      totalDeductions: Number(bulletin.totalDeductions),
      netSalary: Number(bulletin.netSalary),
    }

    return NextResponse.json({ bulletin: bulletinWithDetails })
  } catch (error) {
    console.error("[v0] Error fetching bulletin:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
