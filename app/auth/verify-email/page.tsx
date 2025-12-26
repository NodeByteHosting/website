"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/packages/ui/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("auth.verifyEmail")
  
  const token = searchParams.get("token")
  const userId = searchParams.get("id")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token || !userId) {
      setStatus("error")
      setMessage(t("errors.invalidToken"))
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId }),
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          const errorMap: Record<string, string> = {
            token_expired: t("errors.tokenExpired"),
            invalid_token: t("errors.invalidToken"),
            already_verified: t("errors.alreadyVerified"),
          }
          setMessage(errorMap[data.error] || t("errors.generic"))
          return
        }

        setStatus("success")
        setMessage(t("successDescription"))

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } catch (error) {
        setStatus("error")
        setMessage(t("errors.networkError"))
      }
    }

    verifyEmail()
  }, [token, userId, router, t])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <Mail className="w-12 h-12 mx-auto text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              {status === "loading" && t("verifying")}
              {status === "success" && t("successTitle")}
              {status === "error" && "Verification Failed"}
            </h1>
          </div>

          {/* Status content */}
          {status === "loading" && (
            <div className="space-y-4 py-8 text-center">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground">{t("verifying")}</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <Alert className="border-primary/20 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-center text-sm text-muted-foreground">
                Redirecting to login... or{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  click here
                </Link>
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="flex flex-col gap-3 pt-4">
                <Button asChild>
                  <Link href="/auth/login">{t("backToLogin")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Create New Account</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
