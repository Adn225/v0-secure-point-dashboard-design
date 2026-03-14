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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, CalendarClock, Clock3, Edit, MoonStar, Plus, Repeat2, Trash2, UserRoundCog } from "lucide-react"

type RotationStep = {
  id: string
  label: string
  startTime: string
  endTime: string
  durationDays: number
}

type WorkSchedule = {
  id: string
  name: string
  type: "Horaire" | "Quart" | "Repos"
  startTime: string
  endTime: string
  workDays: string[]
  rotationEnabled: boolean
  rotationSteps: RotationStep[]
}

type Assignment = {
  id: string
  scheduleId: string
  targetType: "Département" | "Groupe"
  targetId: string
}

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const dayLabels: Record<string, string> = {
  Lun: "Lundi",
  Mar: "Mardi",
  Mer: "Mercredi",
  Jeu: "Jeudi",
  Ven: "Vendredi",
  Sam: "Samedi",
  Dim: "Dimanche",
}

const defaultDepartments = [
  { id: "dep-001", name: "IT" },
  { id: "dep-002", name: "Ressources humaines" },
  { id: "dep-003", name: "Opérations" },
]

const defaultGroups = [
  { id: "grp-001", name: "Bâtiment A" },
  { id: "grp-002", name: "Salle serveur" },
  { id: "grp-003", name: "Parking" },
]

const defaultRotationSteps: RotationStep[] = [
  { id: "rot-1", label: "Matin", startTime: "07:00", endTime: "14:00", durationDays: 2 },
  { id: "rot-2", label: "Après-midi", startTime: "14:00", endTime: "22:00", durationDays: 2 },
  { id: "rot-3", label: "Nuit", startTime: "22:00", endTime: "07:00", durationDays: 2 },
]

const defaultSchedules: WorkSchedule[] = [
  {
    id: "sch-001",
    name: "Bureau standard",
    type: "Horaire",
    startTime: "09:00",
    endTime: "18:00",
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
    rotationEnabled: false,
    rotationSteps: [],
  },
  {
    id: "sch-002",
    name: "Quart tournant 3x8",
    type: "Quart",
    startTime: "07:00",
    endTime: "14:00",
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    rotationEnabled: true,
    rotationSteps: defaultRotationSteps,
  },
  {
    id: "sch-003",
    name: "Repos week-end",
    type: "Repos",
    startTime: "00:00",
    endTime: "23:59",
    workDays: ["Sam", "Dim"],
    rotationEnabled: false,
    rotationSteps: [],
  },
]

const defaultAssignments: Assignment[] = [
  { id: "asg-001", scheduleId: "sch-001", targetType: "Département", targetId: "dep-001" },
  { id: "asg-002", scheduleId: "sch-002", targetType: "Groupe", targetId: "grp-002" },
]

const planningTemplates = [
  {
    id: "tpl-admin",
    name: "Template administratif",
    data: {
      type: "Horaire" as WorkSchedule["type"],
      startTime: "08:30",
      endTime: "17:30",
      workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
      rotationEnabled: false,
      rotationSteps: [] as RotationStep[],
    },
  },
  {
    id: "tpl-3x8",
    name: "Template quart tournant",
    data: {
      type: "Quart" as WorkSchedule["type"],
      startTime: "07:00",
      endTime: "14:00",
      workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      rotationEnabled: true,
      rotationSteps: defaultRotationSteps,
    },
  },
  {
    id: "tpl-weekend",
    name: "Template repos week-end",
    data: {
      type: "Repos" as WorkSchedule["type"],
      startTime: "00:00",
      endTime: "23:59",
      workDays: ["Sam", "Dim"],
      rotationEnabled: false,
      rotationSteps: [] as RotationStep[],
    },
  },
]

const getTypeStyle = (type: WorkSchedule["type"]) => {
  if (type === "Horaire") return "bg-emerald-100 text-emerald-800"
  if (type === "Quart") return "bg-violet-100 text-violet-800"
  return "bg-slate-100 text-slate-700"
}

const getRotationSummary = (steps: RotationStep[]) =>
  steps.map((step) => `${step.durationDays}j ${step.startTime}-${step.endTime}`).join(" → ")

const getRotationCycleDays = (steps: RotationStep[]) => steps.reduce((total, step) => total + step.durationDays, 0)

