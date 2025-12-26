"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, Shield, ArrowRight, Server, Zap, Clock, Gamepad2, Wand2, ArrowLeft } from "lucide-react"
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
    step1: {
      title: string
      description: string
      continueButton: string
    }
    step2: {
      title: string
      description: string
      passwordOption: string
      passwordDescription: string
      magicLinkOption: string
      magicLinkDescription: string
      usePassword: string
      useMagicLink: string
    }
    step3: {
      passwordTitle: string
      passwordDescription: string
      loginButton: string
      loggingIn: string
      forgotPassword: string
    }
    errors: {
      invalid: string
      networkError: string
      generic: string
      invalidEmail: string
    }
  }
}

export function LoginFormMultiStep({ translations: t }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFormError(t.errors.invalidEmail)
      return
    }

    setStep(2)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setFormError(t.errors.invalid)
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setFormError(t.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setFormError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormError(data.message || t.errors.generic)
        setIsLoading(false)
        return
      }

      // Show success state - email is being sent
      setMagicLinkSent(true)
      setIsLoading(false)
    } catch {
      setFormError(t.errors.networkError)
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
      <div className="hidden lg:flex flex-col justify-between p-12">
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
            <h2 className="text-3xl font-bold tracking-tight">
              {step === 1 && t.step1.title}
              {step === 2 && t.step2.title}
              {step === 3 && t.step3.passwordTitle}
            </h2>
            <p className="text-muted-foreground">
              {step === 1 && t.step1.description}
              {step === 2 && t.step2.description}
              {step === 3 && t.step3.passwordDescription}
            </p>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {(error || formError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError || t.errors.generic}</AlertDescription>
                </Alert>
              )}

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

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {t.step1.continueButton}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

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
            </form>
          )}

          {/* Step 2: Password or Magic Link */}
          {step === 2 && !magicLinkSent && (
            <div className="space-y-6">
              {(error || formError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError || t.errors.generic}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {/* Password Option */}
                <button
                  onClick={() => setStep(3)}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-primary/50 bg-card/50 hover:bg-accent/30 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.step2.passwordOption}</p>
                      <p className="text-sm text-muted-foreground">{t.step2.passwordDescription}</p>
                    </div>
                  </div>
                </button>

                {/* Magic Link Option */}
                <button
                  onClick={handleMagicLink}
                  disabled={isLoading}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-accent/50 bg-card/50 hover:bg-accent/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors group-disabled:bg-accent/10">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      ) : (
                        <Wand2 className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.step2.magicLinkOption}</p>
                      <p className="text-sm text-muted-foreground">{t.step2.magicLinkDescription}</p>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          )}

          {/* Step 2: Magic Link Success */}
          {step === 2 && magicLinkSent && (
            <div className="space-y-6">
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Magic link sent!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  Check your email ({email}) for a sign-in link. The link will expire in 30 minutes.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Didn't receive an email?</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Check your spam folder</li>
                  <li>Make sure you entered the correct email address</li>
                </ul>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setMagicLinkSent(false)
                  setStep(1)
                  setEmail("")
                }}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try a different email
              </Button>
            </div>
          )}

          {/* Step 3: Password Entry */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {(error || formError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError || t.errors.generic}</AlertDescription>
                </Alert>
              )}

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

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(2)}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
