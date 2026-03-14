import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const approvalRules = [
  "Definir qui doit approuver selon le type de demande",
  "Associer les workflows par groupe, service ou personne",
  "Suivre les demandes en attente d'approbation",
]

const approvalActions = [
  "Soumettre une demande (conge, permission, absence justifiee)",
  "Approuver une demande",
  "Annuler une demande d'approbation",
]

export default function ApprovalPage() {
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
                <CardDescription>Configurer les responsables et perimetres d'approbation.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {approvalRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions sur les demandes</CardTitle>
                <CardDescription>Traiter les demandes RH de bout en bout.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {approvalActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
