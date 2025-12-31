'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Search, ChevronDown, ArrowRight, Compass, Plus, Play, Building2, Star, Users, TrendingUp, Brain, Shield, Cloud, Calendar, CheckCircle2, Wifi } from 'lucide-react'


export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [category, setCategory] = useState('All Categories')
  const metricsRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  // Count-up numbers once metrics enter viewport
  const [counts, setCounts] = useState({ vendors: 0, firms: 0, talent: 0, courses: 0 })
  useEffect(() => {
    const el = metricsRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !visible) {
          setVisible(true)
        }
      })
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const targets = { vendors: 1200, firms: 300, talent: 100, courses: 50 }
    const start = performance.now()
    const dur = 1200
    const raf = () => {
      const t = Math.min(1, (performance.now() - start) / dur)
      setCounts({
        vendors: Math.floor(targets.vendors * easeOutCubic(t)),
        firms: Math.floor(targets.firms * easeOutCubic(t)),
        talent: Math.floor(targets.talent * easeOutCubic(t)),
        courses: Math.floor(targets.courses * easeOutCubic(t)),
      })
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [visible])

  const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    dur: 3 + Math.random() * 5,
    delay: Math.random() * 2,
  })), [])

  return (
    <section className="relative min-h-[700px] min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Pattern overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Gradient orbs */}
      <div aria-hidden className="absolute -top-10 -left-10 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float" />
      <div aria-hidden className="absolute -bottom-10 -right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{ top: `${p.top}%`, left: `${p.left}%`, animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite` }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left column */}
          <div>
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                <Sparkles size={16} className="text-yellow-400" />
                Emerging Tech Marketplace
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover & Connect with Tomorrow's
              <br />
              <span className="inline-block bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent bg-200 animate-gradient-x">Technology Leaders</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Your one-stop marketplace to discover, review, demo, and procure cutting-edge solutions from verified emerging tech vendors. AI, Blockchain, IoT, and beyond.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mb-8">
              <form
                className="flex items-center bg-white rounded-2xl shadow-hard p-2"
                onSubmit={(e) => { e.preventDefault(); router.push('/login') }}
              >
                <Search size={20} className="text-gray-400 ml-4" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSuggestOpen(e.target.value.length > 0) }}
                  className="flex-1 px-4 py-4 text-lg border-none focus:outline-none placeholder-gray-400"
                  placeholder="Search vendors, solutions, or technologies..."
                />
                <div className="relative hidden sm:block">
                  <button type="button" onClick={() => setCatOpen(v=>!v)} className="flex items-center gap-2 px-4 py-2 border-l border-gray-200 text-gray-700 hover:text-slate-900">
                    {category}
                    <ChevronDown size={16} />
                  </button>
                  {catOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border shadow-lg z-20">
                      {['IoT','Digital Twin','AI','Machine Learning','Edge Computing','AR/VR'].map(opt => (
                        <button key={opt} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { setCategory(opt); setCatOpen(false) }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className="ml-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:shadow-glow-primary transition-all hover:scale-105 inline-flex items-center gap-2">
                  Search
                  <ArrowRight size={18} />
                </button>
              </form>

              {suggestOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-hard p-4 animate-fade-in">
                    <div className="text-xs uppercase text-gray-400 px-2 mb-2">Suggestions</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {['AI agents', 'Blockchain KYC', 'IoT sensors', 'Cloud cost tools', 'RAG platforms', 'DevSecOps'].map((s) => (
                        <button key={s} className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700" onClick={() => { setQuery(s); setSuggestOpen(false) }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* CTA buttons (shown even with search) */}
            <div className="flex flex-wrap items-center gap-4">
              <a className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-hard inline-flex items-center gap-2" href="/signup">
                <Compass size={20} />
                View Vendors
              </a>
              <a className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-hard inline-flex items-center gap-2" href="/about">
                <Compass size={20} />
                About Us
              </a>
              <a className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all inline-flex items-center gap-2" href="/submit-solution">
                <Plus size={20} />
                Add Vendor
              </a>
            </div>

            {/* Trust metrics */}
            <div ref={metricsRef} className="flex flex-wrap items-center gap-12 mt-12 pt-8 border-t border-white/10">
              <Metric icon={Building2} value={`${counts.vendors.toLocaleString()}+`} label="vendors across 50+ categories" />
              <Metric icon={Star} value={`${counts.firms.toLocaleString()}+`} label="software development firms" />
              <Metric icon={Users} value={`${counts.talent.toLocaleString()}+`} label="pre-vetted tech talent pool" />
            </div>
          </div>

          {/* Right column visuals (desktop) */}
          <div className="relative w-full h-[600px] hidden lg:block">
            <VendorCard
              className="absolute top-0 left-0 -rotate-6"
              logoGradient="from-blue-500 to-purple-600"
              icon={Brain}
              company="NeuralTech AI"
              category="AI & Machine Learning"
              stats={[{ icon: Users, label: '50+ Clients' }, { icon: Calendar, label: 'Founded 2020' }]}
              verified
            />
            <VendorCard
              className="absolute top-20 right-0 rotate-6"
              logoGradient="from-purple-500 to-pink-600"
              icon={Shield}
              company="BlockSecure"
              category="Blockchain & Security"
              stats={[{ icon: Users, label: '120+ Clients' }, { icon: Calendar, label: 'Founded 2018' }]}
              delay={1}
            />
            <VendorCard
              className="absolute bottom-20 left-12 rotate-3"
              logoGradient="from-cyan-500 to-blue-600"
              icon={Cloud}
              company="CloudNova"
              category="Cloud Infrastructure"
              stats={[{ icon: Users, label: '200+ Clients' }, { icon: Calendar, label: 'Founded 2016' }]}
              delay={2}
            />
            <VendorCard
              className="absolute bottom-0 right-12 -rotate-3 w-96"
              logoGradient="from-green-500 to-teal-600"
              icon={Wifi}
              company="IoT Innovate"
              category="Internet of Things"
              stats={[{ icon: Users, label: '80+ Clients' }, { icon: Calendar, label: 'Founded 2019' }]}
              delay={1.5}
              large
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <ChevronDown className="text-white/60" size={20} />
        </div>
      </div>
    </section>
  )
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={28} className="text-primary-400" />
      <div>
        <div className="text-3xl lg:text-4xl font-bold text-white">{value}</div>
        <div className="text-gray-400 text-sm mt-1">{label}</div>
      </div>
    </div>
  )
}

function VendorCard({ className = '', logoGradient = 'from-blue-500 to-purple-600', icon: Icon, company, category, stats = [], verified = false, delay = 0, large = false }) {
  return (
    <div
      className={`group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-hard hover:shadow-glow-primary transition-all duration-500 hover:scale-105 hover:rotate-0 w-80 animate-fade-in ${className}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${logoGradient} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={28} />
      </div>
      <div className="text-white font-bold text-xl mb-2">{company}</div>
      <div className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-white/10 text-white/80">{category}</div>

      <div className="flex items-center gap-2 mt-4 text-gray-300">
        <Star size={16} className="text-yellow-400" />
        4.9
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10 text-white/80">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <s.icon size={16} />
            <span className="text-sm">{s.label}</span>
          </div>
        ))}
      </div>

      {verified && (
        <div className="absolute top-4 right-4 bg-green-500/20 p-2 rounded-full">
          <CheckCircle2 size={16} className="text-green-400" />
        </div>
      )}
    </div>
  )
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

