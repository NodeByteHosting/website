"use client"

import { useRef, useEffect, useState } from "react"

// ─── Config ───────────────────────────────────────────────────────────────────

const SIZE      = 420
const R         = 155
const TILT      = -0.32
const ROT_SPEED = 0.1
const DOT_DEG   = 5.5
const DOT_PX    = 0.85

const CX = SIZE / 2
const CY = SIZE / 2
const cT = Math.cos(TILT)
const sT = Math.sin(TILT)

// ─── Locations ────────────────────────────────────────────────────────────────

type Region = "eu" | "am" | "ap"

interface Pop {
  id: string; name: string; lat: number; lon: number; region: Region; primary?: true
}

const POPS: Pop[] = [
  { id: "ncl", name: "Newcastle",   lat:  54.97, lon:   -1.62, region: "eu", primary: true },
  { id: "hel", name: "Helsinki",    lat:  60.16, lon:   24.93, region: "eu" },
  { id: "fal", name: "Falkenstein", lat:  50.46, lon:   12.37, region: "eu" },
  { id: "rbx", name: "Roubaix",    lat:  50.69, lon:    3.17, region: "eu" },
  { id: "waw", name: "Warsaw",     lat:  52.23, lon:   21.01, region: "eu" },
  { id: "bhs", name: "Beauharnois",lat:  45.31, lon:  -73.87, region: "am" },
  { id: "hil", name: "Hillsboro",  lat:  45.52, lon: -122.99, region: "am" },
  { id: "sgp", name: "Singapore",  lat:   1.30, lon:  103.81, region: "ap" },
  { id: "syd", name: "Sydney",     lat: -33.86, lon:  151.20, region: "ap" },
]

const CONNECTIONS = [
  { a: "ncl", b: "hel", speed: 0.35, phase: 0.00 },
  { a: "ncl", b: "fal", speed: 0.30, phase: 0.20 },
  { a: "ncl", b: "rbx", speed: 0.32, phase: 0.10 },
  { a: "ncl", b: "bhs", speed: 0.20, phase: 0.40 },
  { a: "bhs", b: "hil", speed: 0.25, phase: 0.60 },
  { a: "hil", b: "sgp", speed: 0.16, phase: 0.30 },
  { a: "sgp", b: "syd", speed: 0.30, phase: 0.80 },
  { a: "fal", b: "waw", speed: 0.35, phase: 0.50 },
]

// ─── Projection (orthographic with tilt) ──────────────────────────────────────

function proj(lat: number, lon: number, rot: number, r = R) {
  const phi = lat * 0.017453, lam = lon * 0.017453 + rot
  const cp = Math.cos(phi), sp = Math.sin(phi)
  const cl = Math.cos(lam), sl = Math.sin(lam)
  const y = sp, z = cp * cl
  return { x: r * cp * sl + CX, y: -r * (y * cT - z * sT) + CY, z: r * (y * sT + z * cT) }
}

// ─── Great-circle slerp (precomputed) ─────────────────────────────────────────

function gcPath(lat1: number, lon1: number, lat2: number, lon2: number, n: number) {
  const d2r = 0.017453
  const p1 = lat1*d2r, l1 = lon1*d2r, p2 = lat2*d2r, l2 = lon2*d2r
  const ax = Math.cos(p1)*Math.cos(l1), ay = Math.cos(p1)*Math.sin(l1), az = Math.sin(p1)
  const bx = Math.cos(p2)*Math.cos(l2), by = Math.cos(p2)*Math.sin(l2), bz = Math.sin(p2)
  const omega = Math.acos(Math.max(-1, Math.min(1, ax*bx+ay*by+az*bz)))
  const sinO = Math.sin(omega)
  if (sinO < 1e-6) return [{ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }]
  const pts: Array<{ lat: number; lon: number }> = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const A = Math.sin((1-t)*omega)/sinO, B = Math.sin(t*omega)/sinO
    const x = A*ax+B*bx, y = A*ay+B*by, z = A*az+B*bz
    pts.push({ lat: Math.atan2(z, Math.hypot(x,y))/d2r, lon: Math.atan2(y,x)/d2r })
  }
  return pts
}

const popLookup: Record<string, Pop> = Object.fromEntries(POPS.map(p => [p.id, p]))
const ARC_PATHS = CONNECTIONS.map(c => {
  const a = popLookup[c.a], b = popLookup[c.b]
  return gcPath(a.lat, a.lon, b.lat, b.lon, 50)
})

// ─── Theme colours ────────────────────────────────────────────────────────────

function cssHex(v: string, el: HTMLElement): string {
  el.style.color = `var(${v})`
  const m = getComputedStyle(el).color.match(/\d+/g)
  if (!m || m.length < 3) return "#6366f1"
  return "#" + [m[0],m[1],m[2]].map(n => (+n).toString(16).padStart(2,"0")).join("")
}