export default function EmployeePlanningPage() {
  const [schedules, setSchedules] = useState(defaultSchedules)
  const [assignments, setAssignments] = useState(defaultAssignments)

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null)
  const [scheduleForm, setScheduleForm] = useState<{
    name: string
    type: WorkSchedule["type"]
    startTime: string
    endTime: string
    workDays: string[]
    rotationEnabled: boolean
    rotationSteps: RotationStep[]
  }>({
    name: "",
    type: "Horaire",
    startTime: "09:00",
    endTime: "18:00",
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
    rotationEnabled: false,
    rotationSteps: [],
  })

  const [assignmentForm, setAssignmentForm] = useState({
    scheduleId: defaultSchedules[0].id,
    targetType: "Département" as Assignment["targetType"],
    targetId: defaultDepartments[0].id,
  })

  const availableTargets = useMemo(() => {
    return assignmentForm.targetType === "Département" ? defaultDepartments : defaultGroups
  }, [assignmentForm.targetType])

  const planningCoverage = useMemo(() => {
    const daysWithPlanning = new Set(schedules.flatMap((schedule) => schedule.workDays))
    return Math.round((daysWithPlanning.size / weekDays.length) * 100)
  }, [schedules])

  const alerts = useMemo(() => {
    return schedules.filter((schedule) => {
      const missingBase = schedule.workDays.length === 0 || schedule.name.trim().length === 0
      const brokenRotation =
        schedule.type === "Quart" &&
        schedule.rotationEnabled &&
        (schedule.rotationSteps.length < 2 || schedule.rotationSteps.some((step) => step.durationDays <= 0))
      return missingBase || brokenRotation
    })
  }, [schedules])

  const resetScheduleForm = () =>
    setScheduleForm({
      name: "",
      type: "Horaire",
      startTime: "09:00",
      endTime: "18:00",
      workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
      rotationEnabled: false,
      rotationSteps: [],
    })

  const submitSchedule = () => {
    const invalidRotation =
      scheduleForm.type === "Quart" &&
      scheduleForm.rotationEnabled &&
      (scheduleForm.rotationSteps.length < 2 ||
        scheduleForm.rotationSteps.some((step) => !step.label.trim() || step.durationDays <= 0))

    if (!scheduleForm.name.trim() || scheduleForm.workDays.length === 0 || invalidRotation) return

    const payload: WorkSchedule = {
      id: editingSchedule?.id ?? `sch-${Date.now()}`,
      name: scheduleForm.name.trim(),
      type: scheduleForm.type,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      workDays: scheduleForm.workDays,
      rotationEnabled: scheduleForm.rotationEnabled,
      rotationSteps: scheduleForm.rotationEnabled ? scheduleForm.rotationSteps : [],
    }

    setSchedules((prev) =>
      editingSchedule ? prev.map((schedule) => (schedule.id === payload.id ? payload : schedule)) : [...prev, payload]
    )

    setScheduleDialogOpen(false)
    setEditingSchedule(null)
    resetScheduleForm()
  }

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id))
    setAssignments((prev) => prev.filter((asgn) => asgn.scheduleId !== id))
    if (assignmentForm.scheduleId === id) {
      const fallback = schedules.find((schedule) => schedule.id !== id)
      setAssignmentForm((prev) => ({ ...prev, scheduleId: fallback?.id ?? "" }))
    }
  }

  const addAssignment = () => {
    if (!assignmentForm.scheduleId || !assignmentForm.targetId) return

    const duplicate = assignments.some(
      (asgn) =>
        asgn.scheduleId === assignmentForm.scheduleId &&
        asgn.targetType === assignmentForm.targetType &&
        asgn.targetId === assignmentForm.targetId
    )
    if (duplicate) return

    setAssignments((prev) => [...prev, { id: `asg-${Date.now()}`, ...assignmentForm }])
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="pl-16 lg:pl-64">
        <Header systemStatus="connected" />

        <main className="space-y-6 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Horaires et plannings RH</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestion simple des horaires fixes et des quarts tournants (ex: 2 jours 07h-14h puis 2 jours 14h-22h).
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-primary" />
              Couverture hebdomadaire: <span className="font-semibold text-foreground">{planningCoverage}%</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vue d'ensemble</CardTitle>
                <CardDescription>Indicateurs clés pour pilotage RH</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-md border p-2">
                  <span>Plannings actifs</span>
                  <Badge variant="secondary">{schedules.length}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <span>Affectations en place</span>
                  <Badge variant="secondary">{assignments.length}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <span>Alertes qualité</span>
                  <Badge variant={alerts.length ? "destructive" : "secondary"}>{alerts.length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Templates rapides</CardTitle>
                <CardDescription>Appliquez une structure de planning standard en un clic</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-3">
                {planningTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        type: template.data.type,
                        startTime: template.data.startTime,
                        endTime: template.data.endTime,
                        workDays: template.data.workDays,
                        rotationEnabled: template.data.rotationEnabled,
                        rotationSteps: template.data.rotationSteps,
                      }))
                    }
                  >
                    <Clock3 className="mr-2 h-4 w-4" />
                    {template.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Bibliothèque de plannings</CardTitle>
                  <CardDescription>Définissez des plages de travail normalisées et faciles à maintenir</CardDescription>
                </div>
                <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingSchedule(null)
                        resetScheduleForm()
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau planning
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingSchedule ? "Modifier" : "Créer"} un planning</DialogTitle>
                      <DialogDescription>Créez un planning simple, lisible et applicable à plusieurs équipes.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom du planning</Label>
                        <Input
                          value={scheduleForm.name}
                          onChange={(e) => setScheduleForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Ex: Équipe accueil matin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={scheduleForm.type}
                          onValueChange={(value: WorkSchedule["type"]) =>
                            setScheduleForm((p) => ({
                              ...p,
                              type: value,
                              rotationEnabled: value === "Quart" ? p.rotationEnabled : false,
                              rotationSteps: value === "Quart" ? p.rotationSteps : [],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Horaire">Horaire fixe</SelectItem>
                            <SelectItem value="Quart">Quart</SelectItem>
                            <SelectItem value="Repos">Repos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Début</Label>
                          <Input
                            type="time"
                            value={scheduleForm.startTime}
                            onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fin</Label>
                          <Input
                            type="time"
                            value={scheduleForm.endTime}
                            onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))}
                          />
                        </div>
                      </div>

                      {scheduleForm.type === "Quart" && (
                        <div className="space-y-3 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm">Quart tournant</Label>
                              <p className="text-xs text-muted-foreground">Activez si une équipe change de tranche horaire tous les X jours.</p>
                            </div>
                            <Switch
                              checked={scheduleForm.rotationEnabled}
                              onCheckedChange={(checked) =>
                                setScheduleForm((prev) => ({
                                  ...prev,
                                  rotationEnabled: checked,
                                  rotationSteps: checked && prev.rotationSteps.length < 2 ? defaultRotationSteps : prev.rotationSteps,
                                }))
                              }
                            />
                          </div>

                          {scheduleForm.rotationEnabled && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                Exemple: 2 jours 07h-14h, 2 jours 14h-22h, puis rotation automatique.
                              </p>
                              {scheduleForm.rotationSteps.map((step, index) => (
                                <div key={step.id} className="grid grid-cols-12 gap-2 rounded-md border p-2">
                                  <Input
                                    className="col-span-3"
                                    value={step.label}
                                    placeholder={`Phase ${index + 1}`}
                                    onChange={(e) =>
                                      setScheduleForm((prev) => ({
                                        ...prev,
                                        rotationSteps: prev.rotationSteps.map((item) =>
                                          item.id === step.id ? { ...item, label: e.target.value } : item
                                        ),
                                      }))
                                    }
                                  />
                                  <Input
                                    className="col-span-3"
                                    type="time"
                                    value={step.startTime}
                                    onChange={(e) =>
                                      setScheduleForm((prev) => ({
                                        ...prev,
                                        rotationSteps: prev.rotationSteps.map((item) =>
                                          item.id === step.id ? { ...item, startTime: e.target.value } : item
                                        ),
                                      }))
                                    }
                                  />
                                  <Input
                                    className="col-span-3"
                                    type="time"
                                    value={step.endTime}
                                    onChange={(e) =>
                                      setScheduleForm((prev) => ({
                                        ...prev,
                                        rotationSteps: prev.rotationSteps.map((item) =>
                                          item.id === step.id ? { ...item, endTime: e.target.value } : item
                                        ),
                                      }))
                                    }
                                  />
                                  <Input
                                    className="col-span-2"
                                    type="number"
                                    min={1}
                                    value={step.durationDays}
                                    onChange={(e) =>
                                      setScheduleForm((prev) => ({
                                        ...prev,
                                        rotationSteps: prev.rotationSteps.map((item) =>
                                          item.id === step.id ? { ...item, durationDays: Number(e.target.value || 0) } : item
                                        ),
                                      }))
                                    }
                                  />
                                  <Button
                                    className="col-span-1"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      setScheduleForm((prev) => ({
                                        ...prev,
                                        rotationSteps: prev.rotationSteps.filter((item) => item.id !== step.id),
                                      }))
                                    }
                                    disabled={scheduleForm.rotationSteps.length <= 2}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setScheduleForm((prev) => ({
                                    ...prev,
                                    rotationSteps: [
                                      ...prev.rotationSteps,
                                      { id: `rot-${Date.now()}`, label: "Nouvelle phase", startTime: "07:00", endTime: "14:00", durationDays: 2 },
                                    ],
                                  }))
                                }
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter une phase
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Jours de travail</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {weekDays.map((day) => {
                            const selected = scheduleForm.workDays.includes(day)
                            return (
                              <Button
                                key={day}
                                type="button"
                                variant={selected ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setScheduleForm((prev) => ({
                                    ...prev,
                                    workDays: selected
                                      ? prev.workDays.filter((item) => item !== day)
                                      : [...prev.workDays, day],
                                  }))
                                }
                              >
                                {day}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={submitSchedule} disabled={!scheduleForm.name.trim() || scheduleForm.workDays.length === 0}>
                        Enregistrer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {schedule.name} <Badge className={getTypeStyle(schedule.type)}>{schedule.type}</Badge>
                        {schedule.rotationEnabled && (
                          <Badge variant="outline" className="ml-2">
                            <Repeat2 className="mr-1 h-3 w-3" />
                            Tournant
                          </Badge>
                        )}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        {schedule.type === "Quart" ? <MoonStar className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                      {schedule.rotationEnabled && schedule.rotationSteps.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Rotation: {getRotationSummary(schedule.rotationSteps)} (cycle {getRotationCycleDays(schedule.rotationSteps)} jours)
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSchedule(schedule)
                          setScheduleForm({
                            name: schedule.name,
                            type: schedule.type,
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                            workDays: schedule.workDays,
                            rotationEnabled: schedule.rotationEnabled,
                            rotationSteps: schedule.rotationSteps,
                          })
                          setScheduleDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const isActive = schedule.workDays.includes(day)
                      return (
                        <div
                          key={`${schedule.id}-${day}`}
                          className={`rounded-md border px-2 py-1 text-center text-xs ${isActive ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"}`}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Affectation des plannings</CardTitle>
              <CardDescription>Associez un planning à un département ou à un groupe opérationnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Select value={assignmentForm.scheduleId} onValueChange={(v) => setAssignmentForm((p) => ({ ...p, scheduleId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Planning" />
                  </SelectTrigger>
                  <SelectContent>{schedules.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select
                  value={assignmentForm.targetType}
                  onValueChange={(v: Assignment["targetType"]) => setAssignmentForm((p) => ({ ...p, targetType: v, targetId: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Département">Département</SelectItem>
                    <SelectItem value="Groupe">Groupe</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assignmentForm.targetId} onValueChange={(v) => setAssignmentForm((p) => ({ ...p, targetId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTargets.map((target) => (
                      <SelectItem key={target.id} value={target.id}>{target.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addAssignment}>
                  <UserRoundCog className="mr-2 h-4 w-4" />
                  Attribuer
                </Button>
              </div>

              {alerts.length > 0 && (
                <div className="flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-50 p-3 text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <p className="text-sm">Certains plannings doivent être complétés (nom, jours ou cycle de rotation) avant diffusion.</p>
                </div>
              )}

              <div className="space-y-2">
                {assignments.map((asgn) => {
                  const schedule = schedules.find((s) => s.id === asgn.scheduleId)
                  const target =
                    asgn.targetType === "Département"
                      ? defaultDepartments.find((d) => d.id === asgn.targetId)
                      : defaultGroups.find((g) => g.id === asgn.targetId)
                  return (
                    <div key={asgn.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <p>
                        <span className="font-medium">{schedule?.name ?? "Planning supprimé"}</span> → {asgn.targetType}: {target?.name ?? "Cible supprimée"}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setAssignments((prev) => prev.filter((a) => a.id !== asgn.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-md border p-3">
                <p className="mb-2 text-sm font-medium">Lecture visuelle des jours</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {weekDays.map((day) => (
                    <div key={day} className="rounded-md border bg-muted/30 p-2 text-xs">
                      <p className="font-semibold">{dayLabels[day]}</p>
                      <p className="text-muted-foreground">
                        {assignments.filter((asgn) => schedules.find((schedule) => schedule.id === asgn.scheduleId)?.workDays.includes(day)).length} affectation(s)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
