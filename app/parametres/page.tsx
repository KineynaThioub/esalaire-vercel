"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, Download, Moon, Globe } from "lucide-react"
import { useState } from "react"

export default function ParametresPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoDownload, setAutoDownload] = useState(false)

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez vos préférences et paramètres de l'application</p>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Activer les notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouveaux bulletins
                  </span>
                </Label>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Mode sombre</span>
                  <span className="text-sm text-muted-foreground">Activer le thème sombre</span>
                </Label>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Téléchargements
              </CardTitle>
              <CardDescription>Gérez vos préférences de téléchargement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoDownload" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Téléchargement automatique</span>
                  <span className="text-sm text-muted-foreground">
                    Télécharger automatiquement les nouveaux bulletins
                  </span>
                </Label>
                <Switch id="autoDownload" checked={autoDownload} onCheckedChange={setAutoDownload} />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Changer le mot de passe
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Configurer la biométrie
              </Button>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Langue
              </CardTitle>
              <CardDescription>Choisissez votre langue préférée</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Français (FR)
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Version:</span> 2.5.4+17
              </p>
              <p>
                <span className="font-medium text-foreground">Développé par:</span> Sonatel
              </p>
              <p className="pt-2">© 2025 Sonatel - eSalaire. Tous droits réservés.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
