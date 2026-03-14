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

type ApprovalRule = {
  id: string
  requestType: "Conge" | "Permission" | "Absence"
  scopeType: "Service" | "Groupe" | "Personne"
  scopeValue: string
  approver: string
}

type ApprovalRequest = {
  id: string
  applicant: string
  type: ApprovalRule["requestType"]
  reason: string
  status: "En attente" | "Approuvee" | "Annulee"
}

const defaultRules: ApprovalRule[] = [
  {
    id: "rule-1",
    requestType: "Conge",
    scopeType: "Service",
    scopeValue: "Ressources humaines",
    approver: "Nadia Ben Ali",
  },
  {
    id: "rule-2",
    requestType: "Permission",
    scopeType: "Groupe",
    scopeValue: "Equipe Support",
    approver: "Karim L.",
  },
]

const defaultRequests: ApprovalRequest[] = [
  {
    id: "req-1",
    applicant: "Samir H.",
    type: "Conge",
    reason: "Conge annuel",
    status: "En attente",
  },
  {
    id: "req-2",
    applicant: "Sana M.",
    type: "Absence",
    reason: "Absence justifiee",
    status: "Approuvee",
  },
]

export default function ApprovalPage() {
  const [rules, setRules] = useState(defaultRules)
  const [requests, setRequests] = useState(defaultRequests)

  const [ruleForm, setRuleForm] = useState({
    requestType: "Conge" as ApprovalRule["requestType"],
    scopeType: "Service" as ApprovalRule["scopeType"],
    scopeValue: "",
    approver: "",
  })

  const [requestForm, setRequestForm] = useState({
    applicant: "",
    type: "Conge" as ApprovalRequest["type"],
    reason: "",
  })

  const pendingCount = useMemo(() => requests.filter((request) => request.status === "En attente").length, [requests])

  const createRule = () => {
    if (!ruleForm.scopeValue.trim() || !ruleForm.approver.trim()) return

    setRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        requestType: ruleForm.requestType,
        scopeType: ruleForm.scopeType,
        scopeValue: ruleForm.scopeValue.trim(),
        approver: ruleForm.approver.trim(),
      },
    ])

    setRuleForm({
      requestType: "Conge",
      scopeType: "Service",
      scopeValue: "",
      approver: "",
    })
  }

  const submitRequest = () => {
    if (!requestForm.applicant.trim() || !requestForm.reason.trim()) return

    setRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        applicant: requestForm.applicant.trim(),
        type: requestForm.type,
        reason: requestForm.reason.trim(),
        status: "En attente",
      },
      ...prev,
    ])

    setRequestForm({ applicant: "", type: "Conge", reason: "" })
  }

  const approveRequest = (id: string) =>
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "Approuvee" } : request)))

  const cancelRequest = (id: string) =>
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "Annulee" } : request)))

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="pl-16 lg:pl-64">
        <Header systemStatus="connected" />

        <main className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Approval</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestion des roles d'approbation, des circuits de validation et des demandes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regles d'approbation</CardTitle>
                <CardDescription>Definir qui approuve selon le type de demande et le perimetre.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label>Type de demande</Label>
                    <Select
                      value={ruleForm.requestType}
                      onValueChange={(value: ApprovalRule["requestType"]) => setRuleForm((prev) => ({ ...prev, requestType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conge">Conge</SelectItem>
                        <SelectItem value="Permission">Permission</SelectItem>
                        <SelectItem value="Absence">Absence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Perimetre</Label>
                    <Select
                      value={ruleForm.scopeType}
                      onValueChange={(value: ApprovalRule["scopeType"]) => setRuleForm((prev) => ({ ...prev, scopeType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Groupe">Groupe</SelectItem>
                        <SelectItem value="Personne">Personne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Nom du perimetre</Label>
                    <Input
                      placeholder="Ex: IT, Equipe A, Yassine"
                      value={ruleForm.scopeValue}
                      onChange={(event) => setRuleForm((prev) => ({ ...prev, scopeValue: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Approbateur</Label>
                    <Input
                      placeholder="Nom du responsable"
                      value={ruleForm.approver}
                      onChange={(event) => setRuleForm((prev) => ({ ...prev, approver: event.target.value }))}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={createRule}>
                  Ajouter une regle
                </Button>

                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div key={rule.id} className="rounded-lg border p-3 text-sm">
                      <p className="font-medium">{rule.requestType}</p>
                      <p className="text-muted-foreground">
                        {rule.scopeType}: {rule.scopeValue}
                      </p>
                      <p className="text-muted-foreground">Approbateur: {rule.approver}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions sur les demandes</CardTitle>
                <CardDescription>Soumettre, approuver ou annuler les demandes RH.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-3 text-sm">
                  Demandes en attente: <Badge variant="secondary">{pendingCount}</Badge>
                </div>

                <div className="grid gap-3">
                  <Input
                    placeholder="Demandeur"
                    value={requestForm.applicant}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, applicant: event.target.value }))}
                  />
                  <Select
                    value={requestForm.type}
                    onValueChange={(value: ApprovalRequest["type"]) => setRequestForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conge">Conge</SelectItem>
                      <SelectItem value="Permission">Permission</SelectItem>
                      <SelectItem value="Absence">Absence justifiee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Motif"
                    value={requestForm.reason}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, reason: event.target.value }))}
                  />
                  <Button onClick={submitRequest}>Soumettre une demande</Button>
                </div>

                <div className="space-y-2">
                  {requests.map((request) => (
                    <div key={request.id} className="rounded-lg border p-3 text-sm">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="font-medium">
                          {request.applicant} - {request.type}
                        </p>
                        <Badge variant={request.status === "Approuvee" ? "default" : "secondary"}>{request.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">{request.reason}</p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveRequest(request.id)}
                          disabled={request.status !== "En attente"}
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelRequest(request.id)}
                          disabled={request.status !== "En attente"}
                        >
                          Annuler
                        </Button>
                      </div>
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
