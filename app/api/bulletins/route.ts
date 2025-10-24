import { NextResponse } from "next/server"
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

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      console.warn("[v0] Pas de session valide :", session)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // 🧩 Étape 1 : récupérer les bulletins liés à ce userId
    const bulletins = await query<BulletinRow[]>(
      `SELECT * FROM bulletins 
       WHERE userId = ? 
       ORDER BY date DESC`,
      [session.userId],
    )

    // 🧩 Étape 2 : récupérer les composants et déductions pour chaque bulletin
    const bulletinsWithDetails = await Promise.all(
      bulletins.map(async (bulletin) => {
        const salaryComponents = await query<SalaryComponentRow[]>(
          "SELECT label, base, rate, amount FROM salary_components WHERE bulletinId = ?",
          [bulletin.id],
        )

        const deductions = await query<DeductionRow[]>(
          "SELECT label, amount FROM deductions WHERE bulletinId = ?",
          [bulletin.id],
        )

        return {
          ...bulletin,
          salaryComponents,
          deductions,
          grossSalary: Number(bulletin.grossSalary),
          totalDeductions: Number(bulletin.totalDeductions),
          netSalary: Number(bulletin.netSalary),
        }
      }),
    )

    return NextResponse.json({ bulletins: bulletinsWithDetails })
  } catch (error) {
    console.error("[v0] Error fetching bulletins:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
