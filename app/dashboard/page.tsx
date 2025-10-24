"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Bulletin } from "@/lib/types"

export default function DashboardPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get session info
        const sessionRes = await fetch("/api/auth/session")
        const sessionData = await sessionRes.json()

      if (sessionData?.user) {
        setUserName(`${sessionData.user.firstName} ${sessionData.user.lastName}`)

        const bulletinsRes = await fetch("/api/bulletins")
        const bulletinsData = await bulletinsRes.json()
        setBulletins(bulletinsData.bulletins || [])
      }


      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const latestBulletin = bulletins[0]
  const totalBulletins = bulletins.length

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Chargement...</h1>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Bonjour {userName}</h1>
            <p className="text-muted-foreground text-pretty">
              Bienvenue sur eSalaire, l'application qui vous permet de retrouver tous vos bulletins de salaire
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bulletins</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBulletins}</div>
                <p className="text-xs text-muted-foreground">Bulletins disponibles</p>
              </CardContent>
            </Card>

            {latestBulletin && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dernier Salaire</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{latestBulletin.netSalary.toLocaleString("fr-FR")} FCFA</div>
                    <p className="text-xs text-muted-foreground">Net à payer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dernière Période</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{latestBulletin.period.split("_")[0]}</div>
                    <p className="text-xs text-muted-foreground">{latestBulletin.title}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Latest Bulletin Card */}
          {latestBulletin && (
            <Card>
              <CardHeader>
                <CardTitle>Dernier Bulletin</CardTitle>
                <CardDescription>Votre bulletin de salaire le plus récent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{latestBulletin.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Période: {latestBulletin.period.replace("_", " au ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(latestBulletin.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {latestBulletin.netSalary.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground">Net à payer</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/bulletins/${latestBulletin.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le détail
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accédez rapidement à vos fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button asChild variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <Link href="/bulletins">
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Tous les bulletins</div>
                    <div className="text-xs text-muted-foreground">Consulter l'historique complet</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start bg-transparent">
                <Link href="/compte">
                  <Download className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Téléchargements</div>
                    <div className="text-xs text-muted-foreground">Exporter vos bulletins</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-balance">
                <span className="font-medium">eSalaire est une solution sécurisée</span>
                <br />
                Vos données sont protégées et accessibles uniquement par vous
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
