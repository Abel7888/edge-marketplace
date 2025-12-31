import { useEffect, useMemo, useRef, useState } from 'react'
import { HelpCircle, MessageCircleQuestion, ArrowRight, Search as SearchIcon, Plus, Minus, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQSection({ onContactClick }) {
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(-1)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const listRef = useRef([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const faqs = useMemo(() => ([
    {
      q: 'What is Edge Marketplace and how does it work?',
      a: `Edge Marketplace is a supportive, one-stop platform for discovering, evaluating, and connecting with emerging technology vendors. Our goal is to make it simple for businesses to find the right solutions across AI, blockchain, IoT, cloud, edge computing, and more. You can explore vendor profiles, compare features and capabilities, schedule demos, request quotes, and access structured insights that help you make informed, confident decisions.`,
      cat: 'Getting Started',
    },
    {
      q: 'How do you verify and vet technology vendors?',
      a: `We work in partnership with Taloflow’s Expert Analysis team to evaluate each technology vendor thoroughly. This includes reviewing their capabilities, certifications, track record, use-case applicability, and overall reliability. Only vendors that meet our high standards for transparency, quality, and expertise are featured, giving buyers confidence that every connection is trustworthy and meaningful.`,
      cat: 'For Vendors',
    },
    {
      q: 'Is there a cost to use Edge Marketplace?',
      a: `For buyers, accessing Edge Marketplace is free. You can search vendors, compare solutions, schedule demos, and request quotes without any cost. For vendors, we offer optional programs to showcase solutions, reach targeted enterprise clients, and gain visibility among high-intent buyers. These programs are designed to be flexible and accessible, supporting vendors of all sizes in the emerging tech space.`,
      cat: 'Billing',
    },
    {
      q: 'How do I request a demo from vendors?',
      a: `Requesting a demo is simple. You can submit a demo request directly on a vendor’s profile, and we can coordinate the session on your behalf. Before the demo, we provide a pre-demo analysis highlighting each vendor’s strengths, potential trade-offs, and alignment with your specific needs. Alternatively, you can schedule directly with the vendor if you prefer. Our platform is designed to support you throughout the process, ensuring you get the most value from each demo.`,
      cat: 'For Buyers',
    },
    {
      q: 'Can I trust the insights provided on vendor profiles?',
      a: `Yes. Every vendor profile on Edge Marketplace includes verified capabilities, certifications, and objective analysis of strengths and limitations. Our goal is to provide honest, balanced information that helps buyers understand a vendor’s fit for their use case, so you can make decisions with clarity and confidence without being influenced solely by marketing claims or reviews.`,
      cat: 'Profiles',
    },
    {
      q: 'Can I schedule live demos with vendors?',
      a: `Absolutely. Live demos are a key part of discovering and evaluating solutions. Edge Marketplace allows you to schedule demos directly through our platform or with vendors themselves. For buyers who want added support, we can coordinate demos and provide context and analysis to ensure each session is informative, structured, and tailored to your business needs.`,
      cat: 'For Buyers',
    },
    {
      q: 'How can my company become a listed vendor?',
      a: `If your company provides emerging technology solutions, you can apply to be listed on Edge Marketplace. Our process is designed to be supportive and transparent, including verification of capabilities, certifications, and industry fit. Once approved, your company will be visible to thousands of qualified buyers actively exploring solutions in your category. This exposure helps you connect with the right decision-makers and grow meaningful business relationships.`,
      cat: 'For Vendors',
    },
    {
      q: 'What industries and technologies are represented?',
      a: `Edge Marketplace organizes vendors across industries, software, and hardware sub-sectors. Buyers can explore solutions from AI, IoT, digital twins, blockchain, edge computing, and more. We also feature vendors providing hardware infrastructure, robotics, drones, networking solutions, and specialized tools across sectors. Industries served include healthcare, finance, real estate, supply chain, manufacturing, and transportation. Our goal is to give buyers a comprehensive view of innovative solutions while helping vendors reach relevant decision-makers in the industries they serve. There’s always something new to discover and explore.`,
      cat: 'Getting Started',
    },
    {
      q: 'How is my company data and information protected?',
      a: `Protecting your data is a top priority. Edge Marketplace uses industry-standard encryption, secure communication protocols, and strict privacy practices. All interactions, including demo requests, quotes, and vendor communications, are protected. Buyers and vendors can explore and connect with confidence, knowing that sensitive information is handled responsibly and securely.`,
      cat: 'Security',
    },
  ]), [])

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return faqs
    const q = query.toLowerCase()
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q))
  }, [faqs, query])

  const handleToggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx))
    const el = listRef.current[idx]
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 10)
    }
  }

  const onKeyDown = (e, idx) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(idx + 1, filteredFaqs.length - 1)
      listRef.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(idx - 1, 0)
      listRef.current[prev]?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle(idx)
    } else if (e.key === 'Escape') {
      setOpenIndex(-1)
    }
  }

  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-4 inline-flex items-center gap-2">
            <HelpCircle size={16} />
            FAQs
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">Everything you need to know about Edge Marketplace. Can't find what you're looking for? Contact our support team.</p>

          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
            <MessageCircleQuestion size={32} className="text-primary-600 mb-4" />
            <div className="font-bold text-slate-900 text-lg mb-2">Still have questions?</div>
            <div className="text-gray-600 text-sm mb-4">Our team is here to help you navigate the platform</div>
            <button 
              onClick={onContactClick}
              className="w-full bg-white border-2 border-primary-200 text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all inline-flex items-center justify-center gap-2"
            >
              Contact Support
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Removed response time and support availability metrics */}
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-3"
        >
          <div className="mb-8 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all text-base"
              placeholder="Search frequently asked questions..."
              aria-label="Search FAQs"
            />
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((f, idx) => (
              <AccordionItem
                key={f.q}
                ref={(el) => (listRef.current[idx] = el)}
                index={idx}
                question={f.q}
                answer={f.a}
                open={openIndex === idx}
                onToggle={() => handleToggle(idx)}
                onKeyDown={(e) => onKeyDown(e, idx)}
              />
            ))}
          </div>

          {/* Removed bottom CTA block for a cleaner FAQ section */}
        </motion.div>
      </div>
    </section>
  )
}

const AccordionItem = ({ question, answer, open, onToggle, index, onKeyDown }, ref) => {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [open])

  return (
    <div className="group border border-gray-200 rounded-2xl bg-white hover:border-primary-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <button
        ref={ref}
        className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all ${open ? 'bg-gradient-to-r from-primary-50/50 to-accent-50/50' : 'hover:bg-gray-50'}`}
        aria-expanded={open}
        aria-controls={`faq-${index}`}
        onClick={onToggle}
        onKeyDown={onKeyDown}
      >
        <span className="text-lg lg:text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors pr-4 leading-relaxed">
          {question}
        </span>
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-all text-gray-600 group-hover:text-primary-600">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="px-8 pb-6 pt-0">
              <div className="text-gray-700 leading-relaxed text-base prose prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6">
                {answer.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="mt-6 pt-6 border-top border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-600">Was this helpful?</span>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 transition-all" aria-label="Helpful">
                    <ThumbsUp size={16} className="mx-auto" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all" aria-label="Not Helpful">
                    <ThumbsDown size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const _Accordion = typeof forwardRef === 'function' ? forwardRef(AccordionItem) : (props) => AccordionItem(props, null)
function forwardRef(render) { return render }
AccordionItem.displayName = 'AccordionItem'

export { _Accordion as AccordionItem }
