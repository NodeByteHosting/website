import { RegisterForm } from "@/packages/auth/components/register-form"
import { getTranslations } from "next-intl/server"

export const metadata = {
  title: "Register",
  description: "Create your NodeByte Hosting account to access your game servers and services.",
}

export default async function RegisterPage() {
  const t = await getTranslations("auth.register")

  const translations = {
    title: t("title"),
    description: t("description"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    confirmPasswordLabel: t("confirmPasswordLabel"),
    confirmPasswordPlaceholder: t("confirmPasswordPlaceholder"),
    registerButton: t("registerButton"),
    registering: t("registering"),
    alreadyHaveAccount: t("alreadyHaveAccount"),
    signIn: t("signIn"),
    errors: {
      emailExists: t("errors.emailExists"),
      notInPanel: t("errors.notInPanel"),
      panelAccountLinked: t("errors.panelAccountLinked"),
      passwordsDontMatch: t("errors.passwordsDontMatch"),
      passwordTooShort: t("errors.passwordTooShort"),
      invalidEmail: t("errors.invalidEmail"),
      networkError: t("errors.networkError"),
      generic: t("errors.generic"),
    },
    success: {
      title: t("success.title"),
      description: t("success.description"),
    },
  }

  return <RegisterForm translations={translations} />
}
