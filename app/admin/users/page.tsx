"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Users,
  Search,
  RefreshCw,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/packages/ui/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/packages/ui/components/ui/dialog"
import { Label } from "@/packages/ui/components/ui/label"
import { Switch } from "@/packages/ui/components/ui/switch"
import { Checkbox } from "@/packages/ui/components/ui/checkbox"
import { useToast } from "@/packages/ui/components/ui/use-toast"
import { cn } from "@/packages/core/lib/utils"

interface User {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  roles?: string[]
  isAdmin: boolean
  isSystemAdmin?: boolean
  isMigrated: boolean
  isActive: boolean
  pterodactylId: number | null
  createdAt: string
  lastLoginAt: string | null
  lastSyncedAt: string | null
  _count?: {
    servers: number
    sessions: number
  }
}

interface UserMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

type SortField = "username" | "email" | "createdAt" | "lastLoginAt"
type SortOrder = "asc" | "desc"
type FilterStatus = "all" | "active" | "inactive" | "admin" | "migrated" | "not-migrated"

export default function UsersPage() {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<UserMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  
  // Role management dialog state
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRoles, setEditingRoles] = useState({ isAdmin: false, isSystemAdmin: false, isActive: true, roles: [] as string[] })
  const [savingRole, setSavingRole] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchUsers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        sortField,
        sortOrder,
        filter: filterStatus,
        ...(debouncedSearch && { search: debouncedSearch }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setMeta(data.meta)
      } else {
        toast({
          title: t("error.title"),
          description: data.error || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: "Failed to connect to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [currentPage, perPage, sortField, sortOrder, filterStatus, debouncedSearch, t, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <SortAsc className="h-3 w-3 ml-1" />
    ) : (
      <SortDesc className="h-3 w-3 ml-1" />
    )
  }

  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user)
    setEditingRoles({
      isAdmin: user.isAdmin,
      isSystemAdmin: user.isSystemAdmin || false,
      isActive: user.isActive,
      roles: user.roles || [],
    })
    setEditDialogOpen(true)
  }

  const handleSaveRoles = async () => {
    if (!editingUser) return
    setSavingRole(true)
    try {
      const response = await fetch("/api/admin/users/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          isAdmin: editingRoles.isAdmin,
          isSystemAdmin: editingRoles.isSystemAdmin,
          isActive: editingRoles.isActive,
          roles: editingRoles.roles,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Role updated",
          description: `${editingUser.username}'s role has been updated successfully`,
        })
        setEditDialogOpen(false)
        fetchUsers(true)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setSavingRole(false)
    }
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("users.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("users.description")}
          </p>
        </div>
        <Button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          {t("actions.refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("users.stats.total")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{meta?.total || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("users.stats.migrated")}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {users.filter((u) => u.isMigrated).length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("users.stats.admins")}</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {users.filter((u) => u.isAdmin).length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("users.stats.active")}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {users.filter((u) => u.isActive).length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("users.filters.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("users.filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:flex md:gap-2 md:items-center">
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as FilterStatus); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("users.filters.all")}</SelectItem>
                  <SelectItem value="active">{t("users.filters.active")}</SelectItem>
                  <SelectItem value="inactive">{t("users.filters.inactive")}</SelectItem>
                  <SelectItem value="admin">{t("users.filters.admin")}</SelectItem>
                  <SelectItem value="migrated">{t("users.filters.migrated")}</SelectItem>
                  <SelectItem value="not-migrated">{t("users.filters.notMigrated")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table className="text-xs sm:text-sm table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 w-[45%] sm:w-auto"
                    onClick={() => handleSort("username")}
                  >
                    <div className="flex items-center">
                      {t("users.table.user")}
                      <SortIcon field="username" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden sm:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      {t("users.table.email")}
                      <SortIcon field="email" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[55%] sm:w-auto">{t("users.table.status")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("users.table.pterodactyl")}</TableHead>
                  <TableHead 
                    className="hidden lg:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      {t("users.table.created")}
                      <SortIcon field="createdAt" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden xl:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("lastLoginAt")}
                  >
                    <div className="flex items-center">
                      {t("users.table.lastLogin")}
                      <SortIcon field="lastLoginAt" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="py-2 sm:py-4"><Skeleton className="h-10 w-full" /></TableCell>
                      <TableCell className="hidden sm:table-cell py-2 sm:py-4"><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell className="py-2 sm:py-4"><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell className="hidden md:table-cell py-2 sm:py-4"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="hidden lg:table-cell py-2 sm:py-4"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden xl:table-cell py-2 sm:py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8" />
                        <p>{t("users.empty.title")}</p>
                        {debouncedSearch && (
                          <p className="text-sm">{t("users.empty.searchHint")}</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="py-2 sm:py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0 text-xs">
                            <span className="font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium flex items-center gap-1 text-xs sm:text-sm">
                              <span className="truncate">{user.username}</span>
                              {user.isAdmin && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Shield className="h-3 w-3 text-amber-500 shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {t("users.badges.admin")}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            {/* Show email under username on mobile */}
                            <p className="text-xs text-muted-foreground truncate sm:hidden">
                              {user.email}
                            </p>
                            {(user.firstName || user.lastName) && (
                              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-1">
                          {user.isActive ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs w-fit">
                              {t("users.badges.active")}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs w-fit">
                              {t("users.badges.inactive")}
                            </Badge>
                          )}
                          {user.isMigrated && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs w-fit">
                              {t("users.badges.migrated")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2 sm:py-4">
                        {user.pterodactylId ? (
                          <Badge variant="secondary" className="text-xs">#{user.pterodactylId}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-2 sm:py-4">
                        <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell py-2 sm:py-4">
                        <span className="text-xs xl:text-sm text-muted-foreground">
                          {formatDateTime(user.lastLoginAt)}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(user)}
                          className="text-xs h-7"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t("users.pagination.showing", {
                  from: (currentPage - 1) * perPage + 1,
                  to: Math.min(currentPage * perPage, meta.total),
                  total: meta.total,
                })}
              </p>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex-1 sm:flex-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">{t("users.pagination.previous")}</span>
                </Button>
                <div className="flex items-center gap-1 text-sm">
                  <span>{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{meta.totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                  className="flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline mr-1">{t("users.pagination.next")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>
              {editingUser?.username} - {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="cursor-pointer flex-1">
                Account Active
              </Label>
              <Switch
                id="isActive"
                checked={editingRoles.isActive}
                onCheckedChange={(checked) =>
                  setEditingRoles((s) => ({ ...s, isActive: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isAdmin" className="cursor-pointer flex-1">
                Admin
              </Label>
              <Switch
                id="isAdmin"
                checked={editingRoles.isAdmin}
                onCheckedChange={(checked) =>
                  setEditingRoles((s) => ({ ...s, isAdmin: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isSystemAdmin" className="cursor-pointer flex-1">
                System Admin
              </Label>
              <Switch
                id="isSystemAdmin"
                checked={editingRoles.isSystemAdmin}
                onCheckedChange={(checked) =>
                  setEditingRoles((s) => ({ ...s, isSystemAdmin: checked }))
                }
              />
            </div>
            
            {/* User Roles */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">User Roles</p>
              <div className="space-y-2">
                {["MEMBER", "PARTNER", "SPONSOR", "TECH_TEAM", "SUPPORT_TEAM", "ADMINISTRATOR", "SUPER_ADMIN"].map(
                  (role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={editingRoles.roles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditingRoles((s) => ({
                              ...s,
                              roles: [...s.roles, role],
                            }))
                          } else {
                            setEditingRoles((s) => ({
                              ...s,
                              roles: s.roles.filter((r) => r !== role),
                            }))
                          }
                        }}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {role.replace(/_/g, " ")}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={savingRole}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRoles}
              disabled={savingRole}
              className="flex-1"
            >
              {savingRole ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

