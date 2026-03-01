"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/packages/auth/lib/auth-context"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Alert, AlertDescription } from "@/packages/ui/components/ui/alert"
import { Loader2, Mail, Lock, ExternalLink, AlertCircle, Shield, Server, Zap, Clock, Gamepad2 } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  translations: {
    title: string
    description: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    loginButton: string
    loggingIn: string
    forgotPassword: string
    noAccount: string
    createAccount: string
    errors: {
      invalid: string
      networkError: string
      generic: string
    }
  }
}

export function LoginForm({ translations: t }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      router.push(callbackUrl)
      router.refresh()
    } catch (err: any) {
      setFormError(err.message || t.errors.invalid)
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

  return (
    <div className="w-full min-h-[calc(100vh-80px)] grid lg:grid-cols-2 mt-16">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-38">
        <div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to your
              <span className="block bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                game server dashboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Sign in to manage your servers, view statistics, and access your control panel.
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

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || formError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {formError || t.errors.generic}
                </AlertDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.passwordLabel}
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
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
                    autoComplete="current-password"
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
                  {t.loggingIn}
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  {t.loginButton}
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
              {t.noAccount}{" "}
              <Link
                href="/auth/register"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                {t.createAccount}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
