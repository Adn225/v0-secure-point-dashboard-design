"use client"

import { useMemo, useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Building,
  CalendarDays,
  CheckCircle2,
  Clock,
  DoorOpen,
  Edit,
  Globe,
  Plus,
  Server,
  Shield,
  Trash2,
  Users,
} from "lucide-react"

type Department = {
  id: string
  name: string
  manager: string
  employeeCount: number
}

type AccessGroup = {
  id: string
  name: string
  description: string
  deviceCount: number
}

type WorkSchedule = {
  id: string
  name: string
  type: "Horaire" | "Quart" | "Repos"
  startTime: string
  endTime: string
  workDays: string
}

type Assignment = {
  id: string
  scheduleId: string
  targetType: "Departement" | "Groupe"
  targetId: string
}

const defaultDepartments: Department[] = [
  { id: "dep-001", name: "IT", manager: "Sarah N.", employeeCount: 34 },
  { id: "dep-002", name: "RH", manager: "Amina K.", employeeCount: 12 },
  { id: "dep-003", name: "Operations", manager: "Marc D.", employeeCount: 56 },
]

const defaultGroups: AccessGroup[] = [
  { id: "grp-001", name: "Batiment A", description: "Acces general", deviceCount: 4 },
  { id: "grp-002", name: "Salle serveur", description: "Acces restreint", deviceCount: 1 },
  { id: "grp-003", name: "Parking", description: "Acces parking", deviceCount: 2 },
]

const defaultSchedules: WorkSchedule[] = [
  {
    id: "sch-001",
    name: "Bureau standard",
    type: "Horaire",
    startTime: "09:00",
    endTime: "18:00",
    workDays: "Lun-Ven",
  },
  {
    id: "sch-002",
    name: "Quart nuit",
    type: "Quart",
    startTime: "22:00",
    endTime: "06:00",
    workDays: "Lun-Sam",
  },
  {
    id: "sch-003",
    name: "Repos weekend",
    type: "Repos",
    startTime: "00:00",
    endTime: "23:59",
    workDays: "Sam-Dim",
  },
]

const defaultAssignments: Assignment[] = [
  { id: "asg-001", scheduleId: "sch-001", targetType: "Departement", targetId: "dep-001" },
  { id: "asg-002", scheduleId: "sch-002", targetType: "Groupe", targetId: "grp-002" },
]

