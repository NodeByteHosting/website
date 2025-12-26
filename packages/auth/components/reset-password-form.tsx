"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react"

interface ResetPasswordFormProps {
  token: string
  translations: {
    passwordLabel: string
    passwordPlaceholder: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    submitButton: string
    submitting: string
    successTitle: string
    successDescription: string
    errors: {
      passwordRequired: string
      passwordTooShort: string
      passwordsDontMatch: string
      invalidToken: string
      tokenExpired: string
      networkError: string
      generic: string
    }
  }
}

export function ResetPasswordForm({ token, translations: t }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Client-side validation
    if (!password) {
      setError(t.errors.passwordRequired)
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t.errors.passwordTooShort)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(t.errors.passwordsDontMatch)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMap: Record<string, string> = {
          invalid_token: t.errors.invalidToken,
          token_expired: t.errors.tokenExpired,
        }
        setError(errorMap[data.error] || t.errors.generic)
        setIsLoading(false)
        return
      }

      setIsSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      setError(t.errors.networkError)
      console.error("Reset password error:", err)
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Alert className="border-primary/20 bg-primary/5">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertTitle>{t.successTitle}</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>{t.successDescription}</p>
          <p className="text-xs text-muted-foreground">
            Redirecting to login...
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">{t.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="h-10"
          required
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">{t.confirmPasswordLabel}</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder={t.confirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="h-10"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            {t.submitButton}
          </>
        )}
      </Button>
    </form>
  )
}
