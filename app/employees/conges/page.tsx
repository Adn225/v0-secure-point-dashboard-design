"use client"

import { useMemo, useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LeaveType = {
  id: string
  name: string
  quotaDays: number
}

type LeaveRequest = {
  id: string
  employee: string
  leaveTypeId: string
  startDate: string
  endDate: string
}

const defaultTypes: LeaveType[] = [
  { id: "lt-1", name: "Conge annuel", quotaDays: 26 },
  { id: "lt-2", name: "Conge maladie", quotaDays: 15 },
]

const defaultRequests: LeaveRequest[] = [
  { id: "lr-1", employee: "Yasmine A.", leaveTypeId: "lt-1", startDate: "2026-03-20", endDate: "2026-03-25" },
  { id: "lr-2", employee: "Hakim B.", leaveTypeId: "lt-2", startDate: "2026-04-02", endDate: "2026-04-04" },
]

export default function CongesPage() {
  const [leaveTypes, setLeaveTypes] = useState(defaultTypes)
  const [requests, setRequests] = useState(defaultRequests)

  const [typeForm, setTypeForm] = useState({ name: "", quotaDays: "" })
  const [requestForm, setRequestForm] = useState({
    employee: "",
    leaveTypeId: defaultTypes[0].id,
    startDate: "",
    endDate: "",
  })

  const totalConfiguredDays = useMemo(
    () => leaveTypes.reduce((sum, leaveType) => sum + leaveType.quotaDays, 0),
    [leaveTypes],
  )

  const addLeaveType = () => {
    const quota = Number(typeForm.quotaDays)
    if (!typeForm.name.trim() || Number.isNaN(quota) || quota <= 0) return

    setLeaveTypes((prev) => [...prev, { id: `lt-${Date.now()}`, name: typeForm.name.trim(), quotaDays: quota }])
    setTypeForm({ name: "", quotaDays: "" })
  }

  const deleteLeaveType = (id: string) => {
    const fallbackTypeId = leaveTypes.find((type) => type.id !== id)?.id
    setLeaveTypes((prev) => prev.filter((type) => type.id !== id))
    setRequests((prev) => prev.filter((request) => request.leaveTypeId !== id))
    if (requestForm.leaveTypeId === id && fallbackTypeId) {
      setRequestForm((prev) => ({ ...prev, leaveTypeId: fallbackTypeId }))
    }
  }

  const addLeaveRequest = () => {
    if (!requestForm.employee.trim() || !requestForm.startDate || !requestForm.endDate || leaveTypes.length === 0) return

    setRequests((prev) => [
      {
        id: `lr-${Date.now()}`,
        employee: requestForm.employee.trim(),
        leaveTypeId: requestForm.leaveTypeId,
        startDate: requestForm.startDate,
        endDate: requestForm.endDate,
      },
      ...prev,
    ])

    setRequestForm((prev) => ({ ...prev, employee: "", startDate: "", endDate: "" }))
  }

  const updateLeaveRequest = (id: string, patch: Partial<LeaveRequest>) =>
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, ...patch } : request)))

  const deleteLeaveRequest = (id: string) => setRequests((prev) => prev.filter((request) => request.id !== id))

  const getTypeLabel = (typeId: string) => leaveTypes.find((type) => type.id === typeId)?.name ?? "Type supprime"

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="pl-16 lg:pl-64">
        <Header systemStatus="connected" />

        <main className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Conges</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestion complete des conges: types, creation, modification et suppression.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Types de conge</CardTitle>
                <CardDescription>Configurer les types (annuel, maladie, exceptionnel...).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Nom du type</Label>
                  <Input
                    placeholder="Conge exceptionnel"
                    value={typeForm.name}
                    onChange={(event) => setTypeForm((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Quota (jours)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={typeForm.quotaDays}
                    onChange={(event) => setTypeForm((prev) => ({ ...prev, quotaDays: event.target.value }))}
                  />
                </div>
                <Button onClick={addLeaveType}>Ajouter un type</Button>

                <div className="rounded-lg border p-3 text-sm">
                  Total des jours configures: <Badge variant="secondary">{totalConfiguredDays}</Badge>
                </div>

                <div className="space-y-2">
                  {leaveTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-muted-foreground">Quota: {type.quotaDays} jours</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => deleteLeaveType(type.id)}>
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demandes de conges</CardTitle>
                <CardDescription>Creer, modifier et supprimer les demandes de conges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Input
                    placeholder="Employe"
                    value={requestForm.employee}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, employee: event.target.value }))}
                  />
                  <Select
                    value={requestForm.leaveTypeId}
                    onValueChange={(value) => setRequestForm((prev) => ({ ...prev, leaveTypeId: value }))}
                    disabled={leaveTypes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de conge" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={requestForm.startDate}
                      onChange={(event) => setRequestForm((prev) => ({ ...prev, startDate: event.target.value }))}
                    />
                    <Input
                      type="date"
                      value={requestForm.endDate}
                      onChange={(event) => setRequestForm((prev) => ({ ...prev, endDate: event.target.value }))}
                    />
                  </div>
                  <Button onClick={addLeaveRequest} disabled={leaveTypes.length === 0}>
                    Creer une demande
                  </Button>
                </div>

                <div className="space-y-2">
                  {requests.map((request) => (
                    <div key={request.id} className="space-y-3 rounded-lg border p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{request.employee}</p>
                        <Badge variant="secondary">{getTypeLabel(request.leaveTypeId)}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={request.startDate}
                          onChange={(event) => updateLeaveRequest(request.id, { startDate: event.target.value })}
                        />
                        <Input
                          type="date"
                          value={request.endDate}
                          onChange={(event) => updateLeaveRequest(request.id, { endDate: event.target.value })}
                        />
                      </div>

                      <Button size="sm" variant="outline" onClick={() => deleteLeaveRequest(request.id)}>
                        Supprimer la demande
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
