import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, Search, BarChart3, GitCompare, Handshake, CheckCircle2, ArrowRight } from 'lucide-react'


export default function ProcessTimeline() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const steps = useMemo(() => ([
    {
      num: '01',
      colors: 'from-blue-500 to-cyan-500',
      icon: Search,
      title: 'Discover Solutions',
      desc: 'Explore a growing network of 1,200+ trusted vendors across AI, blockchain, IoT, and enterprise technology. Use powerful search filters to quickly find solutions aligned with your goals and industry needs.',
      features: ['Advanced search & filtering', '1,200+ verified vendors', '50+ technology categories'],
    },
    {
      num: '02',
      colors: 'from-purple-500 to-pink-500',
      icon: BarChart3,
      title: 'Evaluate Options',
      desc: 'Get clear, structured insights on each vendor. We break down capabilities, certifications, strengths, limitations, and ideal use cases—so you can understand the fit before engaging.',
      features: ['Detailed vendor profiles', 'Objective capability analysis', 'Certifications, strengths & trade-offs'],
    },
    {
      num: '03',
      colors: 'from-amber-500 to-orange-500',
      icon: GitCompare,
      title: 'Compare Vendors',
      desc: 'Effortlessly compare multiple vendors side-by-side. Schedule product demos, request tailored solution briefs, and understand pricing models and feature differences.',
      features: ['Side-by-side comparisons', 'Live product demo scheduling', 'Custom quote & solution requests'],
    },
    {
      num: '04',
      colors: 'from-green-500 to-emerald-500',
      icon: Handshake,
      title: 'Connect & Move Forward',
      desc: 'Reach out to vendors directly, negotiate terms, and manage the selection process with guided support from our platform.',
      features: ['Direct vendor communication', 'Secure information exchange', 'Lightweight onboarding guidance'],
    },
  ]), [])

  return (
    <section ref={sectionRef} className="relative py-24 bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <div className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-4 inline-flex items-center gap-2">
          <Sparkles size={16} />
          Simple, Fast, Effective
        </div>
        <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
          Your Journey to the Perfect Tech Partner
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find, evaluate, and connect with verified technology vendors in four easy steps
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Horizontal line - desktop */}
        <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-1">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200" />
          <div
            ref={progressRef}
            className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 ${inView ? 'w-full' : 'w-0'}`}
            style={{ transition: 'width 1000ms ease' }}
          />
          {/* animated beads */}
          <div className="absolute inset-0 flex justify-between">
            {[0,1,2,3].map((i) => (
              <span key={i} className="w-3 h-3 rounded-full bg-white border-2 border-primary-300 shadow -mt-1" />
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((s, idx) => (
            <div key={s.num} className="relative flex flex-col items-center text-center group">
              {/* Number circle */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-200 group-hover:border-primary-300 transition-colors duration-500" />
                <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${s.colors} shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-105`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white select-none">{s.num}</div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <s.icon size={22} className="text-white" style={{ color: 'inherit' }} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{s.title}</h3>
              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 max-w-xs mx-auto">{s.desc}</p>
              {/* Features */}
              <div className="space-y-2">
                {s.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Micro indicator (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -bottom-8 left-1/2 -translate-x-1/2 text-primary-400 animate-pulse">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 flex items-center justify-center">
          <a href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-glow-primary transition-all hover:scale-105">
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  )
}

