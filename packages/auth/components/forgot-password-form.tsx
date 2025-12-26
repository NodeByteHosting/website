"use client"

import { useState } from "react"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react"

interface ForgotPasswordFormProps {
  translations: {
    emailLabel: string
    emailPlaceholder: string
    submitButton: string
    submitting: string
    successTitle: string
    successDescription: string
    errors: {
      emailRequired: string
      invalidEmail: string
      networkError: string
      generic: string
    }
  }
}

export function ForgotPasswordForm({ translations: t }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Client-side validation
    if (!email) {
      setError(t.errors.emailRequired)
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t.errors.invalidEmail)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t.errors.generic)
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
    } catch (err) {
      setError(t.errors.networkError)
      console.error("Forgot password error:", err)
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
            Check your email for password reset instructions.
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
        <Label htmlFor="email">{t.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            <Mail className="mr-2 h-4 w-4" />
            {t.submitButton}
          </>
        )}
      </Button>
    </form>
  )
}
