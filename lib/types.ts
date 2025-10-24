// Type definitions for eSalaire application

export interface User {
  id: string
  identifier: string // Employee ID
  password: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  createdAt: string
}

export interface Bulletin {
  id: string
  userId: string
  title: string
  period: string // e.g., "01-03-21_31-03-21"
  date: string // ISO date string
  fileSize: string // e.g., "27ko"
  status: "available" | "pending"

  // Detailed bulletin information
  employeeNumber: string
  employeeName: string
  department: string
  position: string
  category: string

  // Salary breakdown
  salaryComponents: SalaryComponent[]
  deductions: Deduction[]

  grossSalary: number
  totalDeductions: number
  netSalary: number
}

export interface SalaryComponent {
  label: string
  base: number
  rate: number
  amount: number
}

export interface Deduction {
  label: string
  amount: number
}

export interface ConnectionLog {
  id: string
  userId: string
  timestamp: string
  ipAddress: string
  userAgent: string
  success: boolean
}

export interface AuthSession {
  userId: string
  identifier: string
  firstName: string
  lastName: string
  loginTime: string
}
