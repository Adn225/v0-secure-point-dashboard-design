import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const leaveManagementItems = [
  "Configurer les types de conge (annuel, maladie, exceptionnel...)",
  "Creer des demandes de conges",
  "Modifier les demandes existantes",
  "Supprimer des demandes de conges",
]

export default function CongesPage() {
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

          <Card>
            <CardHeader>
              <CardTitle>Administration des conges</CardTitle>
              <CardDescription>Centraliser toutes les operations de gestion des conges.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {leaveManagementItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
