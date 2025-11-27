"use client"

import React from "react"

export default function HeroGraphic() {
  return (
    <div className="w-[420px] h-[420px] relative z-10">
      <svg viewBox="0 0 600 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="glow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ocean" x1="0" x2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* subtle background glow */}
        <circle cx="300" cy="230" r="220" fill="url(#glow)" />

        {/* globe container */}
        <g transform="translate(300,300)">
          {/* 3D-like sphere */}
          <circle r="160" fill="rgba(8,11,20,0.6)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* animated longitude/latitude grid */}
          <g className="globe-rotate">
            {/* longitude lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={`long-${i}`}
                rx="160"
                ry="40"
                cx="0"
                cy="0"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                transform={`rotate(${(i / 12) * 360})`}
              />
            ))}

            {/* latitude lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const lat = -60 + i * 24
              const ry = 160 * Math.cos((lat * Math.PI) / 180)
              return (
                <ellipse
                  key={`lat-${i}`}
                  rx="160"
                  ry={Math.abs(ry)}
                  cx="0"
                  cy="0"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                  transform={`rotate(0)`}
                />
              )
            })}
          </g>

          {/* arcs between POPs (animated) */}
          <g className="arcs" fill="none" strokeWidth="2">
            <path d="M-80 -40 C -20 -120, 60 -120, 120 -40" stroke="url(#ocean)" strokeOpacity="0.9" className="arc-anim" />
            <path d="M-30 90 C 20 10, 120 10, 160 90" stroke="#7c3aed" strokeOpacity="0.85" className="arc-anim delay-1" />
          </g>

          {/* POP nodes (pulsing) */}
          <g className="nodes">
            <g className="node" transform="translate(-120,-40)">
              <circle r="6" fill="#60A5FA" />
              <circle r="14" fill="#60A5FA" opacity="0.12" className="pulse" />
            </g>
            <g className="node" transform="translate(140,-20)">
              <circle r="6" fill="#06b6d4" />
              <circle r="14" fill="#06b6d4" opacity="0.12" className="pulse delay-2" />
            </g>
            <g className="node" transform="translate(60,110)">
              <circle r="6" fill="#7c3aed" />
              <circle r="14" fill="#7c3aed" opacity="0.12" className="pulse delay-1" />
            </g>
          </g>

          {/* center label */}
          <g>
            <text x="0" y="0" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">NodeByte</text>
            <text x="0" y="18" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">Global POP Network</text>
          </g>
        </g>

        <style>{`
          .globe-rotate { transform-origin: 300px 300px; animation: spin 18s linear infinite; }
          @keyframes spin { from { transform: rotateY(0deg) rotate(0deg) } to { transform: rotateY(360deg) rotate(360deg) } }
          .arc-anim { stroke-dasharray: 300; stroke-dashoffset: 300; animation: dash 3s ease-in-out infinite; }
          .arc-anim.delay-1 { animation-delay: 0.6s }
          @keyframes dash { 0% { stroke-dashoffset: 300 } 50% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: 300 } }
          .pulse { transform-origin: center; animation: pulse 1.8s ease-out infinite; }
          .pulse.delay-1 { animation-delay: 0.3s }
          .pulse.delay-2 { animation-delay: 0.6s }
          @keyframes pulse { 0% { transform: scale(0.6); opacity: 0.16 } 50% { transform: scale(1); opacity: 0.08 } 100% { transform: scale(0.6); opacity: 0.16 } }
        `}</style>
      </svg>
    </div>
  )
}
