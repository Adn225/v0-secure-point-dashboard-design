"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, Bell, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  systemStatus: "connected" | "disconnected" | "syncing"
}

export function Header({ systemStatus }: HeaderProps) {
  const statusConfig = {
    connected: {
      label: "API Connected",
      icon: Wifi,
      className: "text-primary bg-primary/10",
      dotColor: "bg-primary",
    },
    disconnected: {
      label: "API Offline",
      icon: WifiOff,
      className: "text-destructive bg-destructive/10",
      dotColor: "bg-destructive",
    },
    syncing: {
      label: "Syncing...",
      icon: Wifi,
      className: "text-warning bg-warning/10",
      dotColor: "bg-warning animate-pulse",
    },
  }

  const status = statusConfig[systemStatus]
  const StatusIcon = status.icon

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, devices..."
            className="h-9 w-64 bg-secondary pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-primary lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Status */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
            status.className
          )}
        >
          <div className={cn("h-2 w-2 rounded-full", status.dotColor)} />
          <StatusIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{status.label}</span>
        </div>

        {/* Add User Button */}
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add User</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-secondary text-xs text-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-card-foreground">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@securepoint.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
