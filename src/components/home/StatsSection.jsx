import { useEffect, useMemo, useRef, useState } from 'react'
import { TrendingUp, Building2, Star, Users, TrendingUp as TrendingIcon } from 'lucide-react'

function easeOut(t) { return 1 - Math.pow(1 - t, 3) }

export default function StatsSection() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const stats = useMemo(() => ([
    {
      colors: 'from-blue-500 to-cyan-500',
      circle: 'from-blue-500/20 to-cyan-500/20',
      icon: Building2,
      target: 1200,
      suffix: '+',
      label: 'vetted vendors',
      desc: 'Curated across 50+ technology categories',
      progress: 0.9,
    },
    {
      colors: 'from-yellow-500 to-orange-500',
      circle: 'from-yellow-500/20 to-orange-500/20',
      icon: Star,
      target: 300,
      suffix: '+',
      label: 'software development firms',
      desc: 'Implementation partners ready to build with you',
      progress: 0.85,
    },
    {
      colors: 'from-green-500 to-emerald-500',
      circle: 'from-green-500/20 to-emerald-500/20',
      icon: Users,
      target: 100,
      suffix: '+',
      label: 'pre-vetted tech talent',
      desc: 'Specialists for AI, cloud, data, and more',
      progress: 0.78,
    },
  ]), [])

  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900/90 to-purple-900/90 overflow-hidden">
      <div aria-hidden className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full animate-pulse-slow" style={{ transform: `translateY(${-(scrollY*0.05)}px)` }} />
      <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-pulse-slow" style={{ animationDelay: '1s', transform: `translateY(${-(scrollY*0.03)}px)` }} />
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full animate-float" />

      <svg aria-hidden className="absolute inset-0 opacity-10" width="100%" height="100%">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} aria-hidden className="absolute w-10 h-10 border-2 border-white/10 rotate-45" style={{ top: `${10 + i*12}%`, left: `${(i*17)%90}%`, animation: `float ${4 + (i%3)}s ease-in-out ${i*0.2}s infinite` }} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 mb-6 text-white text-sm font-semibold">
            <TrendingUp className="text-green-400" size={18} />
            Valued by Teams
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Helping Teams Make Confident Vendor Choices</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Clear, transparent insights to evaluate, compare, and select the right technology partners for your business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mt-16">
          {stats.map((s, idx) => (
            <StatCard key={idx} inView={inView} {...s} />
          ))}
        </div>

        <div className="mt-20 mb-12 max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Trusted Tools for Vendor Selection</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-stretch">
            {[
              'Verified Vendor Insights',
              'Custom Scoring Frameworks',
              'Collaborative Team Workspace',
              'Secure Data Access',
              'Tailored Evaluation Reports',
              'Transparent Decision Tracking',
            ].map((n) => (
              <div key={n} className="h-24 flex items-center justify-center text-center bg-white/5 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/10 cursor-default transition-all duration-300">
                <span className="text-white/90 font-semibold text-sm leading-tight">{n}</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  )
}

function StatCard({ colors, circle, icon: Icon, target, suffix = '', label, desc, progress = 0.8, money = false, inView }) {
  const [val, setVal] = useState(0)
  const [prog, setProg] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 2000
    const raf = () => {
      const t = Math.min(1, (performance.now() - start) / dur)
      const v = easeOut(t)
      setVal(money ? +(target * v).toFixed(1) : Math.floor(target * v))
      setProg(v)
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, target, money])

  const display = money ? `$${val}${suffix}` : `${val.toLocaleString()}${suffix}`
  const width = `${Math.round((progress * prog) * 100)}%`

  return (
    <div className="group relative text-center">
      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br ${circle} backdrop-blur-sm border-2 border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-180`} />
      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${colors} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12`}>
        <Icon className="text-white" size={28} />
      </div>
      <div className="mt-12 mb-3 text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{display}</div>
      <div className="text-xl font-semibold text-gray-300 mb-3">{label}</div>
      <div className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</div>
      <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colors} rounded-full`} style={{ width }} />
      </div>
      <div className={`absolute inset-0 rounded-3xl transition-all duration-500`} />
    </div>
  )
}
