import { prisma } from "./prisma"
import type { User } from "./types"
import bcrypt from "bcryptjs"

/**
 * Get user by identifier (employee ID)
 */
export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { identifier },
  })

  if (!user) return null

  return {
    id: user.id,
    identifier: user.identifier,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    position: user.position,
    createdAt: user.createdAt.toISOString(),
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) return null

  return {
    id: user.id,
    identifier: user.identifier,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    position: user.position,
    createdAt: user.createdAt.toISOString(),
  }
}

/**
 * Validate user credentials
 */
export async function validateCredentials(identifier: string, password: string): Promise<User | null> {
  const user = await getUserByIdentifier(identifier)

  if (!user) return null

  // Compare password (assuming passwords are hashed with bcrypt)
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) return null

  return user
}

/**
 * Create a new user
 */
export async function createUser(data: {
  identifier: string
  password: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
}): Promise<User> {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })

  return {
    id: user.id,
    identifier: user.identifier,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    position: user.position,
    createdAt: user.createdAt.toISOString(),
  }
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return users.map((user) => ({
    id: user.id,
    identifier: user.identifier,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    position: user.position,
    createdAt: user.createdAt.toISOString(),
  }))
}

/**
 * Log connection attempt
 */
export async function logConnection(data: {
  userId: string
  ipAddress?: string
  userAgent?: string
  success: boolean
}): Promise<void> {
  await prisma.connectionLog.create({
    data: {
      userId: data.userId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      success: data.success,
    },
  })
}
