"use client"

import { useAuth } from "@/packages/auth"
import { Avatar, AvatarFallback } from "@/packages/ui/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { User, LogOut, Shield, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { User as UserType } from "@/packages/auth/lib/auth-client"
import { canAccessAdmin, isStaffUser } from "@/packages/auth/lib/auth-client"

interface UserMenuProps {
  translations: {
    myAccount: string
    viewPanel: string
    dashboard: string
    admin: string
    logout: string
    signIn: string
  }
}

interface UserMenuContentProps {
  user: UserType | null
  isLoading: boolean
  onLogout: () => Promise<void>
  translations: {
    myAccount: string
    viewPanel: string
    dashboard: string
    admin: string
    logout: string
    signIn: string
  }
}

// Standalone menu content that accepts user as prop (used in Navigation)
export function UserMenuContent({ user, isLoading, onLogout, translations: t }: UserMenuContentProps) {
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/login">
          <User className="mr-2 h-4 w-4" />
          {t.signIn}
        </Link>
      </Button>
    )
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"
  const isAdmin = isStaffUser(user)
  const canAdmin = canAccessAdmin(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isAdmin && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
              <Shield className="h-2.5 w-2.5 text-white" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {t.admin}
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {t.dashboard}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://panel.nodebyte.host"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t.viewPanel}
          </Link>
        </DropdownMenuItem>
        {canAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              {t.admin}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Original UserMenu export for backwards compatibility
export function UserMenu({ translations: t }: UserMenuProps) {
  const { user, isLoading, logout } = useAuth()
  
  return <UserMenuContent user={user} isLoading={isLoading} onLogout={logout} translations={t} />
}
