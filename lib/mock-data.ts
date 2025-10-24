import type { User, Bulletin } from "./types"

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    identifier: "SOPH001",
    password: "password123", // In production, this would be hashed
    firstName: "Sophie",
    lastName: "SALEIRE",
    email: "sophie.saleire@sonatel.sn",
    department: "Ressources Humaines",
    position: "Employé qualifié service RH",
    createdAt: "2020-01-15T00:00:00Z",
  },
  {
    id: "2",
    identifier: "DEMO001",
    password: "demo123",
    firstName: "Jean",
    lastName: "DUPONT",
    email: "jean.dupont@sonatel.sn",
    department: "Informatique",
    position: "Développeur Senior",
    createdAt: "2019-06-01T00:00:00Z",
  },
]

// Mock bulletins data
export const mockBulletins: Bulletin[] = [
  {
    id: "bull-001",
    userId: "1",
    title: "EDEDOC 01-03-21_31-03-21",
    period: "01-03-21_31-03-21",
    date: "2021-03-10T00:00:00Z",
    fileSize: "27ko",
    status: "available",
    employeeNumber: "2401",
    employeeName: "Sophie SALEIRE",
    department: "Ressources Humaines",
    position: "Employé qualifié service RH",
    category: "Non Cadre",
    salaryComponents: [
      { label: "Salaire mensuel", base: 2386.16, rate: 1, amount: 2386.16 },
      { label: "Prime de 13ème mois", base: 0, rate: 0, amount: 0 },
      { label: "Indemnité de transport", base: 0, rate: 0, amount: 0 },
      { label: "Prime de rendement", base: 0, rate: 0, amount: 150.0 },
    ],
    deductions: [
      { label: "IPRES", amount: 143.17 },
      { label: "CSS", amount: 95.45 },
      { label: "Impôt sur le revenu", amount: 283.54 },
    ],
    grossSalary: 2536.16,
    totalDeductions: 522.16,
    netSalary: 1814.0,
  },
  {
    id: "bull-002",
    userId: "1",
    title: "EDEDOC 01-02-21_28-02-21",
    period: "01-02-21_28-02-21",
    date: "2021-02-10T00:00:00Z",
    fileSize: "1176ko",
    status: "available",
    employeeNumber: "2401",
    employeeName: "Sophie SALEIRE",
    department: "Ressources Humaines",
    position: "Employé qualifié service RH",
    category: "Non Cadre",
    salaryComponents: [
      { label: "Salaire mensuel", base: 2386.16, rate: 1, amount: 2386.16 },
      { label: "Prime de 13ème mois", base: 0, rate: 0, amount: 0 },
      { label: "Heures supplémentaires", base: 0, rate: 0, amount: 200.0 },
    ],
    deductions: [
      { label: "IPRES", amount: 155.17 },
      { label: "CSS", amount: 103.45 },
      { label: "Impôt sur le revenu", amount: 310.54 },
    ],
    grossSalary: 2586.16,
    totalDeductions: 569.16,
    netSalary: 2017.0,
  },
  {
    id: "bull-003",
    userId: "1",
    title: "EDEDOC 01-01-21_31-01-21",
    period: "01-01-21_31-01-21",
    date: "2021-01-10T00:00:00Z",
    fileSize: "27ko",
    status: "available",
    employeeNumber: "2401",
    employeeName: "Sophie SALEIRE",
    department: "Ressources Humaines",
    position: "Employé qualifié service RH",
    category: "Non Cadre",
    salaryComponents: [
      { label: "Salaire mensuel", base: 2386.16, rate: 1, amount: 2386.16 },
      { label: "Prime de fin d'année", base: 0, rate: 0, amount: 500.0 },
    ],
    deductions: [
      { label: "IPRES", amount: 173.17 },
      { label: "CSS", amount: 115.45 },
      { label: "Impôt sur le revenu", amount: 383.54 },
    ],
    grossSalary: 2886.16,
    totalDeductions: 672.16,
    netSalary: 2214.0,
  },
  {
    id: "bull-004",
    userId: "1",
    title: "EDEDOC DEMO 01-05-21_31-05-21",
    period: "01-05-21_31-05-21",
    date: "2021-05-27T00:00:00Z",
    fileSize: "1234ko",
    status: "available",
    employeeNumber: "2401",
    employeeName: "Sophie SALEIRE",
    department: "Ressources Humaines",
    position: "Employé qualifié service RH",
    category: "Non Cadre",
    salaryComponents: [{ label: "Salaire mensuel", base: 2386.16, rate: 1, amount: 2386.16 }],
    deductions: [
      { label: "IPRES", amount: 143.17 },
      { label: "CSS", amount: 95.45 },
      { label: "Impôt sur le revenu", amount: 283.54 },
    ],
    grossSalary: 2386.16,
    totalDeductions: 522.16,
    netSalary: 1864.0,
  },
]

// Helper functions
export function getUserByIdentifier(identifier: string): User | undefined {
  return mockUsers.find((user) => user.identifier === identifier)
}

export function validateCredentials(identifier: string, password: string): User | null {
  const user = getUserByIdentifier(identifier)
  if (user && user.password === password) {
    return user
  }
  return null
}

export function getBulletinsByUserId(userId: string): Bulletin[] {
  return mockBulletins.filter((bulletin) => bulletin.userId === userId)
}

export function getBulletinById(bulletinId: string): Bulletin | undefined {
  return mockBulletins.find((bulletin) => bulletin.id === bulletinId)
}
