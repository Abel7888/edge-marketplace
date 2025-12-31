import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, Star, Quote, Play, Edit, ChevronRight } from 'lucide-react'


export default function TestimonialsCarousel() {
  const [filter, setFilter] = useState('All')
  const [hovering, setHovering] = useState(false)
  const [active, setActive] = useState(0)
  const [modal, setModal] = useState(null) // { type: 'text'|'video', item }
  const containerRef = useRef(null)

  const testimonials = useMemo(() => ([
    {
      type: 'text',
      category: 'Fintech',
      rating: 5,
      gradient: 'from-blue-50 to-cyan-50',
      quote:
        "TechVendor Hub completely transformed our vendor discovery process. We found an AI solution that increased our customer service efficiency by 300% in just two weeks. The vetting process gave us confidence, and the demo scheduling was seamless. I can't imagine going back to traditional vendor research.",
      author: { name: 'Sarah Chen', title: 'Chief Technology Officer', company: 'FinanceFlow Inc.', avatarType: 'initials', initials: 'SC' },
      role: 'Buyer',
      logo: 'FinanceFlow',
    },
    {
      type: 'video',
      category: 'Blockchain',
      duration: '2:15',
      preview:
        'As a vendor, listing on TechVendor Hub tripled our qualified leads within the first month...',
      author: { name: 'Michael Rodriguez', title: 'CEO & Founder', company: 'BlockSecure', avatarType: 'photo' },
      role: 'Vendor',
      videoSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailColor: 'from-purple-200 to-indigo-200',
    },
    {
      type: 'text',
      category: 'IoT',
      rating: 5,
      gradient: 'from-purple-50 to-pink-50',
      quote:
        'The comparison tools and verified reviews saved us months of research. We evaluated eight IoT vendors and found three perfect partners for our smart retail rollout in just two weeks. The ROI has been incredible – we\'re seeing 45% improvement in inventory management.',
      author: { name: 'Emily Thompson', title: 'VP of Innovation', company: 'RetailPro Global', avatarType: 'initials', initials: 'ET' },
      role: 'Buyer',
      logo: 'RetailPro',
    },
    {
      type: 'video',
      category: 'Cloud Infrastructure',
      duration: '3:42',
      preview:
        'Finding the right cloud partner seemed impossible until we discovered TechVendor Hub...',
      author: { name: 'David Park', title: 'Head of Engineering', company: 'HealthTech Systems', avatarType: 'photo' },
      role: 'Buyer',
      videoSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailColor: 'from-sky-200 to-blue-200',
    },
    {
      type: 'text',
      category: 'AI & ML',
      rating: 5,
      gradient: 'from-green-50 to-emerald-50',
      quote:
        'What impressed me most was the quality of vendors on this platform. Every single vendor we contacted was professional, responsive, and truly innovative. The review system is authentic – no fake reviews here. We ended up partnering with two vendors we found through TechVendor Hub.',
      author: { name: 'Lisa Martinez', title: 'Director of Product', company: 'DataDrive Analytics', avatarType: 'initials', initials: 'LM' },
      role: 'Buyer',
      logo: 'DataDrive',
    },
    {
      type: 'text',
      category: 'Cybersecurity',
      rating: 5,
      gradient: 'from-orange-50 to-amber-50',
      quote:
        "Security is paramount for our organization. TechVendor Hub's vetting process and certification verification gave us the confidence to move forward quickly. We implemented a zero-trust security solution in record time, and it's been flawless.",
      author: { name: 'James Wilson', title: 'Chief Information Officer', company: 'SecureBank Corp.', avatarType: 'initials', initials: 'JW' },
      role: 'Buyer',
      logo: 'SecureBank',
    },
  ]), [])

  const filtered = useMemo(() => {
    if (filter === 'All') return testimonials
    if (filter === 'Buyers') return testimonials.filter((t) => t.role === 'Buyer')
    if (filter === 'Vendors') return testimonials.filter((t) => t.role === 'Vendor')
    return testimonials
  }, [filter, testimonials])

  // Autoplay on mobile (7s)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const mobile = window.matchMedia('(max-width: 767px)').matches
    if (!mobile) return
    let id
    const start = () => {
      id = window.setInterval(() => scrollBy(1), 7000)
    }
    const stop = () => id && window.clearInterval(id)
    if (!hovering) start()
    return () => stop()
  }, [hovering])

  const cardWidth = 360 + 24
  const scrollBy = (dir) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ left: el.scrollLeft + dir * cardWidth, behavior: 'smooth' })
  }

  // Track active index
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => setActive(Math.round(el.scrollLeft / cardWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative py-24 bg-white">
      {/* Decorative elements */}
      <div aria-hidden className="absolute top-10 left-10 text-9xl text-gray-100 font-serif z-0 opacity-50 select-none">“”</div>
      <div aria-hidden className="pointer-events-none absolute inset-0">{
        Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full bg-yellow-400/20" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-accent-600 font-bold text-sm uppercase tracking-wider mb-4 inline-flex items-center gap-2 justify-center">
          <MessageCircle size={16} />
          Success Stories
        </div>
        <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">Loved by Technology Leaders & Innovators</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">See how companies are discovering and partnering with game-changing technology vendors</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="text-yellow-400" size={20} fill="currentColor" />))}</div>
          <div className="font-bold text-slate-900 text-lg">4.9 out of 5</div>
          <div className="text-gray-600 text-sm">from 15,000+ reviews</div>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {['All', 'Buyers', 'Vendors', 'By Industry'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                filter === t ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid (desktop) + Carousel (mobile) */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t, i) => (
            <TestimonialCard key={i} t={t} onOpen={() => setModal(t)} />
          ))}
        </div>

        <div
          ref={containerRef}
          className="md:hidden flex gap-6 pb-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {filtered.map((t, i) => (
            <div key={i} className="min-w-[360px] snap-start">
              <TestimonialCard t={t} onOpen={() => setModal(t)} />
            </div>
          ))}
        </div>

        {/* Dots for mobile */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-4">
          {filtered.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${active === i ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'}`} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Want to share your story?</h3>
          <a href="#" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow-primary hover:scale-105 transition-all">
            <Edit size={18} />
            Submit Your Review
          </a>
          <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold mt-4 block">Read all 15,000+ reviews →</a>
        </div>
      </div>

      {/* Modal */}
      {modal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setModal(null)}
          >
            <div
              className="relative max-w-3xl w-full bg-white rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => setModal(null)} aria-label="Close" />
              {modal.type === 'video' ? (
                <div>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
                    <iframe
                      className="w-full h-full"
                      src={modal.videoSrc}
                      title="Testimonial video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">{modal.preview}</p>
                </div>
              ) : (
                <p className="text-gray-800 text-lg leading-relaxed">{modal.quote}</p>
              )}
              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-200">
                <Avatar a={modal.author} />
                <div>
                  <div className="font-bold text-slate-900">{modal.author.name}</div>
                  <div className="text-gray-600 text-sm">{modal.author.title} • {modal.author.company}</div>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  )
}

function TestimonialCard({ t, onOpen }) {
  if (t.type === 'video') return <VideoCard t={t} onOpen={onOpen} />
  return <TextCard t={t} onOpen={onOpen} />
}

function TextCard({ t, onOpen }) {
  return (
    <article
      onClick={onOpen}
      className={`group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-soft hover:shadow-hard transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer overflow-hidden`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary-50/50 to-accent-50/50`} />
      <Quote className="absolute top-6 right-6 text-primary-200" size={32} />

      <div className="flex items-center gap-1 mb-4 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} className="text-yellow-400" fill="currentColor" />
        ))}
      </div>

      <p
        className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10"
        style={{ display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
      >
        “{t.quote}”
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 relative z-10">
        <Avatar a={t.author} />
        <div>
          <div className="font-bold text-slate-900 text-lg">{t.author.name}</div>
          <div className="text-gray-600 text-sm">{t.author.title}</div>
          <div className="text-gray-500 text-sm">{t.author.company}</div>
        </div>
      </div>

      <span className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-100">
        {t.category}
      </span>

      <span className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity font-semibold text-gray-500">
        {t.logo}
      </span>
    </article>
  )
}

function VideoCard({ t, onOpen }) {
  return (
    <article
      onClick={onOpen}
      className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-soft hover:shadow-hard transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer overflow-hidden"
    >
      <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${t.thumbnailColor || 'from-gray-200 to-gray-300'}`} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play size={40} className="text-primary-600 ml-1" />
            </div>
            <span className="absolute -inset-3 rounded-full border-2 border-white/40 animate-pulse" />
          </div>
        </div>
        {t.duration && (
          <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-lg">
            {t.duration}
          </span>
        )}
      </div>

      <p
        className="text-gray-700 text-base leading-relaxed mb-4"
        style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
      >
        {t.preview}
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
        <Avatar a={t.author} />
        <div>
          <div className="font-bold text-slate-900 text-lg">{t.author.name}</div>
          <div className="text-gray-600 text-sm">{t.author.title}</div>
          <div className="text-gray-500 text-sm">{t.author.company}</div>
        </div>
      </div>

      <span className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-100">
        {t.category}
      </span>
    </article>
  )
}

function Avatar({ a }) {
  if (a.avatarType === 'photo' && a.src) {
    return <img src={a.src} alt={a.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
  }
  const initials = a.initials || a.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-md" aria-label={a.name}>
      {initials}
    </div>
  )
}

