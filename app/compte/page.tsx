"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { getUserByIdentifier } from "@/lib/mock-data"
import { User, Mail, Briefcase, Building2, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import type { User as UserType } from "@/lib/types"

export default function ComptePage() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) {
      const userData = getUserByIdentifier(session.identifier)
      setUser(userData || null)
    }
  }, [])

  if (!user) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Mon Compte</h1>
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Mon Compte</h1>
            <p className="text-muted-foreground">Consultez vos informations personnelles</p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription>{user.position}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Information Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Identifiant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{user.identifier}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{user.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{user.department}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Poste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{user.position}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'embauche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
