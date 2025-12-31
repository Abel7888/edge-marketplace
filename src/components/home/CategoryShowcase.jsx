import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, TrendingUp, Building2, ArrowUpRight, Brain, Link, Wifi, Cloud, Shield, Code, Glasses, DollarSign } from 'lucide-react'


export default function CategoryShowcase() {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const categories = useMemo(() => ([
    {
      name: 'Artificial Intelligence & ML',
      desc: 'Transform your business with intelligent automation',
      gradient: 'from-blue-500 to-cyan-500',
      icon: Brain,
      count: 41,
      trending: true,
      tags: ['Machine Learning', 'NLP', 'Computer Vision'],
    },
    {
      name: 'Blockchain & Web3',
      desc: 'Decentralized solutions for the future',
      gradient: 'from-purple-500 to-indigo-600',
      icon: Link,
      count: 33,
      trending: false,
      tags: ['Smart Contracts', 'DeFi', 'NFTs'],
    },
    {
      name: 'Internet of Things',
      desc: 'Connect and optimize physical devices',
      gradient: 'from-green-500 to-teal-600',
      icon: Wifi,
      count: 38,
      trending: true,
      tags: ['Sensors', 'Edge Computing', 'Industrial IoT'],
    },
    {
      name: 'Cloud Infrastructure',
      desc: 'Scalable and flexible cloud solutions',
      gradient: 'from-sky-500 to-blue-600',
      icon: Cloud,
      count: 44,
      trending: false,
      tags: ['Serverless', 'Kubernetes', 'Multi-cloud'],
    },
    {
      name: 'Edge Computing',
      desc: 'Protect your digital assets and data',
      gradient: 'from-red-500 to-orange-600',
      icon: Shield,
      count: 29,
      trending: true,
      tags: ['Zero Trust', 'Threat Detection', 'Compliance'],
    },
    {
      name: 'DevOps & Automation',
      desc: 'Streamline development and deployment',
      gradient: 'from-amber-500 to-orange-500',
      icon: Code,
      count: 32,
      trending: false,
      tags: ['CI/CD', 'Infrastructure as Code', 'Monitoring'],
    },
    {
      name: 'AR/VR & Metaverse',
      desc: 'Immersive experiences and virtual worlds',
      gradient: 'from-pink-500 to-rose-600',
      icon: Glasses,
      count: 28,
      trending: true,
      tags: ['Virtual Reality', 'Augmented Reality', '3D'],
    },
    {
      name: 'Fintech Solutions',
      desc: 'Innovative financial technology platforms',
      gradient: 'from-emerald-500 to-green-600',
      icon: DollarSign,
      count: 35,
      trending: false,
      tags: ['Payments', 'Banking', 'Insurance'],
    },
  ]), [])

  const handleClick = (name) => {
    // Placeholder for navigation
    console.log('Navigate to category:', name)
  }

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div aria-hidden className="absolute -top-20 -left-10 w-[28rem] h-[28rem] bg-primary-500/10 blur-3xl rounded-full" />
      <div aria-hidden className="absolute -bottom-24 -right-16 w-[32rem] h-[32rem] bg-accent-500/10 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-4 inline-flex items-center gap-2">
          <Sparkles size={16} />
          Explore by Category
        </div>
        <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Find Solutions Across <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Cutting-Edge Technologies</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Connect with specialized vendors across the most innovative tech categories. From AI to Web3, discover solutions that drive your business forward.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <article
              key={c.name}
              className="group relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-hard transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
              onClick={() => handleClick(c.name)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} style={{ backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.04) 100%)` }} />

              {c.trending && (
                <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  <TrendingUp size={12} />
                  Trending
                </div>
              )}

              <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${c.gradient} shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <c.icon className="text-white" size={40} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {c.desc}
              </p>

              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Building2 size={16} />
                {c.count} vendors
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {c.tags.map((t) => (
                  <span key={t} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                <ArrowUpRight size={18} />
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="/login" className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-500 hover:text-primary-600 hover:shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z" /></svg>
            View All Categories
          </a>
        </div>
      </div>
    </section>
  )
}

