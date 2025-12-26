import { getTranslations } from "next-intl/server"
import { auth } from "@/packages/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ForgotPasswordForm } from "@/packages/auth/components"
import { ArrowLeft } from "lucide-react"

export default async function ForgotPasswordPage() {
  // Redirect if already logged in
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  const t = await getTranslations("auth")

  const translations = {
    title: t("forgotPassword.title"),
    description: t("forgotPassword.description"),
    emailLabel: t("forgotPassword.emailLabel"),
    emailPlaceholder: t("forgotPassword.emailPlaceholder"),
    submitButton: t("forgotPassword.submitButton"),
    submitting: t("forgotPassword.submitting"),
    backToLogin: t("forgotPassword.backToLogin"),
    successTitle: t("forgotPassword.successTitle"),
    successDescription: t("forgotPassword.successDescription"),
    errors: {
      emailRequired: t("forgotPassword.errors.emailRequired"),
      invalidEmail: t("forgotPassword.errors.invalidEmail"),
      networkError: t("forgotPassword.errors.networkError"),
      generic: t("forgotPassword.errors.generic"),
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
            <ForgotPasswordForm translations={translations} />
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
