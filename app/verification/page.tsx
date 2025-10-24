"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function VerificationPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; identifier: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Récupérer les informations utilisateur depuis sessionStorage
    const tempUser = sessionStorage.getItem("temp_user")
    const tempIdentifier = sessionStorage.getItem("temp_identifier")

    if (!tempUser || !tempIdentifier) {
      router.push("/")
      return
    }

    try {
      const user = JSON.parse(tempUser)
      setUserInfo(user)
    } catch {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe")
      return
    }

    if (!userInfo) {
      setError("Session expirée")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Attempting login...")
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: userInfo.identifier,
          password: password,
        }),
      })

      console.log("[v0] Login response status:", response.status)
      
      const data = await response.json()
      console.log("[v0] Login response data:", data)

      if (response.ok) {
        // Nettoyer le sessionStorage
        sessionStorage.removeItem("temp_identifier")
        sessionStorage.removeItem("temp_user")
        
        // Rediriger vers le dashboard
        router.push("/dashboard")
      } else {
        setError(data.error || "Mot de passe incorrect")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    sessionStorage.removeItem("temp_identifier")
    sessionStorage.removeItem("temp_user")
    router.push("/")
  }

  if (!userInfo) {
    return null // ou un loader
  }

  const initials = `${userInfo.firstName[0]}${userInfo.lastName[0]}`.toUpperCase()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <CardTitle className="text-center text-2xl">
            {userInfo.firstName} {userInfo.lastName}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                autoFocus
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Identifiant de test: SOPH001 | Mot de passe: password123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}