function useThemeColors() {
  const [c, set] = useState({ primary: "#6366f1", accent: "#38bdf8" })
  useEffect(() => {
    const el = document.createElement("span")
    el.style.cssText = "display:none;position:absolute"
    document.body.appendChild(el)
    const read = () => set({ primary: cssHex("--primary", el), accent: cssHex("--accent", el) })
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => { mo.disconnect(); el.remove() }
  }, [])
  return c
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

function regCol(region: Region, accent: string) {
  if (region === "eu") return accent
  return region === "am" ? "#34d399" : "#fb923c"
}

function rgba(hex: string, a: number) {
  return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroGraphic() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { accent } = useThemeColors()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    cv.width = SIZE * dpr; cv.height = SIZE * dpr
    const ctx = cv.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let t0: number | null = null

    const draw = (ts: number) => {
      if (!t0) t0 = ts
      const sec = (ts - t0) / 1000
      const rot = sec * ROT_SPEED
      ctx.clearRect(0, 0, SIZE, SIZE)

      /* ── background glow ── */
      const bg = ctx.createRadialGradient(CX, CY, R * 0.05, CX, CY, R * 1.35)
      bg.addColorStop(0, rgba(accent, 0.07))
      bg.addColorStop(0.55, rgba(accent, 0.025))
      bg.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = bg
      ctx.beginPath(); ctx.arc(CX, CY, R * 1.35, 0, 6.2832); ctx.fill()

      /* ── globe edge ring ── */
      ctx.beginPath(); ctx.arc(CX, CY, R + 0.5, 0, 6.2832)
      ctx.strokeStyle = rgba(accent, 0.1); ctx.lineWidth = 0.8; ctx.stroke()

      /* ── dot grid ── */
      for (let lat = -85; lat <= 85; lat += DOT_DEG) {
        const step = DOT_DEG / Math.max(Math.cos(lat * 0.017453), 0.28)
        for (let lon = 0; lon < 360; lon += step) {
          const p = proj(lat, lon, rot)
          if (p.z <= 0) continue
          const a = 0.025 + 0.135 * (p.z / R)
          ctx.fillStyle = `rgba(150,175,215,${a})`
          ctx.fillRect(p.x - DOT_PX, p.y - DOT_PX, DOT_PX * 2, DOT_PX * 2)
        }
      }

      /* ── arcs + packets ── */
      ctx.save()
      for (let ci = 0; ci < CONNECTIONS.length; ci++) {
        const conn = CONNECTIONS[ci]
        const pts  = ARC_PATHS[ci]
        const col  = regCol(popLookup[conn.a].region, accent)

        // arc line (skip behind-globe segments)
        ctx.beginPath()
        let pen = false
        for (const pt of pts) {
          const { x, y, z } = proj(pt.lat, pt.lon, rot, R * 1.012)
          if (z <= 0) { pen = false; continue }
          if (!pen) { ctx.moveTo(x, y); pen = true } else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = rgba(col, 0.3)
        ctx.lineWidth = 1.1
        ctx.stroke()

        // animated packet
        const pf = ((sec * conn.speed + conn.phase) % 1 + 1) % 1
        const pi = Math.min(Math.round(pf * (pts.length - 1)), pts.length - 1)
        const pp = proj(pts[pi].lat, pts[pi].lon, rot, R * 1.02)
        if (pp.z > 0) {
          ctx.shadowColor = col; ctx.shadowBlur = 10
          ctx.beginPath(); ctx.arc(pp.x, pp.y, 2.2, 0, 6.2832)
          ctx.fillStyle = col; ctx.fill()
          ctx.shadowBlur = 0
        }
      }
      ctx.restore()

      /* ── PoP markers ── */
      for (const pop of POPS) {
        const { x, y, z } = proj(pop.lat, pop.lon, rot, R * 1.004)
        if (z <= 0) continue
        const d   = z / R
        const col = regCol(pop.region, accent)
        const r   = (pop.primary ? 4.2 : 2.8) * (0.45 + 0.55 * d)

        // sonar pulse
        const ph = (sec * 0.6 + pop.lat * 0.012) % 1
        ctx.beginPath(); ctx.arc(x, y, r * (2 + 5 * ph), 0, 6.2832)
        ctx.strokeStyle = rgba(col, 0.16 * (1 - ph))
        ctx.lineWidth = 0.8; ctx.stroke()

        // halo
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5)
        g.addColorStop(0, rgba(col, 0.3 * d))
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, 6.2832); ctx.fill()

        // core dot
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832)
        ctx.fillStyle = col; ctx.fill()

        // highlight
        ctx.beginPath(); ctx.arc(x, y, r * 0.38, 0, 6.2832)
        ctx.fillStyle = `rgba(255,255,255,${0.55 * d})`; ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [accent])

  return (
    <div className="relative w-[420px] h-[420px]">
      <canvas ref={ref} className="w-full h-full" />

      {/* legend overlay */}
      <div className="absolute bottom-2 inset-x-0 flex flex-col items-center gap-1.5 pointer-events-none select-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/60 border border-border/40 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            Global Network · 9+ Locations
          </span>
        </div>
        <div className="flex gap-4">
          {[
            { label: "EU",       color: accent    },
            { label: "Americas", color: "#34d399" },
            { label: "APAC",     color: "#fb923c" },
          ].map(r => (
            <span key={r.label} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-[9px] text-muted-foreground/75">{r.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
