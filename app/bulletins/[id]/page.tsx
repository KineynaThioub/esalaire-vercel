"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, ArrowLeft, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Bulletin } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BulletinDetailPage() {
  const params = useParams()
  const [bulletin, setBulletin] = useState<Bulletin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBulletin() {
      if (params.id) {
        try {
          const response = await fetch(`/api/bulletins/${params.id}`)
          const data = await response.json()
          setBulletin(data.bulletin || null)
        } catch (error) {
          console.error("[v0] Error fetching bulletin:", error)
          setBulletin(null)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBulletin()
  }, [params.id])

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <Button asChild variant="ghost">
              <Link href="/bulletins">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux bulletins
              </Link>
            </Button>
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chargement du bulletin...</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!bulletin) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <Button asChild variant="ghost">
              <Link href="/bulletins">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux bulletins
              </Link>
            </Button>
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Bulletin non trouvé</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const handleDownloadPDF = () => {
    alert("Téléchargement PDF en cours... (fonctionnalité à implémenter)")
  }

  const handleDownloadExcel = () => {
    alert("Téléchargement Excel en cours... (fonctionnalité à implémenter)")
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Button asChild variant="ghost" className="-ml-4">
                <Link href="/bulletins">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux bulletins
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Bulletin Clarifié</h1>
              <p className="text-muted-foreground">{bulletin.title}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={handleDownloadExcel} variant="outline" className="bg-transparent">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>

          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Employé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">N° Salarié</p>
                  <p className="font-medium">{bulletin.employeeNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{bulletin.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{bulletin.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Poste</p>
                  <p className="font-medium">{bulletin.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <p className="font-medium">{bulletin.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Période</p>
                  <p className="font-medium">{bulletin.period.replace("_", " au ")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Components */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Composantes du Salaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Désignation</TableHead>
                      <TableHead className="text-right">Base</TableHead>
                      <TableHead className="text-right">Taux</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulletin.salaryComponents.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{component.label}</TableCell>
                        <TableCell className="text-right">{component.base.toLocaleString("fr-FR")}</TableCell>
                        <TableCell className="text-right">{component.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {component.amount.toLocaleString("fr-FR")}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={3} className="font-bold">
                        Salaire Brut
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {bulletin.grossSalary.toLocaleString("fr-FR")} FCFA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Retenues et Cotisations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Désignation</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulletin.deductions.map((deduction, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{deduction.label}</TableCell>
                        <TableCell className="text-right font-medium">
                          {deduction.amount.toLocaleString("fr-FR")} FCFA
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total Retenues</TableCell>
                      <TableCell className="text-right font-bold">
                        {bulletin.totalDeductions.toLocaleString("fr-FR")} FCFA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Net Salary Summary */}
          <Card className="bg-primary/5 border-primary">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Salaire Brut</span>
                  <span className="text-lg font-bold">{bulletin.grossSalary.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Retenues</span>
                  <span className="text-lg font-bold text-destructive">
                    - {bulletin.totalDeductions.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <Separator className="border-primary" />
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">NET À PAYER</span>
                  <span className="text-3xl font-bold text-primary">
                    {bulletin.netSalary.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownloadPDF} className="flex-1" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Télécharger en PDF
                </Button>
                <Button onClick={handleDownloadExcel} variant="outline" className="flex-1 bg-transparent" size="lg">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Télécharger en Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
