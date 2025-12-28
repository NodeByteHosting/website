"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Shield,
  Bell,
  CreditCard,
  Loader2,
  Save,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { Switch } from "@/packages/ui/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/ui/tabs"
import { useToast } from "@/packages/ui/components/ui/use-toast"

interface UserProfile {
  id: string
  email: string
  username: string | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  companyName: string | null
  billingEmail: string | null
  emailVerified: string | null
  roles: string[]
  createdAt: string
  lastLoginAt: string | null
}

export default function AccountPage() {
  const { data: session, update: updateSession } = useSession()
  const t = useTranslations("dashboard.account")
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Form state for profile
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    companyName: "",
    billingEmail: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/dashboard/account")
        const data = await response.json()
        if (data.success) {
          setProfile(data.data)
          setFormData({
            firstName: data.data.firstName || "",
            lastName: data.data.lastName || "",
            username: data.data.username || "",
            phoneNumber: data.data.phoneNumber || "",
            companyName: data.data.companyName || "",
            billingEmail: data.data.billingEmail || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/dashboard/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        await updateSession()
        toast({
          title: t("profile.success"),
          description: t("profile.successDescription"),
        })
      } else {
        toast({
          title: t("profile.error"),
          description: data.error || t("profile.errorDescription"),
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: t("profile.error"),
        description: t("profile.errorDescription"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t("security.passwordMismatch"),
        description: t("security.passwordMismatchDescription"),
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: t("security.passwordTooShort"),
        description: t("security.passwordTooShortDescription"),
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/dashboard/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast({
          title: t("security.passwordChanged"),
          description: t("security.passwordChangedDescription"),
        })
      } else {
        toast({
          title: t("security.error"),
          description: data.error || t("security.errorDescription"),
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: t("security.error"),
        description: t("security.errorDescription"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("description")}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tabs.profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tabs.security")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("profile.overview")}
              </CardTitle>
              <CardDescription>{t("profile.overviewDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {(profile?.firstName?.[0] || profile?.username?.[0] || profile?.email?.[0] || "U").toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">
                      {profile?.firstName && profile?.lastName 
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile?.username || profile?.email}
                    </h3>
                    {profile?.emailVerified ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <Check className="h-3 w-3 mr-1" />
                        {t("profile.verified")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {t("profile.unverified")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile?.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personalInfo")}</CardTitle>
              <CardDescription>{t("profile.personalInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder={t("profile.firstNamePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder={t("profile.lastNamePlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t("profile.username")}</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={t("profile.usernamePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">{t("profile.emailNote")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("profile.phoneNumber")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder={t("profile.phoneNumberPlaceholder")}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t("profile.companyName")}</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder={t("profile.companyNamePlaceholder")}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingEmail">{t("profile.billingEmail")}</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="billingEmail"
                        type="email"
                        value={formData.billingEmail}
                        onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                        placeholder={t("profile.billingEmailPlaceholder")}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t("profile.saveChanges")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                {t("security.changePassword")}
              </CardTitle>
              <CardDescription>{t("security.changePasswordDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("security.currentPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("security.newPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("security.passwordRequirements")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("security.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    {t("security.updatePassword")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Email Verification Status */}
          {!profile?.emailVerified && (
            <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-300">
                {t("security.emailNotVerified")}
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                {t("security.emailNotVerifiedDescription")}
                <Button variant="link" className="px-0 h-auto font-medium text-yellow-800 dark:text-yellow-300">
                  {t("security.resendVerification")}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("security.accountInfo")}</CardTitle>
              <CardDescription>{t("security.accountInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">{t("security.accountCreated")}</span>
                <span className="text-sm font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">{t("security.lastLogin")}</span>
                <span className="text-sm font-medium">
                  {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">{t("security.accountId")}</span>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{profile?.id}</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
