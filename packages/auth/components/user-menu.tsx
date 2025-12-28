"use client"

import { useSession } from "next-auth/react"
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
import { signOut } from "next-auth/react"
import { User, LogOut, Shield, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Session } from "next-auth"

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
  session: Session | null
  status: string
  translations: {
    myAccount: string
    viewPanel: string
    dashboard: string
    admin: string
    logout: string
    signIn: string
  }
}

// Standalone menu content that accepts session as prop (used in Navigation)
export function UserMenuContent({ session, status, translations: t }: UserMenuContentProps) {
  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/login">
          <User className="mr-2 h-4 w-4" />
          {t.signIn}
        </Link>
      </Button>
    )
  }

  const initials = `${session.user.firstName?.[0] || ""}${session.user.lastName?.[0] || ""}`.toUpperCase() || session.user.username?.[0]?.toUpperCase() || "U"
  const isAdmin = session.user.isPterodactylAdmin || session.user.isVirtfusionAdmin || session.user.isSystemAdmin

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
                {session.user.firstName} {session.user.lastName}
              </p>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {t.admin}
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
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
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              {t.admin}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Original UserMenu export for backwards compatibility (when not in Navigation)
export function UserMenu({ translations: t }: UserMenuProps) {
  const { data: session, status } = useSession()
  
  return <UserMenuContent session={session} status={status} translations={t} />
}
