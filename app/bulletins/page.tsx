"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download, Eye, Filter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Bulletin } from "@/lib/types"

export default function BulletinsPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [filteredBulletins, setFilteredBulletins] = useState<Bulletin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBulletins() {
      try {
        const response = await fetch("/api/bulletins")
        const data = await response.json()
        setBulletins(data.bulletins || [])
        setFilteredBulletins(data.bulletins || [])
      } catch (error) {
        console.error("[v0] Error fetching bulletins:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBulletins()
  }, [])

  useEffect(() => {
    let filtered = bulletins

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (bulletin) =>
          bulletin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bulletin.period.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by year
    if (yearFilter !== "all") {
      filtered = filtered.filter((bulletin) => {
        const year = new Date(bulletin.date).getFullYear().toString()
        return year === yearFilter
      })
    }

    setFilteredBulletins(filtered)
  }, [searchQuery, yearFilter, bulletins])

  // Get unique years from bulletins
  const years = Array.from(new Set(bulletins.map((b) => new Date(b.date).getFullYear().toString()))).sort(
    (a, b) => Number.parseInt(b) - Number.parseInt(a),
  )

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Bulletins de Salaire</h1>
            <p className="text-muted-foreground">Consultez et téléchargez vos bulletins de paie</p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un bulletin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les années</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Chargement..."
                : `${filteredBulletins.length} bulletin${filteredBulletins.length > 1 ? "s" : ""} trouvé${filteredBulletins.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Bulletins List */}
          <div className="space-y-3">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Chargement des bulletins...</p>
                </CardContent>
              </Card>
            ) : filteredBulletins.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun bulletin trouvé</p>
                </CardContent>
              </Card>
            ) : (
              filteredBulletins.map((bulletin) => (
                <Card key={bulletin.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-base">{bulletin.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(bulletin.date).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}{" "}
                              | {bulletin.fileSize}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-primary">
                              {bulletin.netSalary.toLocaleString("fr-FR")} FCFA
                            </p>
                            <p className="text-xs text-muted-foreground">Net à payer</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <Button asChild size="sm" className="flex-1 sm:flex-none">
                            <Link href={`/bulletins/${bulletin.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
