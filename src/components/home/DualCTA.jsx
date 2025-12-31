import { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingBag, CheckCircle2, ArrowRight, Briefcase, Plus, Telescope, Rocket } from 'lucide-react'

export default function DualCTA() {
  const [hovered, setHovered] = useState(null) // 'buyers' | 'vendors' | null
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-0 min-h-[600px] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Buyers panel */}
        <div
          onMouseEnter={() => setHovered('buyers')}
          onMouseLeave={() => setHovered(null)}
          className={`relative group origin-center transform transition-all duration-700 ${hovered === 'buyers' ? 'scale-[1.02]' : hovered === 'vendors' ? 'opacity-80' : ''}`}
        >
          <div className="relative px-12 py-20 lg:px-16 lg:py-24 min-h-[650px] lg:min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900">
            {/* Background effects */}
            <div aria-hidden className="absolute -top-20 -left-10 w-[28rem] h-[28rem] bg-primary-500/20 blur-3xl rounded-full transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
            <div aria-hidden className="absolute -bottom-24 -right-16 w-[32rem] h-[32rem] bg-blue-500/20 blur-3xl rounded-full transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
            <div aria-hidden className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} aria-hidden className="absolute w-1 h-1 bg-white/40 rounded-full" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animation: `float ${4 + (i%4)}s ease-in-out ${i*0.1}s infinite` }} />
            ))}

            {/* Content */}
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2.5 mb-8 text-white text-sm font-bold uppercase tracking-wide">
                <ShoppingBag size={20} className="text-cyan-400" />
                For Buyers
              </span>
              <h3 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.25)' }}>
                Find Your Perfect Technology Partner
              </h3>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Explore vetted vendors across emerging technologies and industry-focused solutions. Compare options, schedule demos, request quotes, and get the clarity you need to make confident decisions—all in one supportive platform.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { p: 'Browse 1,200+ verified vendors', s: 'Spanning AI, blockchain, IoT, cloud, and 50+ categories across proptech, fintech, medtech, contech, and more.' },
                  { p: 'Get tailored, industry-specific insights', s: 'Understand capabilities, strengths, limitations, and ideal fit for your unique use case and sector.' },
                  { p: 'Schedule demos & request quotes', s: 'Connect directly with vendor teams to learn more and explore solutions.' },
                  { p: 'Compare options side-by-side', s: 'Evaluate features, integrations, pricing approaches, and trade-offs with clear, objective analysis.' },
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-4 group/item">
                    <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center transition-colors group-hover/item:bg-white/20">
                      <CheckCircle2 className="text-green-400" size={20} />
                    </span>
                    <div>
                      <div className="text-white font-semibold text-lg">{b.p}</div>
                      <div className="text-blue-200 text-sm mt-1">{b.s}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <a href="#" className="group/cta relative overflow-hidden w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-white text-primary-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all hover:scale-105">
                Start Exploring Vendors
                <ArrowRight size={20} className="transition-transform group-hover/cta:translate-x-1" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/cta:animate-shimmer" />
              </a>

              {/* Removed buyers metrics for a cleaner layout */}
            </div>

            <Telescope className="absolute bottom-6 right-6 text-white/20" size={300} aria-hidden />
          </div>
        </div>

        {/* Vendors panel */}
        <div
          onMouseEnter={() => setHovered('vendors')}
          onMouseLeave={() => setHovered(null)}
          className={`relative group origin-center transform transition-all duration-700 ${hovered === 'vendors' ? 'scale-[1.02]' : hovered === 'buyers' ? 'opacity-80' : ''}`}
        >
          <div className="relative px-12 py-20 lg:px-16 lg:py-24 min-h-[650px] lg:min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-accent-900 via-purple-800 to-pink-900">
            {/* Background effects */}
            <div aria-hidden className="absolute -top-20 -left-10 w-[28rem] h-[28rem] bg-pink-500/20 blur-3xl rounded-full transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
            <div aria-hidden className="absolute -bottom-24 -right-16 w-[32rem] h-[32rem] bg-purple-500/20 blur-3xl rounded-full transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
            <div aria-hidden className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 12px 12px, rgba(255,255,255,0.15) 2px, transparent 2px)', backgroundSize: '36px 36px' }} />
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} aria-hidden className="absolute w-1 h-1 bg-white/40 rounded-full" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animation: `float ${4 + (i%4)}s ease-in-out ${i*0.1}s infinite` }} />
            ))}

            {/* Content */}
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2.5 mb-8 text-white text-sm font-bold uppercase tracking-wide">
                <Briefcase size={20} className="text-pink-400" />
                For Vendors
              </span>
              <h3 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Grow Your Business With Us
              </h3>
              <p className="text-xl text-purple-100 leading-relaxed mb-8">
                We provide a supportive space for emerging-tech vendors to showcase their solutions, connect with qualified B2B buyers, and build meaningful industry relationships. Our goal is simple: help your technology be discovered by the teams who need it most.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { p: 'Share your solution with leading enterprises', s: 'Engage with Fortune 500 companies, mid-market teams, and fast-growing startups exploring new technologies.' },
                  { p: 'Build trust through a transparent vendor profile', s: 'Highlight your capabilities, certifications, and strengths so buyers can understand your offering clearly.' },
                  { p: 'Receive qualified leads and quote requests', s: 'Connect directly with buyers who are actively researching solutions in your category.' },
                  { p: 'Reach decision-makers across major industries', s: 'Including healthcare, finance, real estate, supply chain, manufacturing, and transportation.' },
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-4 group/item">
                    <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center transition-colors group-hover/item:bg-white/20">
                      <CheckCircle2 className="text-green-400" size={20} />
                    </span>
                    <div>
                      <div className="text-white font-semibold text-lg">{b.p}</div>
                      <div className="text-purple-200 text-sm mt-1">{b.s}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <a href="/submit-solution" className="group/cta relative overflow-hidden w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/30 transition-all hover:scale-105">
                List Your Solution
                <Plus size={20} className="transition-transform group-hover/cta:rotate-90" />
              </a>

              {/* Removed vendors metrics to match buyers and keep bottoms even */}
            </div>

            <Rocket className="absolute bottom-6 right-6 text-white/20" size={300} aria-hidden />
          </div>
        </div>
      </div>

      {/* vertical divider (desktop) */}
      <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </section>
  )
}

function Metric({ number, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{number}</div>
      <div className="text-sm text-blue-200 lg:text-purple-200 mt-1">{label}</div>
    </div>
  )
}

