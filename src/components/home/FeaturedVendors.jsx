import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ChevronLeft, ChevronRight, CheckCircle2, Eye, BookOpen, Download, FileText, Sparkles, X, Mail, User, Building, Phone } from 'lucide-react'

const fadeItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function FeaturedVendors() {
  const containerRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [active, setActive] = useState(0)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)

  const openLeadModal = (resource) => {
    setSelectedResource(resource)
    setShowLeadModal(true)
  }

  const vendors = useMemo(() => ([
    { name: 'DataRobot', website: 'https://www.datarobot.com/', logoUrl: 'https://www.google.com/s2/favicons?domain=datarobot.com&sz=128', tags: ['AI/ML'], specialties: 'Automated machine learning • MLOps • AI lifecycle management', verified: true,
      description: 'Enterprise AI platform combining AutoML, MLOps, and governance. Build and deploy models at scale with guardrails and approvals. Monitor drift, bias, and performance in production. Speed up delivery with blueprints and reusable components.' },
    { name: 'H2O.ai', website: 'https://www.h2o.ai/', logoUrl: 'https://www.google.com/s2/favicons?domain=h2o.ai&sz=128', tags: ['AI/ML'], specialties: 'Open-source ML • AutoML • Driverless AI', verified: true,
      description: 'Open-source ML leader powering fast, interpretable models. Driverless AI automates feature engineering and model selection. Built-in explainability (SHAP, LIME) and compliance tooling. Flexible recipes to customize pipelines.' },
    { name: 'Particle', website: 'https://www.particle.io/', logoUrl: 'https://www.google.com/s2/favicons?domain=particle.io&sz=128', tags: ['IoT'], specialties: 'IoT device cloud • Connectivity • Device management', verified: true,
      description: 'Full-stack IoT platform with Device OS, Cloud, and connectivity. Secure data ingestion, OTA firmware updates, and fleet health. Hardware modules and device SIM streamline pilots to scale. APIs and rules engine integrate with apps.' },
    { name: 'Matterport', website: 'https://www.matterport.com/', logoUrl: 'https://www.google.com/s2/favicons?domain=matterport.com&sz=128', tags: ['Digital Twin'], specialties: '3D capture • Digital twins • Space analytics', verified: true,
      description: 'Create immersive digital twins using Pro cameras or mobile capture. Share and embed 3D walkthroughs for marketing and facilities. Annotate, measure, and analyze spaces with AI tools. APIs connect twins to property workflows.' },
    { name: 'Dell Edge', website: 'https://www.dell.com/en-us/dt/solutions/edge/index.htm', logoUrl: 'https://www.google.com/s2/favicons?domain=dell.com&sz=128', tags: ['Edge Computing'], specialties: 'Edge platforms • On-prem AI • Ruggedized compute', verified: true,
      description: 'Edge platforms for on‑prem inference and streaming analytics. Ruggedized gateways and servers for harsh environments. Integrated lifecycle management and security. Run AI where data is generated to reduce latency.' },
    { name: 'Spatial', website: 'https://www.spatial.io/', logoUrl: 'https://www.google.com/s2/favicons?domain=spatial.io&sz=128', tags: ['AR/VR'], specialties: 'Immersive collaboration • 3D spaces • XR experiences', verified: true,
      description: 'Build and host interactive 3D rooms on web, mobile, and headsets. Avatars, spatial audio, and co‑creation tools for teams and events. No-code authoring with templates and assets. WebXR delivery for frictionless access.' },
    { name: 'ConsenSys', website: 'https://consensys.io/', logoUrl: 'https://www.google.com/s2/favicons?domain=consensys.io&sz=128', tags: ['Blockchain/Web3'], specialties: 'Smart contracts • MetaMask • Linea rollup • Enterprise Web3', verified: true,
      description: 'Web3 suite powering wallets, infra, and dev tools. MetaMask for secure key management; Infura for scalable RPC. Linea rollup for low‑cost transactions. Enterprise consulting and audits for production-grade dApps.' },
    { name: 'Graphcore', website: 'https://www.graphcore.ai/', logoUrl: 'https://www.google.com/s2/favicons?domain=graphcore.ai&sz=128', tags: ['Computing & Processing'], specialties: 'IPU processors • AI acceleration • Poplar SDK', verified: true,
      description: 'Intelligence Processing Units (IPUs) for next‑gen AI compute. Unlock parallelism for GNNs, transformers, and sparse workloads. Poplar SDK simplifies graph execution and memory management. Systems scale from dev kits to racks.' },
    { name: 'Boston Dynamics', website: 'https://www.bostondynamics.com/', logoUrl: 'https://www.google.com/s2/favicons?domain=bostondynamics.com&sz=128', tags: ['Robotics'], specialties: 'Mobile robots • Automation • Autonomy', verified: true,
      description: 'Mobile robots for inspection and logistics. Spot automates rounds, thermal scans, and data capture. Stretch streamlines case handling in warehouses. Proven autonomy, robust sensing, and developer APIs.' },
    { name: 'Cisco', website: 'https://www.cisco.com/', logoUrl: 'https://www.google.com/s2/favicons?domain=cisco.com&sz=128', tags: ['Connectivity & Networking'], specialties: 'Networking • Security • Observability', verified: true,
      description: 'End‑to‑end networking with Catalyst and Meraki. SD‑WAN and SASE for secure, performant access. ThousandEyes provides internet and app visibility. Unified policy and observability across sites and cloud.' },
  ]), [])

  // Autoplay every 5s
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    let timerId
    const start = () => {
      timerId = window.setInterval(() => {
        scrollByCard(1)
      }, 5000)
    }
    const stop = () => timerId && window.clearInterval(timerId)
    if (!hovering) start()
    return () => stop()
  }, [hovering])

  const scrollByCard = (dir = 1) => {
    const el = containerRef.current
    if (!el) return
    const first = el.firstElementChild
    const w = first ? first.getBoundingClientRect().width + 16 : 320
    el.scrollTo({ left: el.scrollLeft + dir * w, behavior: 'smooth' })
  }

  const goToIndex = (idx) => {
    const el = containerRef.current
    if (!el) return
    const first = el.firstElementChild
    const w = first ? first.getBoundingClientRect().width + 16 : 320
    setActive(idx)
    el.scrollTo({ left: idx * w, behavior: 'smooth' })
  }

  // Track active index from scroll position
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const first = el.firstElementChild
      const w = first ? first.getBoundingClientRect().width + 16 : 320
      const idx = Math.round(el.scrollLeft / w)
      setActive(Math.max(0, Math.min(idx, vendors.length - 1)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [vendors.length])

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden className="absolute -top-20 -left-10 w-[28rem] h-[28rem] bg-primary-500/20 blur-3xl rounded-full" />
      <div aria-hidden className="absolute -bottom-24 -right-16 w-[32rem] h-[32rem] bg-accent-500/20 blur-3xl rounded-full" />
      {/* Floating particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} aria-hidden className="absolute w-1 h-1 bg-primary-500/30 rounded-full" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animation: `float ${3 + Math.random()*5}s ease-in-out ${Math.random()}s infinite` }} />
      ))}

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
        <div>
          <div className="text-accent-600 font-bold text-sm uppercase tracking-wider mb-3 inline-flex items-center gap-2">
            <Award size={16} />
            Featured Vendors
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Meet Some Vendors from Our Vetted Marketplace</h2>
          <p className="text-lg text-gray-600 mt-2">Discover verified, trusted vendors with proven track records</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => scrollByCard(-1)} className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all" aria-label="Previous">
            <ChevronLeft />
          </button>
          <button onClick={() => scrollByCard(1)} className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all" aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative max-w-[1600px] mx-auto px-6">
        <div
          ref={containerRef}
          className="flex gap-4 pb-8 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {vendors.map((v, i) => (
            <motion.article
              key={v.name}
              variants={fadeItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex-none basis-[85%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%] xl:basis-[19%] snap-start group relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* Header strip to mirror PropTech */}
              <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-white grid place-items-center border-4 border-white shadow overflow-hidden">
                    <img src={v.logoUrl} alt={v.name} className="max-h-9 object-contain" />
                  </div>
                  {v.verified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">✓ Verified</span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-2xl font-bold text-slate-900">{v.name}</div>
                <div className="text-sm font-semibold text-gray-700 italic mb-3" style={{ display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{taglineFor(v)}</div>

                {Array.isArray(v.tags) && v.tags.length>0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {v.tags.slice(0,2).map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{t}</span>
                    ))}
                  </div>
                )}

                <div className="my-2 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <div className="text-sm text-gray-800 leading-relaxed" style={{ display:'-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{v.description}</div>
                </div>
                <div className="mt-1 text-xs text-gray-600">{v.specialties}</div>

                {/* Footer action pinned to bottom */}
                <div className="mt-auto pt-4 grid grid-cols-1 gap-2">
                  <a href={v.website} target="_blank" rel="noreferrer" className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold grid place-items-center">
                    <span className="inline-flex items-center gap-2"><Eye size={16}/> View Profile</span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {vendors.map((_, i) => (
            <button key={i} onClick={() => goToIndex(i)} aria-label={`Go to slide ${i+1}`} className={`h-2 rounded-full transition-all ${active === i ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300 hover:bg-primary-400'}`} />
          ))}
        </div>

        {/* Buyers Guides & eBooks Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-1.5 mb-3">
              <Sparkles className="text-purple-600" size={16} />
              <span className="text-purple-700 font-bold text-xs uppercase tracking-wider">Free Resources</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Buyers Guides & eBooks</h3>
            <p className="text-base text-gray-600 max-w-xl mx-auto">Expert insights to help you make informed technology decisions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Buyers Guide Card */}
            <motion.div
              variants={fadeItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full" />
              
              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mb-1.5">BUYERS GUIDE</span>
                    <h4 className="text-base font-bold text-slate-900 mb-1 leading-tight">The Executive Guide to AI & ML: Build vs. Buy, Pricing, Vendors, and What Actually Works</h4>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-blue-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Build vs. Buy decision framework</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Pricing models & vendor comparison</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Real-world implementation insights</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openLeadModal({ 
                        type: 'guide', 
                        title: 'The Executive Guide to AI & ML',
                        downloadUrl: 'https://drive.google.com/uc?export=download&id=1KgRWQVjq04SmWpUPEpuscyJrk_3I_86l'
                      })
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </button>
                </div>
              </div>
            </motion.div>

            {/* eBook Card */}
            <motion.div
              variants={fadeItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-bl-full" />
              
              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <FileText className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 mb-1.5">eBOOK</span>
                    <h4 className="text-base font-bold text-slate-900 mb-1 leading-tight">A Professional Buyer's Guide to Edge Computing Solutions</h4>
                    <p className="text-xs text-gray-600">Assess technologies, vendors, and real-world use cases</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Technology assessment framework</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Vendor evaluation criteria</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Real-world implementation cases</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openLeadModal({ 
                        type: 'ebook', 
                        title: 'Edge Computing Solutions Guide',
                        downloadUrl: 'https://drive.google.com/uc?export=download&id=100up0km5k_A9vo7FoV2_faHRPo6H_mGW'
                      })
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get eBook
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 2026 Multifamily Tech Buyer's Guide Card */}
            <motion.div
              variants={fadeItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl hover:border-emerald-400 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-bl-full" />
              
              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 mb-1.5">MULTIFAMILY TECH GUIDE</span>
                    <h4 className="text-base font-bold text-slate-900 mb-1 leading-tight">The 2026 Multifamily Tech Buyer's Guide</h4>
                    <p className="text-xs text-gray-600">Protect NOI, drive property value, win with institutional capital</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-emerald-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Documented NOI impact & ROI framework</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Risk mitigation & financial exposure analysis</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Real case studies: 100-1,000+ unit properties</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <a 
                    href="/resources/institutional-capital"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 2026 AI Networking Buyer's Guide Card */}
            <motion.div
              variants={fadeItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl hover:border-orange-400 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-bl-full" />
              
              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 mb-1.5">AI NETWORKING GUIDE</span>
                    <h4 className="text-base font-bold text-slate-900 mb-1 leading-tight">The 2026 AI Networking Buyer's Guide</h4>
                    <p className="text-xs text-gray-600">Scale training workloads & avoid multi-million dollar mistakes</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-orange-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Eliminate network bottlenecks in AI training</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Avoid $3-5M emergency fabric redesigns</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Maximize GPU utilization & training speed</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <a 
                    href="/resources/ai-networking"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-semibold hover:from-orange-700 hover:to-orange-800 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lead Magnet Modal */}
      {showLeadModal && selectedResource && (
        <LeadMagnetModal 
          resource={selectedResource}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </section>
  )
}

function LeadMagnetModal({ resource, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Submit to Formspree
      await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          resourceType: resource.type,
          resourceTitle: resource.title,
          requestType: 'Resource Download',
          timestamp: new Date().toISOString()
        })
      })

      // Trigger download
      window.open(resource.downloadUrl, '_blank')
      
      // Close modal after short delay
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                {resource.type === 'guide' ? <BookOpen size={28} /> : <FileText size={28} />}
              </div>
              <h3 className="text-2xl font-bold mb-2">Get Your Free {resource.type === 'guide' ? 'Guide' : 'eBook'}</h3>
              <p className="text-blue-100 text-sm">{resource.title}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <p className="text-gray-600 text-sm mb-6">Fill out the form below to download your free resource instantly.</p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Now
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By downloading, you agree to receive occasional emails about our services. Unsubscribe anytime.
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function taglineFor(v) {
  if (v.name === 'DataRobot') return 'Enterprise AutoML and end‑to‑end AI lifecycle'
  if (v.name === 'H2O.ai') return 'Open‑source machine learning and Driverless AI'
  if (v.name === 'Particle') return 'Full‑stack IoT device cloud and connectivity'
  if (v.name === 'Matterport') return '3D capture and digital twins for real spaces'
  if (v.name === 'Dell Edge') return 'Edge compute platforms for on‑prem AI'
  if (v.name === 'Spatial') return 'Immersive collaboration across devices'
  if (v.name === 'ConsenSys') return 'MetaMask, Linea, and enterprise Web3'
  if (v.name === 'Graphcore') return 'IPU hardware and software for AI at scale'
  if (v.name === 'Boston Dynamics') return 'Mobile robots for inspection and logistics'
  if (v.name === 'Cisco') return 'Networking, security, and observability'
  return 'Trusted technology vendor'
}
