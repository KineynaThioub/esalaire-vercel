// Session management utilities
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET
)
const SESSION_COOKIE_NAME = "esalaire_session"

// Interface avec signature d'index pour être compatible avec JWTPayload
export interface SessionData {
  userId: string
  identifier: string
  firstName: string
  lastName: string
  loginTime: string
  [key: string]: string // Signature d'index ajoutée
}

export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT(data as Record<string, string>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SESSION_SECRET)

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET)
    return payload as SessionData
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}