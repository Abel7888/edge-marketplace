import { useMemo, useState } from 'react'

/**
 * Reusable Trust Bar / Logo Ticker
 * Props:
 * - logos: Array<{ name: string; gradient?: string }>
 * - speedSec: number (animation duration in seconds, default 30)
 */
export default function TrustBar({ logos, speedSec = 30, title }) {
  const [paused, setPaused] = useState(false)

  const items = useMemo(() => {
    const fallback = [
      { name: 'Microsoft', gradient: 'from-blue-100 to-blue-200' },
      { name: 'Amazon', gradient: 'from-orange-100 to-orange-200' },
      { name: 'IBM', gradient: 'from-blue-100 to-blue-200' },
      { name: 'Salesforce', gradient: 'from-blue-100 to-blue-200' },
      { name: 'Google Cloud', gradient: 'from-sky-100 to-emerald-100' },
      { name: 'Oracle', gradient: 'from-red-100 to-rose-200' },
      { name: 'SAP', gradient: 'from-blue-100 to-blue-200' },
      { name: 'Adobe', gradient: 'from-red-100 to-red-200' },
      { name: 'Cisco', gradient: 'from-blue-100 to-blue-200' },
      { name: 'Intel', gradient: 'from-blue-100 to-blue-200' },
      { name: 'VMware', gradient: 'from-amber-100 to-orange-200' },
      { name: 'Stripe', gradient: 'from-purple-100 to-violet-200' },
    ]
    return (logos && logos.length ? logos : fallback).map((l, i) => ({
      ...l,
      key: `${l.name}-${i}`,
    }))
  }, [logos])

  // Duplicate for seamless marquee
  const loopItems = useMemo(() => [...items, ...items], [items])

  return (
    <section
      aria-label="Trusted by leading companies"
      className="relative w-full py-12 bg-white border-y border-gray-100 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left/Right gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
          {title || 'Trusted by industry leaders worldwide'}
        </div>
      </div>

      {/* Logo ticker */}
      <div className="relative overflow-hidden">
        <div
          className="flex items-center gap-12 md:gap-16 whitespace-nowrap animate-marquee"
          style={{
            animationDuration: `${speedSec}s`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {loopItems.map((c, idx) => (
            <LogoItem key={`${c.key}-${idx}`} name={c.name} gradient={c.gradient} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoItem({ name, gradient = 'from-gray-100 to-gray-200' }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-40 h-20 md:w-56 md:h-24 group cursor-pointer transition-all duration-300">
      <div className={`w-full h-full rounded-xl p-3 md:p-4 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
        title={name}
        aria-label={name}
      >
        <span className="font-bold text-gray-700 text-center select-none transition-all duration-300 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 whitespace-normal break-words leading-tight text-xs md:text-sm line-clamp-2">
          {name}
        </span>
      </div>
    </div>
  )
}

