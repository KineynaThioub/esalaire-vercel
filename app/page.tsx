"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [identifier, setIdentifier] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!identifier.trim()) {
      setError("Veuillez entrer votre identifiant")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      })

      const data = await response.json()

      if (data.exists) {
        sessionStorage.setItem("temp_identifier", identifier)
        sessionStorage.setItem("temp_user", JSON.stringify(data.user))
        router.push("/verification")
      } else {
        setError("Identifiant non trouvé")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image src="/images/sonatel-logo.png" alt="Sonatel" width={160} height={48} className="object-contain" />
          </div>
          <CardTitle className="text-center text-2xl">eSalaire</CardTitle>
          <CardDescription className="text-center">Accédez à vos bulletins de salaire en ligne</CardDescription>
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
              <Label htmlFor="identifier">Identifiant</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Entrez votre identifiant"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-11"
                autoFocus
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Vérification..." : "Continuer"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">Identifiant de test: SOPH001 ou DEMO001</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
