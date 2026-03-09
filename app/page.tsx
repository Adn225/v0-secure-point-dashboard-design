import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { AccessStream } from "@/components/dashboard/access-stream"
import { DeviceHealth } from "@/components/dashboard/device-health"

// Mock data for demonstration
const kpiData = {
  presentToday: { count: 234, total: 256 },
  totalAbsences: 18,
  lateArrivals: 7,
  activeDevices: { count: 12, total: 12 },
}

const accessEvents = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Sarah Chen",
    department: "Engineering",
    deviceName: "Main Entrance A",
    status: "granted" as const,
    timestamp: "09:03:22",
  },
  {
    id: "2",
    employeeId: "EMP-042",
    name: "Michael Torres",
    department: "Marketing",
    deviceName: "Floor 3 Access",
    status: "granted" as const,
    timestamp: "09:02:58",
  },
  {
    id: "3",
    employeeId: "EMP-156",
    name: "Emily Watson",
    department: "Finance",
    deviceName: "Server Room",
    status: "denied" as const,
    timestamp: "09:02:31",
  },
  {
    id: "4",
    employeeId: "EMP-089",
    name: "James Liu",
    department: "Engineering",
    deviceName: "Main Entrance B",
    status: "granted" as const,
    timestamp: "09:01:45",
  },
  {
    id: "5",
    employeeId: "EMP-203",
    name: "Anna Kowalski",
    department: "HR",
    deviceName: "HR Office",
    status: "granted" as const,
    timestamp: "09:00:12",
  },
  {
    id: "6",
    employeeId: "EMP-078",
    name: "David Kim",
    department: "Sales",
    deviceName: "Main Entrance A",
    status: "granted" as const,
    timestamp: "08:59:33",
  },
  {
    id: "7",
    employeeId: "EMP-112",
    name: "Rachel Green",
    department: "Design",
    deviceName: "Creative Lab",
    status: "granted" as const,
    timestamp: "08:58:17",
  },
]

const devices = [
  {
    id: "dev-001",
    name: "Main Entrance A",
    type: "door_controller" as const,
    location: "Building A, Ground Floor",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-002",
    name: "Main Entrance B",
    type: "door_controller" as const,
    location: "Building A, Ground Floor",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-003",
    name: "Floor 2 Access",
    type: "door_controller" as const,
    location: "Building A, Floor 2",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-004",
    name: "Floor 3 Access",
    type: "door_controller" as const,
    location: "Building A, Floor 3",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-005",
    name: "Server Room",
    type: "reader" as const,
    location: "Building B, Basement",
    status: "warning" as const,
    lastSeen: "2 min ago",
  },
  {
    id: "dev-006",
    name: "HR Office",
    type: "door_controller" as const,
    location: "Building A, Floor 4",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-007",
    name: "Creative Lab",
    type: "door_controller" as const,
    location: "Building C, Floor 1",
    status: "online" as const,
    lastSeen: "Just now",
  },
  {
    id: "dev-008",
    name: "Parking Gate",
    type: "turnstile" as const,
    location: "Parking Lot",
    status: "online" as const,
    lastSeen: "Just now",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="pl-16 lg:pl-64">
        {/* Header */}
        <Header systemStatus="connected" />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time overview of attendance and access control
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-6">
            <KPICards data={kpiData} />
          </div>

          {/* Main Grid: Access Stream + Device Health */}
          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <AccessStream events={accessEvents} />
            <DeviceHealth devices={devices} />
          </div>
        </main>
      </div>
    </div>
  )
}
