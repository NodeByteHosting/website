import { getTranslations } from "next-intl/server"
import { auth } from "@/packages/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ResetPasswordForm } from "@/packages/auth/components"
import { ArrowLeft } from "lucide-react"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // Redirect if already logged in
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  const { token } = await searchParams

  if (!token) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-destructive/5 via-background to-background" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8 text-center">
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const t = await getTranslations("auth")

  const translations = {
    title: t("resetPassword.title"),
    description: t("resetPassword.description"),
    passwordLabel: t("resetPassword.passwordLabel"),
    passwordPlaceholder: t("resetPassword.passwordPlaceholder"),
    confirmPasswordLabel: t("resetPassword.confirmPasswordLabel"),
    confirmPasswordPlaceholder: t("resetPassword.confirmPasswordPlaceholder"),
    submitButton: t("resetPassword.submitButton"),
    submitting: t("resetPassword.submitting"),
    backToLogin: t("resetPassword.backToLogin"),
    successTitle: t("resetPassword.successTitle"),
    successDescription: t("resetPassword.successDescription"),
    errors: {
      passwordRequired: t("resetPassword.errors.passwordRequired"),
      passwordTooShort: t("resetPassword.errors.passwordTooShort"),
      passwordsDontMatch: t("resetPassword.errors.passwordsDontMatch"),
      invalidToken: t("resetPassword.errors.invalidToken"),
      tokenExpired: t("resetPassword.errors.tokenExpired"),
      networkError: t("resetPassword.errors.networkError"),
      generic: t("resetPassword.errors.generic"),
    },
  }

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
            <h1 className="text-3xl font-bold tracking-tight">
              {translations.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {translations.description}
            </p>
          </div>

          {/* Form */}
          <Suspense fallback={<div className="h-96 animate-pulse bg-card rounded-lg" />}>
            <ResetPasswordForm token={token} translations={translations} />
          </Suspense>

          {/* Back to login link */}
          <div className="flex items-center justify-center pt-4">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {translations.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
