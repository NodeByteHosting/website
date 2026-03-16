"use client"

import { useAuth } from "@/packages/auth"
import { Button } from "@/packages/ui/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useState } from "react"

interface LogoutButtonProps {
  translations: {
    logout: string
    loggingOut: string
  }
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
}

export function LogoutButton({
  translations: t,
  variant = "outline",
  size = "default",
  showIcon = true,
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.loggingOut}
        </>
      ) : (
        <>
          {showIcon && <LogOut className="mr-2 h-4 w-4" />}
          {t.logout}
        </>
      )}
    </Button>
  )
}
