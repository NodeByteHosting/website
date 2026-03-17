"use client"

import { useState } from "react"
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Gamepad2,
  Server,
  ExternalLink,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  DollarSign,
  Tag,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Switch } from "@/packages/ui/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/packages/ui/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/packages/ui/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"
import { Textarea } from "@/packages/ui/components/ui/textarea"
import { Separator } from "@/packages/ui/components/ui/separator"
import { Alert, AlertDescription } from "@/packages/ui/components/ui/alert"
import { cn } from "@/packages/core/lib/utils"
import { LINKS } from "@/packages/core/constants/links"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceType = "game" | "vps"
type StockStatus = "in_stock" | "out_of_stock" | "coming_soon"

interface Product {
  id: string
  name: string
  slug: string
  type: ServiceType
  description: string
  priceGBP: number
  billingUrl: string
  enabled: boolean
  stock: StockStatus
  /** VPS only */
  cpuCores?: number
  ramGB?: number
  storageGB?: number
  bandwidthTB?: number | null
  /** Game server only */
  game?: string
}

// ─── Seed data (replace with API fetch when backend endpoint is ready) ────────

const SEED_PRODUCTS: Product[] = [
  // Game servers
  {
    id: "mc-budget",
    name: "Minecraft Budget",
    slug: "minecraft-budget",
    type: "game",
    game: "Minecraft",
    description: "Great for small friend groups and testing.",
    priceGBP: 4,
    billingUrl: `${LINKS.billing.minecraft}/budget`,
    enabled: true,
    stock: "in_stock",
  },
  {
    id: "mc-standard",
    name: "Minecraft Standard",
    slug: "minecraft-standard",
    type: "game",
    game: "Minecraft",
    description: "Most popular — handles mid-size communities.",
    priceGBP: 8,
    billingUrl: `${LINKS.billing.minecraft}/standard`,
    enabled: true,
    stock: "in_stock",
  },
  {
    id: "rust-standard",
    name: "Rust Standard",
    slug: "rust-standard",
    type: "game",
    game: "Rust",
    description: "Optimised for Rust servers up to 100 players.",
    priceGBP: 12,
    billingUrl: `${LINKS.billing.rust}/standard`,
    enabled: true,
    stock: "in_stock",
  },
  // VPS
  {
    id: "amd-starter",
    name: "AMD Starter",
    slug: "amd-starter",
    type: "vps",
    description: "Entry-level AMD VPS for personal projects.",
    priceGBP: 5,
    billingUrl: `${LINKS.billing.amdVps}/starter`,
    enabled: true,
    stock: "in_stock",
    cpuCores: 1,
    ramGB: 2,
    storageGB: 25,
    bandwidthTB: 1,
  },
  {
    id: "amd-standard",
    name: "AMD Standard",
    slug: "amd-standard",
    type: "vps",
    description: "Balanced AMD VPS for web apps and APIs.",
    priceGBP: 10,
    billingUrl: `${LINKS.billing.amdVps}/standard`,
    enabled: true,
    stock: "in_stock",
    cpuCores: 2,
    ramGB: 4,
    storageGB: 50,
    bandwidthTB: 2,
  },
  {
    id: "amd-performance",
    name: "AMD Performance",
    slug: "amd-performance",
    type: "vps",
    description: "High-performance AMD VPS. Unmetered bandwidth.",
    priceGBP: 20,
    billingUrl: `${LINKS.billing.amdVps}/performance`,
    enabled: true,
    stock: "in_stock",
    cpuCores: 4,
    ramGB: 8,
    storageGB: 100,
    bandwidthTB: null,
  },
  {
    id: "intel-core",
    name: "Intel Core",
    slug: "intel-core",
    type: "vps",
    description: "Entry-level Intel VPS.",
    priceGBP: 4.5,
    billingUrl: `${LINKS.billing.intelVps}/core`,
    enabled: false,
    stock: "out_of_stock",
    cpuCores: 1,
    ramGB: 2,
    storageGB: 25,
    bandwidthTB: 1,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "In Stock",
  out_of_stock: "Out of Stock",
  coming_soon: "Coming Soon",
}

const STOCK_VARIANTS: Record<StockStatus, "default" | "secondary" | "destructive" | "outline"> = {
  in_stock: "default",
  out_of_stock: "destructive",
  coming_soon: "secondary",
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  slug: "",
  type: "vps",
  description: "",
  priceGBP: 0,
  billingUrl: "",
  enabled: true,
  stock: "in_stock",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductRow({
  product,
  onEdit,
  onToggle,
  onDelete,
}: {
  product: Product
  onEdit: (p: Product) => void
  onToggle: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  return (
    <TableRow className={cn(!product.enabled && "opacity-60")}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {product.type === "game" ? (
            <Gamepad2 className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Server className="h-4 w-4 text-blue-400 shrink-0" />
          )}
          <span>{product.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{product.description}</TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {product.game ?? (product.type === "vps" ? "VPS" : "—")}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">£{product.priceGBP.toFixed(2)}</TableCell>
      <TableCell>
        <Badge variant={STOCK_VARIANTS[product.stock]}>{STOCK_LABELS[product.stock]}</Badge>
      </TableCell>
      <TableCell>
        <Switch
          checked={product.enabled}
          onCheckedChange={() => onToggle(product)}
          aria-label="Toggle product"
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(product)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
            <Link href={product.billingUrl} target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function ProductTable({
  products,
  onEdit,
  onToggle,
  onDelete,
  emptyLabel,
}: {
  products: Product[]
  onEdit: (p: Product) => void
  onToggle: (p: Product) => void
  onDelete: (p: Product) => void
  emptyLabel: string
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
        <Package className="h-10 w-10 opacity-30" />
        <p>{emptyLabel}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Game / Type</TableHead>
          <TableHead>Price (GBP)</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Enabled</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <ProductRow key={p.id} product={p} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  )
}

// ─── Edit / Create Dialog ─────────────────────────────────────────────────────

function ProductDialog({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean
  product: Partial<Product> | null
  onClose: () => void
  onSave: (p: Partial<Product>) => void
}) {
  const [form, setForm] = useState<Partial<Product>>(product ?? EMPTY_PRODUCT)
  const isNew = !product?.id

  const set = <K extends keyof Product>(k: K, v: Product[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.priceGBP) return
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Product" : "Edit Product"}</DialogTitle>
          <DialogDescription>
            {isNew ? "Create a new product listing." : `Editing: ${product?.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(["game", "vps"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors",
                  form.type === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {t === "game" ? <Gamepad2 className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                {t === "game" ? "Game Server" : "VPS"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name *</Label>
              <Input
                id="p-name"
                value={form.name ?? ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="AMD Starter"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug</Label>
              <Input
                id="p-slug"
                value={form.slug ?? ""}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="amd-starter"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (GBP) *</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                step={0.5}
                value={form.priceGBP ?? ""}
                onChange={(e) => set("priceGBP", parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-stock">Stock Status</Label>
              <Select
                value={form.stock ?? "in_stock"}
                onValueChange={(v) => set("stock", v as StockStatus)}
              >
                <SelectTrigger id="p-stock">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-billing">Billing URL</Label>
            <Input
              id="p-billing"
              value={form.billingUrl ?? ""}
              onChange={(e) => set("billingUrl", e.target.value)}
              placeholder="https://billing.nodebyte.host/store/..."
            />
          </div>

          {form.type === "game" && (
            <div className="space-y-1.5">
              <Label htmlFor="p-game">Game</Label>
              <Select
                value={form.game ?? ""}
                onValueChange={(v) => set("game", v)}
              >
                <SelectTrigger id="p-game">
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minecraft">Minecraft</SelectItem>
                  <SelectItem value="Rust">Rust</SelectItem>
                  <SelectItem value="Hytale">Hytale</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {form.type === "vps" && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">VPS Specs</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="p-cpu">vCPU Cores</Label>
                  <Input
                    id="p-cpu"
                    type="number"
                    min={1}
                    value={form.cpuCores ?? ""}
                    onChange={(e) => set("cpuCores", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-ram">RAM (GB)</Label>
                  <Input
                    id="p-ram"
                    type="number"
                    min={1}
                    value={form.ramGB ?? ""}
                    onChange={(e) => set("ramGB", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-storage">Storage (GB)</Label>
                  <Input
                    id="p-storage"
                    type="number"
                    min={1}
                    value={form.storageGB ?? ""}
                    onChange={(e) => set("storageGB", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-bw">Bandwidth (TB, blank = unmetered)</Label>
                  <Input
                    id="p-bw"
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.bandwidthTB ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      set("bandwidthTB", v === "" ? null : parseFloat(v))
                    }}
                    placeholder="Unmetered"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <Switch
              id="p-enabled"
              checked={form.enabled ?? true}
              onCheckedChange={(v) => set("enabled", v)}
            />
            <Label htmlFor="p-enabled">Enabled (visible on site)</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{isNew ? "Create" : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.game?.toLowerCase().includes(q) ?? false)
    )
  })

  const gameProducts = filtered.filter((p) => p.type === "game")
  const vpsProducts = filtered.filter((p) => p.type === "vps")

  const openCreate = () => {
    setEditTarget(null)
    setDialogOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditTarget(p)
    setDialogOpen(true)
  }

  const handleToggle = (p: Product) =>
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, enabled: !x.enabled } : x)))

  const handleDelete = (p: Product) =>
    setProducts((prev) => prev.filter((x) => x.id !== p.id))

  const handleSave = (form: Partial<Product>) => {
    if (editTarget) {
      setProducts((prev) => prev.map((x) => (x.id === editTarget.id ? { ...x, ...form } : x)))
    } else {
      const newProd: Product = {
        ...(form as Omit<Product, "id">),
        id: `${form.type}-${Date.now()}`,
      }
      setProducts((prev) => [...prev, newProd])
    }
    setDialogOpen(false)
  }

  const stockSummary = {
    inStock: products.filter((p) => p.stock === "in_stock" && p.enabled).length,
    outOfStock: products.filter((p) => p.stock === "out_of_stock").length,
    comingSoon: products.filter((p) => p.stock === "coming_soon").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-7 w-7 text-primary" />
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage game server and VPS product listings, pricing, and availability.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Note banner */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Product state is currently local to this session. Full backend persistence will be wired up to the{" "}
          <Link href={LINKS.github + "/backend"} target="_blank" className="underline underline-offset-2">
            backend API
          </Link>{" "}
          once the products endpoint is available.
        </AlertDescription>
      </Alert>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length, icon: Package },
          { label: "Live & In Stock", value: stockSummary.inStock, icon: CheckCircle2 },
          { label: "Out of Stock", value: stockSummary.outOfStock, icon: XCircle },
          { label: "Coming Soon", value: stockSummary.comingSoon, icon: Tag },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-9"
        />
      </div>

      {/* Product tables */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="game">
            <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
            Game Servers ({gameProducts.length})
          </TabsTrigger>
          <TabsTrigger value="vps">
            <Server className="h-3.5 w-3.5 mr-1.5" />
            VPS ({vpsProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ProductTable
                products={filtered}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={setDeleteTarget}
                emptyLabel="No products match your search."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="game" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ProductTable
                products={gameProducts}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={setDeleteTarget}
                emptyLabel="No game server products yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vps" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ProductTable
                products={vpsProducts}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={setDeleteTarget}
                emptyLabel="No VPS products yet."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit / create dialog */}
      {dialogOpen && (
        <ProductDialog
          open={dialogOpen}
          product={editTarget}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Confirm delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This only affects the local listing — no billing panel changes are made automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) handleDelete(deleteTarget)
                setDeleteTarget(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
