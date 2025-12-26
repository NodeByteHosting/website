"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, UserPlus, CheckCircle2, Server, Zap, Clock, Gamepad2, Info } from "lucide-react"
import Link from "next/link"

interface RegisterFormProps {
  translations: {
    title: string
    description: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    registerButton: string
    registering: string
    alreadyHaveAccount: string
    signIn: string
    errors: {
      emailExists: string
      panelAccountLinked: string
      passwordsDontMatch: string
      passwordTooShort: string
      invalidEmail: string
      networkError: string
      generic: string
    }
    success: {
      title: string
      description: string
    }
  }
}

export function RegisterForm({ translations: t }: RegisterFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    // Client-side validation
    if (password.length < 8) {
      setFormError(t.errors.passwordTooShort)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setFormError(t.errors.passwordsDontMatch)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        const errorMap: Record<string, string> = {
          email_exists: t.errors.emailExists,
          panel_account_linked: t.errors.panelAccountLinked,
          passwords_dont_match: t.errors.passwordsDontMatch,
          password_too_short: t.errors.passwordTooShort,
          invalid_email: t.errors.invalidEmail,
        }
        setFormError(errorMap[data.error] || t.errors.generic)
        setIsLoading(false)
        return
      }

      // Success!
      setIsSuccess(true)
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch {
      setFormError(t.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Server, label: "Manage your servers" },
    { icon: Zap, label: "Instant access" },
    { icon: Clock, label: "24/7 availability" },
    { icon: Gamepad2, label: "Game panel integration" },
  ]

  if (isSuccess) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-8 mt-16">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t.success.title}</h2>
            <p className="text-muted-foreground">{t.success.description}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] grid lg:grid-cols-2 mt-16">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-38">
        <div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Create your
              <span className="block bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                NodeByte account
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Register to access your game servers, view statistics, and manage your hosting services.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NodeByte Hosting. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t.emailLabel}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 text-base"
                    disabled={isLoading}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t.passwordLabel}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 text-base"
                    disabled={isLoading}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t.confirmPasswordLabel}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 text-base"
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.registering}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t.registerButton}
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              {t.alreadyHaveAccount}{" "}
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline"
              >
                {t.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
