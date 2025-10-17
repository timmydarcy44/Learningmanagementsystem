'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { Stat } from '@/components/ui/Stat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/Sidebar'
import { MotionWrapper, MotionCard, MotionStagger, MotionItem } from '@/components/ui/Motion'

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarGroup title="Navigation">
          <SidebarItem icon="📊" active>
            Tableau de bord
          </SidebarItem>
          <SidebarItem icon="📚">
            Mes cours
          </SidebarItem>
          <SidebarItem icon="🎯">
            Objectifs
          </SidebarItem>
          <SidebarItem icon="📈">
            Progrès
          </SidebarItem>
        </SidebarGroup>
        
        <SidebarGroup title="Outils" className="mt-8">
          <SidebarItem icon="🔔">
            Notifications
          </SidebarItem>
          <SidebarItem icon="⚙️">
            Paramètres
          </SidebarItem>
          <SidebarItem icon="❓">
            Aide
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>

      <div className="flex-1 md:ml-64">
        <div className="container-app py-8">
          <MotionWrapper>
            <SectionHeader
              title="Tableau de bord"
              eyebrow="Vue d'ensemble"
              description="Suivez vos progrès et votre activité d'apprentissage"
              action={
                <Button variant="outline" size="sm">
                  Exporter les données
                </Button>
              }
            />
          </MotionWrapper>

          {/* Stats Grid */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MotionItem>
              <Card variant="elevated">
                <Stat
                  title="Progression globale"
                  value="78%"
                  change={{ value: "+12% ce mois", type: "positive" }}
                  icon="📈"
                />
              </Card>
            </MotionItem>
            <MotionItem>
              <Card variant="elevated">
                <Stat
                  title="Temps actif"
                  value="24h 30m"
                  change={{ value: "+3h cette semaine", type: "positive" }}
                  icon="⏱️"
                />
              </Card>
            </MotionItem>
            <MotionItem>
              <Card variant="elevated">
                <Stat
                  title="Badges obtenus"
                  value="12"
                  change={{ value: "+2 cette semaine", type: "positive" }}
                  icon="🏆"
                />
              </Card>
            </MotionItem>
            <MotionItem>
              <Card variant="elevated">
                <Stat
                  title="Usage IA"
                  value="89%"
                  change={{ value: "Très actif", type: "positive" }}
                  icon="🤖"
                />
              </Card>
            </MotionItem>
          </MotionStagger>

          <MotionStagger className="grid lg:grid-cols-2 gap-8">
            {/* Formations en cours */}
            <MotionItem>
              <MotionCard>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Formations en cours</CardTitle>
                    <CardDescription>
                      Vos cours actuellement suivis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cours</TableHead>
                          <TableHead>Progrès</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            React Avancé
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div className="bg-iris-grad h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <span className="text-sm text-neutral-600">75%</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="success">En cours</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            TypeScript Fundamentals
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div className="bg-blush-grad h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <span className="text-sm text-neutral-600">45%</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="warning">En pause</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Design System
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="text-sm text-neutral-600">90%</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="info">Bientôt terminé</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </MotionCard>
            </MotionItem>

            {/* Notifications */}
            <MotionItem>
              <MotionCard>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Notifications récentes</CardTitle>
                    <CardDescription>
                      Vos dernières activités et mises à jour
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50">
                        <div className="h-8 w-8 rounded-full bg-iris-grad flex items-center justify-center text-white text-sm">
                          🎉
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-975">
                            Badge "React Expert" obtenu !
                          </p>
                          <p className="text-xs text-neutral-600">
                            Il y a 2 heures
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50">
                        <div className="h-8 w-8 rounded-full bg-blush-grad flex items-center justify-center text-white text-sm">
                          📚
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-975">
                            Nouveau cours disponible
                          </p>
                          <p className="text-xs text-neutral-600">
                            "Advanced TypeScript Patterns"
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white text-sm">
                          ⚡
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-975">
                            Objectif hebdomadaire atteint
                          </p>
                          <p className="text-xs text-neutral-600">
                            5h d'apprentissage cette semaine
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionCard>
            </MotionItem>
          </MotionStagger>
        </div>
      </div>
    </div>
  )
}
