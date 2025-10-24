import { prisma } from "./prisma"
import type { Bulletin } from "./types"

/**
 * Get all bulletins for a user
 */
export async function getBulletinsByUserId(userId: string): Promise<Bulletin[]> {
  const bulletins = await prisma.bulletin.findMany({
    where: { userId },
    include: {
      salaryComponents: true,
      deductions: true,
    },
    orderBy: { date: "desc" },
  })

  return bulletins.map((bulletin) => ({
    id: bulletin.id,
    userId: bulletin.userId,
    title: bulletin.title,
    period: bulletin.period,
    date: bulletin.date.toISOString(),
    fileSize: bulletin.fileSize,
    status: bulletin.status as "available" | "pending",
    employeeNumber: bulletin.employeeNumber,
    employeeName: bulletin.employeeName,
    department: bulletin.department,
    position: bulletin.position,
    category: bulletin.category,
    salaryComponents: bulletin.salaryComponents.map((sc) => ({
      label: sc.label,
      base: sc.base,
      rate: sc.rate,
      amount: sc.amount,
    })),
    deductions: bulletin.deductions.map((d) => ({
      label: d.label,
      amount: d.amount,
    })),
    grossSalary: bulletin.grossSalary,
    totalDeductions: bulletin.totalDeductions,
    netSalary: bulletin.netSalary,
  }))
}

/**
 * Get a specific bulletin by ID
 */
export async function getBulletinById(bulletinId: string): Promise<Bulletin | null> {
  const bulletin = await prisma.bulletin.findUnique({
    where: { id: bulletinId },
    include: {
      salaryComponents: true,
      deductions: true,
    },
  })

  if (!bulletin) return null

  return {
    id: bulletin.id,
    userId: bulletin.userId,
    title: bulletin.title,
    period: bulletin.period,
    date: bulletin.date.toISOString(),
    fileSize: bulletin.fileSize,
    status: bulletin.status as "available" | "pending",
    employeeNumber: bulletin.employeeNumber,
    employeeName: bulletin.employeeName,
    department: bulletin.department,
    position: bulletin.position,
    category: bulletin.category,
    salaryComponents: bulletin.salaryComponents.map((sc) => ({
      label: sc.label,
      base: sc.base,
      rate: sc.rate,
      amount: sc.amount,
    })),
    deductions: bulletin.deductions.map((d) => ({
      label: d.label,
      amount: d.amount,
    })),
    grossSalary: bulletin.grossSalary,
    totalDeductions: bulletin.totalDeductions,
    netSalary: bulletin.netSalary,
  }
}

/**
 * Create a new bulletin with salary components and deductions
 */
export async function createBulletin(data: {
  userId: string
  title: string
  period: string
  date: Date
  fileSize: string
  status?: string
  employeeNumber: string
  employeeName: string
  department: string
  position: string
  category: string
  salaryComponents: Array<{
    label: string
    base: number
    rate: number
    amount: number
  }>
  deductions: Array<{
    label: string
    amount: number
  }>
  grossSalary: number
  totalDeductions: number
  netSalary: number
}): Promise<Bulletin> {
  const bulletin = await prisma.bulletin.create({
    data: {
      userId: data.userId,
      title: data.title,
      period: data.period,
      date: data.date,
      fileSize: data.fileSize,
      status: data.status || "available",
      employeeNumber: data.employeeNumber,
      employeeName: data.employeeName,
      department: data.department,
      position: data.position,
      category: data.category,
      grossSalary: data.grossSalary,
      totalDeductions: data.totalDeductions,
      netSalary: data.netSalary,
      salaryComponents: {
        create: data.salaryComponents,
      },
      deductions: {
        create: data.deductions,
      },
    },
    include: {
      salaryComponents: true,
      deductions: true,
    },
  })

  return {
    id: bulletin.id,
    userId: bulletin.userId,
    title: bulletin.title,
    period: bulletin.period,
    date: bulletin.date.toISOString(),
    fileSize: bulletin.fileSize,
    status: bulletin.status as "available" | "pending",
    employeeNumber: bulletin.employeeNumber,
    employeeName: bulletin.employeeName,
    department: bulletin.department,
    position: bulletin.position,
    category: bulletin.category,
    salaryComponents: bulletin.salaryComponents.map((sc) => ({
      label: sc.label,
      base: sc.base,
      rate: sc.rate,
      amount: sc.amount,
    })),
    deductions: bulletin.deductions.map((d) => ({
      label: d.label,
      amount: d.amount,
    })),
    grossSalary: bulletin.grossSalary,
    totalDeductions: bulletin.totalDeductions,
    netSalary: bulletin.netSalary,
  }
}