export default function SettingsPage() {
  const [departments, setDepartments] = useState(defaultDepartments)
  const [groups, setGroups] = useState(defaultGroups)
  const [schedules, setSchedules] = useState(defaultSchedules)
  const [assignments, setAssignments] = useState(defaultAssignments)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)

  const [depDialogOpen, setDepDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [depForm, setDepForm] = useState({ name: "", manager: "", employeeCount: "0" })

  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<AccessGroup | null>(null)
  const [groupForm, setGroupForm] = useState({ name: "", description: "", deviceCount: "0" })

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null)
  const [scheduleForm, setScheduleForm] = useState<{
    name: string
    type: WorkSchedule["type"]
    startTime: string
    endTime: string
    workDays: string
  }>({ name: "", type: "Horaire", startTime: "09:00", endTime: "18:00", workDays: "Lun-Ven" })

  const [assignmentForm, setAssignmentForm] = useState({
    scheduleId: defaultSchedules[0].id,
    targetType: "Departement" as Assignment["targetType"],
    targetId: defaultDepartments[0].id,
  })

  const availableTargets = useMemo(() => {
    return assignmentForm.targetType === "Departement" ? departments : groups
  }, [assignmentForm.targetType, departments, groups])

  const resetDepartmentForm = () => setDepForm({ name: "", manager: "", employeeCount: "0" })
  const resetGroupForm = () => setGroupForm({ name: "", description: "", deviceCount: "0" })
  const resetScheduleForm = () =>
    setScheduleForm({ name: "", type: "Horaire", startTime: "09:00", endTime: "18:00", workDays: "Lun-Ven" })

  const submitDepartment = () => {
    const payload: Department = {
      id: editingDepartment?.id ?? `dep-${Date.now()}`,
      name: depForm.name,
      manager: depForm.manager,
      employeeCount: Number(depForm.employeeCount || 0),
    }

    setDepartments((prev) =>
      editingDepartment ? prev.map((dep) => (dep.id === payload.id ? payload : dep)) : [...prev, payload]
    )

    setDepDialogOpen(false)
    setEditingDepartment(null)
    resetDepartmentForm()
  }

  const submitGroup = () => {
    const payload: AccessGroup = {
      id: editingGroup?.id ?? `grp-${Date.now()}`,
      name: groupForm.name,
      description: groupForm.description,
      deviceCount: Number(groupForm.deviceCount || 0),
    }

    setGroups((prev) =>
      editingGroup ? prev.map((group) => (group.id === payload.id ? payload : group)) : [...prev, payload]
    )

    setGroupDialogOpen(false)
    setEditingGroup(null)
    resetGroupForm()
  }

  const submitSchedule = () => {
    const payload: WorkSchedule = {
      id: editingSchedule?.id ?? `sch-${Date.now()}`,
      name: scheduleForm.name,
      type: scheduleForm.type,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      workDays: scheduleForm.workDays,
    }

    setSchedules((prev) =>
      editingSchedule ? prev.map((schedule) => (schedule.id === payload.id ? payload : schedule)) : [...prev, payload]
    )

    setScheduleDialogOpen(false)
    setEditingSchedule(null)
    resetScheduleForm()
  }

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((dep) => dep.id !== id))
    setAssignments((prev) => prev.filter((asgn) => !(asgn.targetType === "Departement" && asgn.targetId === id)))
  }

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id))
    setAssignments((prev) => prev.filter((asgn) => !(asgn.targetType === "Groupe" && asgn.targetId === id)))
  }

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id))
    setAssignments((prev) => prev.filter((asgn) => asgn.scheduleId !== id))
  }

  const addAssignment = () => {
    if (!assignmentForm.scheduleId || !assignmentForm.targetId) return
    setAssignments((prev) => [...prev, { id: `asg-${Date.now()}`, ...assignmentForm }])
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="pl-16 lg:pl-64">
        <Header systemStatus="connected" />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Parametres</h1>
            <p className="mt-1 text-sm text-muted-foreground">Configuration globale du systeme</p>
          </div>

          <Tabs defaultValue="organization" className="space-y-6">
            <TabsList className="flex-wrap">
              <TabsTrigger value="organization">
                <Users className="mr-2 h-4 w-4" />
                Organisation
              </TabsTrigger>
              <TabsTrigger value="planning">
                <CalendarDays className="mr-2 h-4 w-4" />
                Horaires & Plannings
              </TabsTrigger>
              <TabsTrigger value="hikcentral">
                <Server className="mr-2 h-4 w-4" />
                HikCentral
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Securite
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="general">
                <Globe className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Departements</CardTitle>
                      <CardDescription>Ajout, modification et suppression des departements</CardDescription>
                    </div>
                    <Dialog open={depDialogOpen} onOpenChange={setDepDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingDepartment(null)
                            resetDepartmentForm()
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nouveau departement
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingDepartment ? "Modifier" : "Creer"} un departement</DialogTitle>
                          <DialogDescription>Renseignez les informations du departement.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input value={depForm.name} onChange={(e) => setDepForm((p) => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Responsable</Label>
                            <Input value={depForm.manager} onChange={(e) => setDepForm((p) => ({ ...p, manager: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Nombre d'employes</Label>
                            <Input type="number" value={depForm.employeeCount} onChange={(e) => setDepForm((p) => ({ ...p, employeeCount: e.target.value }))} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDepDialogOpen(false)}>Annuler</Button>
                          <Button onClick={submitDepartment}>Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departments.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{dep.name}</p>
                          <p className="text-xs text-muted-foreground">Manager: {dep.manager} • {dep.employeeCount} employes</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingDepartment(dep)
                          setDepForm({ name: dep.name, manager: dep.manager, employeeCount: String(dep.employeeCount) })
                          setDepDialogOpen(true)
                        }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDepartment(dep.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Groupes d'acces</CardTitle>
                      <CardDescription>Ajout, modification et suppression des groupes</CardDescription>
                    </div>
                    <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingGroup(null)
                            resetGroupForm()
                          }}
                        >
                          <DoorOpen className="mr-2 h-4 w-4" />
                          Nouveau groupe
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingGroup ? "Modifier" : "Creer"} un groupe</DialogTitle>
                          <DialogDescription>Definissez la zone et le volume d'appareils.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2"><Label>Nom</Label><Input value={groupForm.name} onChange={(e) => setGroupForm((p) => ({ ...p, name: e.target.value }))} /></div>
                          <div className="space-y-2"><Label>Description</Label><Input value={groupForm.description} onChange={(e) => setGroupForm((p) => ({ ...p, description: e.target.value }))} /></div>
                          <div className="space-y-2"><Label>Nombre d'appareils</Label><Input type="number" value={groupForm.deviceCount} onChange={(e) => setGroupForm((p) => ({ ...p, deviceCount: e.target.value }))} /></div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Annuler</Button>
                          <Button onClick={submitGroup}>Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.description} • {group.deviceCount} appareils</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingGroup(group)
                          setGroupForm({ name: group.name, description: group.description, deviceCount: String(group.deviceCount) })
                          setGroupDialogOpen(true)
                        }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteGroup(group.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Horaires, repos et quarts</CardTitle>
                      <CardDescription>Definition des plages de travail et types de planning</CardDescription>
                    </div>
                    <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingSchedule(null); resetScheduleForm() }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Nouveau planning
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingSchedule ? "Modifier" : "Creer"} un planning</DialogTitle>
                          <DialogDescription>Configurez un horaire de travail, un quart ou un repos.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2"><Label>Nom</Label><Input value={scheduleForm.name} onChange={(e) => setScheduleForm((p) => ({ ...p, name: e.target.value }))} /></div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={scheduleForm.type} onValueChange={(value: WorkSchedule["type"]) => setScheduleForm((p) => ({ ...p, type: value }))}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Horaire">Horaire</SelectItem>
                                <SelectItem value="Quart">Quart</SelectItem>
                                <SelectItem value="Repos">Repos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Debut</Label><Input type="time" value={scheduleForm.startTime} onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Fin</Label><Input type="time" value={scheduleForm.endTime} onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))} /></div>
                          </div>
                          <div className="space-y-2"><Label>Jours</Label><Input value={scheduleForm.workDays} onChange={(e) => setScheduleForm((p) => ({ ...p, workDays: e.target.value }))} placeholder="ex: Lun-Ven" /></div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Annuler</Button>
                          <Button onClick={submitSchedule}>Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{schedule.name} <Badge variant="secondary">{schedule.type}</Badge></p>
                        <p className="text-xs text-muted-foreground">{schedule.startTime} - {schedule.endTime} • {schedule.workDays}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingSchedule(schedule)
                          setScheduleForm({ name: schedule.name, type: schedule.type, startTime: schedule.startTime, endTime: schedule.endTime, workDays: schedule.workDays })
                          setScheduleDialogOpen(true)
                        }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteSchedule(schedule.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attribution des plannings</CardTitle>
                  <CardDescription>Affectez un planning a un departement ou un groupe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    <Select value={assignmentForm.scheduleId} onValueChange={(v) => setAssignmentForm((p) => ({ ...p, scheduleId: v }))}>
                      <SelectTrigger><SelectValue placeholder="Planning" /></SelectTrigger>
                      <SelectContent>{schedules.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={assignmentForm.targetType} onValueChange={(v: Assignment["targetType"]) => setAssignmentForm((p) => ({ ...p, targetType: v, targetId: "" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Departement">Departement</SelectItem>
                        <SelectItem value="Groupe">Groupe</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={assignmentForm.targetId} onValueChange={(v) => setAssignmentForm((p) => ({ ...p, targetId: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selectionner" /></SelectTrigger>
                      <SelectContent>
                        {availableTargets.map((target) => (
                          <SelectItem key={target.id} value={target.id}>{target.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addAssignment}>Attribuer</Button>
                  </div>

                  <div className="space-y-2">
                    {assignments.map((asgn) => {
                      const schedule = schedules.find((s) => s.id === asgn.scheduleId)
                      const target = asgn.targetType === "Departement" ? departments.find((d) => d.id === asgn.targetId) : groups.find((g) => g.id === asgn.targetId)
                      return (
                        <div key={asgn.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <p>
                            <span className="font-medium">{schedule?.name ?? "Planning supprime"}</span> → {asgn.targetType}: {target?.name ?? "Cible supprimee"}
                          </p>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setAssignments((prev) => prev.filter((a) => a.id !== asgn.id))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hikcentral" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Etat de la connexion</CardTitle>
                      <CardDescription>Connexion au serveur HikCentral Professional</CardDescription>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Connecte</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <p className="text-sm">Synchronisation active toutes les 5 minutes.</p>
                    <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Politique d'acces</CardTitle>
                  <CardDescription>Regles de securite globales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Restriction horaire en dehors de 06:00 - 22:00</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Canaux de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4"><p>Email</p><Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} /></div>
                  <div className="flex items-center justify-between rounded-lg border p-4"><p>Push mobile</p><Switch checked={pushNotifications} onCheckedChange={setPushNotifications} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations entreprise</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Nom de l'entreprise</Label><Input defaultValue="TechCorp Industries" /></div>
                  <div className="space-y-2"><Label>Fuseau horaire</Label><Input defaultValue="Europe/Paris" /></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
