"use client"

import type { AuthSession, User } from "./types"
import { validateCredentials } from "./mock-data"

const SESSION_KEY = "esalaire_session"
const LOGS_KEY = "esalaire_logs"

export function login(identifier: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = validateCredentials(identifier, password)

  if (!user) {
    logConnection(identifier, false)
    return { success: false, error: "Identifiant ou mot de passe incorrect" }
  }

  const session: AuthSession = {
    userId: user.id,
    identifier: user.identifier,
    firstName: user.firstName,
    lastName: user.lastName,
    loginTime: new Date().toISOString(),
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  logConnection(identifier, true)

  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem(SESSION_KEY)
  if (!sessionData) return null

  try {
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

function logConnection(identifier: string, success: boolean): void {
  const logs = getConnectionLogs()
  const newLog = {
    id: `log-${Date.now()}`,
    userId: identifier,
    timestamp: new Date().toISOString(),
    ipAddress: "N/A", // Would be captured server-side in production
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
    success,
  }

  logs.push(newLog)
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}

export function getConnectionLogs() {
  if (typeof window === "undefined") return []

  const logsData = localStorage.getItem(LOGS_KEY)
  if (!logsData) return []

  try {
    return JSON.parse(logsData)
  } catch {
    return []
  }
}
