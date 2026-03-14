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
import { CalendarDays, Edit, Plus, Trash2 } from "lucide-react"

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

const defaultDepartments = [
  { id: "dep-001", name: "IT" },
  { id: "dep-002", name: "RH" },
  { id: "dep-003", name: "Operations" },
]

const defaultGroups = [
  { id: "grp-001", name: "Batiment A" },
  { id: "grp-002", name: "Salle serveur" },
  { id: "grp-003", name: "Parking" },
]

const defaultSchedules: WorkSchedule[] = [
  { id: "sch-001", name: "Bureau standard", type: "Horaire", startTime: "09:00", endTime: "18:00", workDays: "Lun-Ven" },
  { id: "sch-002", name: "Quart nuit", type: "Quart", startTime: "22:00", endTime: "06:00", workDays: "Lun-Sam" },
  { id: "sch-003", name: "Repos weekend", type: "Repos", startTime: "00:00", endTime: "23:59", workDays: "Sam-Dim" },
]

const defaultAssignments: Assignment[] = [
  { id: "asg-001", scheduleId: "sch-001", targetType: "Departement", targetId: "dep-001" },
  { id: "asg-002", scheduleId: "sch-002", targetType: "Groupe", targetId: "grp-002" },
]

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
    workDays: string
  }>({ name: "", type: "Horaire", startTime: "09:00", endTime: "18:00", workDays: "Lun-Ven" })

  const [assignmentForm, setAssignmentForm] = useState({
    scheduleId: defaultSchedules[0].id,
    targetType: "Departement" as Assignment["targetType"],
    targetId: defaultDepartments[0].id,
  })

  const availableTargets = useMemo(() => {
    return assignmentForm.targetType === "Departement" ? defaultDepartments : defaultGroups
  }, [assignmentForm.targetType])

  const resetScheduleForm = () =>
    setScheduleForm({ name: "", type: "Horaire", startTime: "09:00", endTime: "18:00", workDays: "Lun-Ven" })

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

        <main className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Horaires et planning</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gestion des horaires, quarts, repos et affectations.</p>
          </div>

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
                      <DialogDescription>Renseignez les details de ce planning.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input value={scheduleForm.name} onChange={(e) => setScheduleForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Debut</Label>
                          <Input type="time" value={scheduleForm.startTime} onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Fin</Label>
                          <Input type="time" value={scheduleForm.endTime} onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Jours</Label>
                        <Input value={scheduleForm.workDays} onChange={(e) => setScheduleForm((p) => ({ ...p, workDays: e.target.value }))} placeholder="Ex: Lun-Ven" />
                      </div>
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
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{schedule.name} <Badge variant="secondary">{schedule.type}</Badge></p>
                      <p className="text-xs text-muted-foreground">{schedule.startTime} - {schedule.endTime} • {schedule.workDays}</p>
                    </div>
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
                  const target = asgn.targetType === "Departement" ? defaultDepartments.find((d) => d.id === asgn.targetId) : defaultGroups.find((g) => g.id === asgn.targetId)
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
        </main>
      </div>
    </div>
  )
}
