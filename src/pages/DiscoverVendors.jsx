import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { subscribeVendors } from '../lib/firestoreVendors.js'
import { useAuth } from '../context/AuthContext.jsx'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { ArrowRight, CheckCircle2, Search, Funnel, ChevronRight, LayoutGrid, List, BarChart3, Heart, Shield, Eye, Download, Play, Gift, Calculator, Star, Quote, Loader2, X, Mail, Building2, Briefcase, Phone, Users as UsersIcon, Calendar, Building, Package, Target as TargetIcon, DollarSign, GraduationCap } from 'lucide-react'

export default function DiscoverVendors() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allVendors, setAllVendors] = useState([])
  const [vendorsLoading, setVendorsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState('Industry')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category'))
  const [quickFilters, setQuickFilters] = useState({ verified: false, featured: false, freeTrial: false, enterprise: false })
  const [view, setView] = useState('grid')
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [sortBy, setSortBy] = useState('relevant')
  const [expandedCard, setExpandedCard] = useState(null)
  const [comparisonList, setComparisonList] = useState([])
  const [hoveredCard, setHoveredCard] = useState(null)
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('savedVendorIds')
      if (!raw) return new Set()
      const arr = JSON.parse(raw)
      return new Set(Array.isArray(arr)? arr : [])
    } catch { return new Set() }
  })
  const currentPath = (typeof window !== 'undefined' && window.location?.pathname) || ''
  const [loading, setLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    verified: false,
    featured: false,
    budget: [0, 500000],
    companyStage: [],
    industries: [],
    integrations: [],
    deployment: [],
    rating: 0,
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [agentChats, setAgentChats] = useState({
    astra:{ messages:[{from:'bot', text:"Hi, I'm Astra. What kind of tech are you exploring?"}], input:'' },
    vera:{ messages:[{from:'bot', text:'Share a vendor name or paste a profile link to analyze.'}], input:'' },
    leo:{ messages:[{from:'bot', text:'Tell me your stack, timeline, and budget to match teams.'}], input:'' },
    nia:{ messages:[{from:'bot', text:'Pick a topic (AI, IoT, AR/VR) and I will curate insights.'}], input:'' },
    atlas:{ messages:[{from:'bot', text:'Describe the initiative and KPIs to model ROI.'}], input:'' },
    eve:{ messages:[{from:'bot', text:'Are you here to find vendors, hire talent, get insights, or analyze ROI?'}], input:'' },
  })

  function setAgentInput(key, value){
    setAgentChats(prev => ({ ...prev, [key]: { ...prev[key], input: value } }))
  }
  function sendAgentMessage(key, overrideText){
    const entry = agentChats[key]
    const text = ((overrideText ?? entry.input) || '').trim()
    if (!text) return
    const userMsg = { from:'user', text }
    const canned = {
      astra: "Got it. Here are 3 vetted matches. Want demos or a side‑by‑side compare?",
      vera: "Analyzed. Vendor Trust Score: 86/100. Noted strong funding, limited enterprise case studies.",
      leo: "I found 2 teams available in 2 weeks. Estimated range: $25k–$60k. See details?",
      nia: "This week’s highlights ready. Want top trends, funding rounds, or case studies first?",
      atlas: "Estimated ROI: 165% in 18 months based on 20 deployments. View assumptions?",
      eve: "I can route you: Find Vendors, Hire Teams, Get Insights, or Analyze ROI. Which one?",
    }
    const botMsg = { from:'bot', text: canned[key] || 'Noted.' }
    setAgentChats(prev => ({
      ...prev,
      [key]: { messages:[...prev[key].messages, userMsg, botMsg], input:'' }
    }))
  }

  useEffect(() => {
    const unsub = subscribeVendors((list)=>{
      setAllVendors(list)
      setVendorsLoading(false)
    })
    return () => { if (typeof unsub === 'function') unsub() }
  }, [])

  useEffect(()=>{
    const t = setTimeout(()=> setDebouncedTerm(searchTerm || query), 300)
    return ()=> clearTimeout(t)
  }, [searchTerm, query])

  const synonyms = useMemo(()=> ({
    ai: ['artificial intelligence','machine learning','ml','ai'],
    robotics: ['robot','robotic','robotics'],
    fintech: ['fintech','payments','lending','banking'],
    proptech: ['proptech','real estate','smart building','smart buildings'],
  }), [])

  function tokenize(str){
    return (str||'').toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean)
  }

function ModalBase({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

function HeaderGradient({ vendor, title, subtitle, onClose }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <div className="relative p-5 text-white flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center text-2xl" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}>
          <span>{vendor.logoEmoji}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm opacity-90">{vendor.name}</div>
          <div className="text-lg font-semibold">{title}</div>
          {subtitle && <div className="text-xs opacity-90">{subtitle}</div>}
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 grid place-items-center">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

function TrustBar({ vendor }) {
  return (
    <div className="px-5 py-2 bg-white flex items-center gap-4 text-sm text-gray-700 border-b">
      <span>⚡ Average response time: {vendor.metrics?.avgResponseTime ? `< ${vendor.metrics.avgResponseTime} hours` : '< 2 hours'}</span>
      <span>✓ {Math.max(47, vendor.metrics?.demoRequests || 0)} demos completed this month</span>
      <span>⭐ {(vendor.metrics?.satisfactionScore || 4.9)}/5 satisfaction</span>
    </div>
  )
}

function Field({ label, required, error, children, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-900">{label}{required && <span className="text-red-500">*</span>}</label>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  )
}

function RequestDemoModal({ vendor, formData, setFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting, submitSuccess, setSubmitSuccess, onDone }) {
  function set(k, v){ setFormData(prev => ({ ...prev, [k]: v })) }
  function validate(){
    const e = {}
    if (!formData.fullName || String(formData.fullName).trim().split(' ').length < 2) e.fullName = 'Please enter your full name'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email||'')) e.email = 'Enter a valid work email'
    if (!formData.company) e.company = 'Company required'
    if (!formData.jobTitle) e.jobTitle = 'Job title required'
    if (!formData.companySize) e.companySize = 'Select company size'
    if (!formData.industry) e.industry = 'Select industry'
    if (!formData.request) e.request = 'Tell us what you want to see'
    setFormErrors(e)
    return Object.keys(e).length===0
  }
  async function submit(){
    if (!validate()) return
    setIsSubmitting(true)
    await new Promise(r=> setTimeout(r, 900))
    setSubmitSuccess(true)
    await new Promise(r=> setTimeout(r, 900))
    onDone()
  }
  return (
    <div className="flex flex-col">
      <HeaderGradient vendor={vendor} title={`Request a Live Demo with ${vendor.name}`} subtitle="Get a personalized walkthrough from their team" onClose={onDone} />
      <TrustBar vendor={vendor} />
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label="Full Name" required error={formErrors.fullName}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="John Doe" value={formData.fullName||''} onChange={e=> set('fullName', e.target.value)} />
          </Field>
          <Field label="Work Email" required error={formErrors.email} hint="We'll send demo details here">
            <input className="w-full rounded-lg border px-3 py-2" placeholder="john@company.com" value={formData.email||''} onChange={e=> set('email', e.target.value)} />
          </Field>
          <Field label="Company Name" required error={formErrors.company}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Acme Corporation" value={formData.company||''} onChange={e=> set('company', e.target.value)} />
          </Field>
          <Field label="Job Title" required error={formErrors.jobTitle}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="VP, Operations" value={formData.jobTitle||''} onChange={e=> set('jobTitle', e.target.value)} />
          </Field>
          <Field label="Phone Number" hint="For faster scheduling">
            <input className="w-full rounded-lg border px-3 py-2" placeholder="(555) 123-4567" value={formData.phone||''} onChange={e=> set('phone', e.target.value)} />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Company Size" required error={formErrors.companySize}>
            <select className="w-full rounded-lg border px-3 py-2" value={formData.companySize||''} onChange={e=> set('companySize', e.target.value)}>
              <option value="">Select...</option>
              {['1-10','11-50','51-200','201-500','500+'].map(s=> <option key={s} value={s}>{s} employees</option>)}
            </select>
          </Field>
          <Field label="Preferred Demo Date">
            <input type="date" className="w-full rounded-lg border px-3 py-2" value={formData.date||''} onChange={e=> set('date', e.target.value)} />
          </Field>
          <Field label="Industry" required error={formErrors.industry}>
            <select className="w-full rounded-lg border px-3 py-2" value={formData.industry||''} onChange={e=> set('industry', e.target.value)}>
              <option value="">Select...</option>
              {['Construction','Finance','Healthcare','Real Estate','Manufacturing','Retail','Technology','Other'].map(i=> <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Current Solution">
            <input className="w-full rounded-lg border px-3 py-2" placeholder="None - first time" value={formData.currentSolution||''} onChange={e=> set('currentSolution', e.target.value)} />
          </Field>
          <Field label="What would you like to see?" required error={formErrors.request}>
            <textarea rows={4} maxLength={500} className="w-full rounded-lg border px-3 py-2" placeholder="e.g., Integration with Salesforce, pricing for 50 users" value={formData.request||''} onChange={e=> set('request', e.target.value)} />
            <div className="text-xs text-gray-500 mt-1">{(formData.request||'').length}/500</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Pricing details','Integration options','Implementation timeline','ROI calculator'].map(s => (
                <button type="button" key={s} onClick={()=> set('request', `${formData.request ? formData.request + '; ' : ''}${s}`)} className="px-2 py-1 rounded-full border text-xs">{s}</button>
              ))}
            </div>
          </Field>
        </div>
      </div>
      <div className="px-5 pb-5">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-blue-600" checked={!!formData.consent} onChange={e=> set('consent', e.target.checked)} /> I agree to receive demo details and follow-up communications
        </label>
      </div>
      <div className="p-5 border-t bg-white">
        <button onClick={submit} disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Calendar size={18} />} {isSubmitting? 'Submitting...' : submitSuccess? 'Demo Requested!' : 'Schedule My Demo'}
        </button>
        <div className="text-center text-xs text-gray-600 mt-2">You'll receive confirmation within 2 hours</div>
      </div>
    </div>
  )
}

function RequestQuoteModal(props){
  const { vendor, formData, setFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting, submitSuccess, setSubmitSuccess, onDone } = props
  function set(k, v){ setFormData(prev => ({ ...prev, [k]: v })) }
  function validate(){
    const e = {}
    if (!formData.fullName || String(formData.fullName).trim().split(' ').length < 2) e.fullName = 'Please enter your full name'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email||'')) e.email = 'Enter a valid email'
    if (!formData.company) e.company = 'Company required'
    if (!formData.budget) e.budget = 'Select budget range'
    if (!formData.timeline) e.timeline = 'Select timeline'
    if (!formData.userCount) e.userCount = 'Enter user count'
    setFormErrors(e); return Object.keys(e).length===0
  }
  async function submit(){ if (!validate()) return; setIsSubmitting(true); await new Promise(r=> setTimeout(r, 900)); setSubmitSuccess(true); await new Promise(r=> setTimeout(r, 900)); onDone() }
  const budgetRanges = ['< $10,000','$10,000 - $25,000','$25,000 - $50,000','$50,000 - $100,000','$100,000 - $250,000','$250,000+','Flexible / Not Sure']
  const timelines = ['Immediate (< 1 month)','Short-term (1-3 months)','Medium-term (3-6 months)','Long-term (6+ months)','Just researching']
  return (
    <div className="flex flex-col">
      <HeaderGradient vendor={vendor} title={`Get Custom Pricing from ${vendor.name}`} subtitle="Receive a tailored quote based on your needs" onClose={onDone} />
      <div className="px-5 py-2 bg-white text-sm text-emerald-700">💰 Average quote delivered in 4 hours</div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label="Full Name" required error={formErrors.fullName}><input className="w-full rounded-lg border px-3 py-2" value={formData.fullName||''} onChange={e=> set('fullName', e.target.value)} /></Field>
          <Field label="Email" required error={formErrors.email}><input className="w-full rounded-lg border px-3 py-2" value={formData.email||''} onChange={e=> set('email', e.target.value)} /></Field>
          <Field label="Company" required error={formErrors.company}><input className="w-full rounded-lg border px-3 py-2" value={formData.company||''} onChange={e=> set('company', e.target.value)} /></Field>
          <Field label="Budget Range" required error={formErrors.budget}>
            <select className="w-full rounded-lg border px-3 py-2" value={formData.budget||''} onChange={e=> set('budget', e.target.value)}>
              <option value="">Select...</option>
              {budgetRanges.map(b=> <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Timeline / Urgency" required error={formErrors.timeline}>
            <select className="w-full rounded-lg border px-3 py-2" value={formData.timeline||''} onChange={e=> set('timeline', e.target.value)}>
              <option value="">Select...</option>
              {timelines.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Team Size / User Count" required error={formErrors.userCount}>
            <input type="number" min={1} className="w-full rounded-lg border px-3 py-2" value={formData.userCount||''} onChange={e=> set('userCount', e.target.value)} />
          </Field>
          <Field label="Required Features">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['API access','Custom integrations','Dedicated support','Training & onboarding','SLA guarantees','White-label options','Advanced analytics','Mobile apps'].map(f => (
                <label key={f} className="inline-flex items-center gap-2"><input type="checkbox" className="accent-blue-600" /> {f}</label>
              ))}
            </div>
          </Field>
        </div>
      </div>
      <div className="p-5 border-t bg-white">
        <button onClick={submit} disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <DollarSign size={18} />} {isSubmitting? 'Preparing your quote request...' : submitSuccess? 'Quote request sent!' : 'Get My Custom Quote'}
        </button>
      </div>
    </div>
  )
}

function VetVendorModal(props){
  const { vendor, formData, setFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting, submitSuccess, setSubmitSuccess, onDone } = props
  function set(k, v){ setFormData(prev => ({ ...prev, [k]: v })) }
  function validate(){ const e = {}; if (!formData.vendorName) e.vendorName = 'Vendor name required'; if (!/^https?:\/\//.test(formData.vendorUrl||'')) e.vendorUrl='Valid URL required'; if (!formData.reason || (formData.reason||'').length<50) e.reason='Min 50 characters'; if (!formData.email) e.email='Email required'; setFormErrors(e); return Object.keys(e).length===0 }
  async function submit(){ if (!validate()) return; setIsSubmitting(true); await new Promise(r=> setTimeout(r, 900)); setSubmitSuccess(true); await new Promise(r=> setTimeout(r, 900)); onDone() }
  return (
    <div className="flex flex-col">
      <HeaderGradient vendor={vendor} title="Request Vendor Vetting" subtitle="Our team will research and verify this vendor for you" onClose={onDone} />
      <div className="px-5 py-2 text-sm text-emerald-700">✓ We've vetted 270+ vendors already • Typical turnaround: 3-5 business days</div>
      <div className="p-5 space-y-4">
        <Field label="Vendor Name" required error={formErrors.vendorName}><input className="w-full rounded-lg border px-3 py-2" value={formData.vendorName||vendor.name} onChange={e=> set('vendorName', e.target.value)} /></Field>
        <Field label="Vendor Website URL" required error={formErrors.vendorUrl}><input className="w-full rounded-lg border px-3 py-2" placeholder="https://" value={formData.vendorUrl||vendor.websiteUrl} onChange={e=> set('vendorUrl', e.target.value)} /></Field>
        <Field label="How did you find them?">
          <select className="w-full rounded-lg border px-3 py-2" value={formData.source||''} onChange={e=> set('source', e.target.value)}>
            <option value="">Select...</option>
            {['Google search','LinkedIn','Industry event','Referral','Social media','Other'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Why do you want this vendor vetted?" required error={formErrors.reason}>
          <textarea rows={6} className="w-full rounded-lg border px-3 py-2" placeholder="e.g., Claims seem too good to be true..." value={formData.reason||''} onChange={e=> set('reason', e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">{(formData.reason||'').length} / 800</div>
        </Field>
        <Field label="Your Email for Updates" required error={formErrors.email}><input className="w-full rounded-lg border px-3 py-2" value={formData.email||''} onChange={e=> set('email', e.target.value)} /></Field>
      </div>
      <div className="p-5 border-t bg-white">
        <button onClick={submit} disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />} {isSubmitting? 'Submitting...' : submitSuccess? 'Request submitted!' : 'Submit Vetting Request'}
        </button>
      </div>
    </div>
  )
}

function ContactVendorModal(props){
  const { vendor, formData, setFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting, submitSuccess, setSubmitSuccess, onDone } = props
  function set(k, v){ setFormData(prev => ({ ...prev, [k]: v })) }
  function validate(){ const e = {}; if (!formData.fullName) e.fullName='Name required'; if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email||'')) e.email='Valid email required'; if (!formData.company) e.company='Company required'; if (!formData.message) e.message='Message required'; setFormErrors(e); return Object.keys(e).length===0 }
  async function submit(){ if (!validate()) return; setIsSubmitting(true); await new Promise(r=> setTimeout(r, 800)); setSubmitSuccess(true); await new Promise(r=> setTimeout(r, 800)); onDone() }
  return (
    <div className="flex flex-col">
      <HeaderGradient vendor={vendor} title={`Contact ${vendor.name}`} subtitle="Send a message directly to their team" onClose={onDone} />
      <div className="p-5 space-y-4">
        <Field label="Your Name" required error={formErrors.fullName}><input className="w-full rounded-lg border px-3 py-2" value={formData.fullName||''} onChange={e=> set('fullName', e.target.value)} /></Field>
        <Field label="Your Email" required error={formErrors.email}><input className="w-full rounded-lg border px-3 py-2" value={formData.email||''} onChange={e=> set('email', e.target.value)} /></Field>
        <Field label="Company" required error={formErrors.company}><input className="w-full rounded-lg border px-3 py-2" value={formData.company||''} onChange={e=> set('company', e.target.value)} /></Field>
        <Field label="Message" required error={formErrors.message}>
          <textarea rows={8} className="w-full rounded-lg border px-3 py-2" placeholder="Interested in learning more..." value={formData.message||''} onChange={e=> set('message', e.target.value)} />
        </Field>
      </div>
      <div className="p-5 border-t bg-white">
        <button onClick={submit} disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />} {isSubmitting? 'Sending...' : submitSuccess? 'Message sent!' : 'Send Message'}
        </button>
        <div className="text-center text-xs text-gray-600 mt-2">Typical response: &lt; 4 hours</div>
      </div>
    </div>
  )
}
  function editDistance(a,b){
    const dp = Array(b.length+1).fill(null).map(()=>Array(a.length+1).fill(0))
    for(let i=0;i<=a.length;i++) dp[0][i]=i
    for(let j=0;j<=b.length;j++) dp[j][0]=j
    for(let j=1;j<=b.length;j++){
      for(let i=1;i<=a.length;i++){
        const cost = a[i-1]===b[j-1]?0:1
        dp[j][i] = Math.min(dp[j-1][i]+1, dp[j][i-1]+1, dp[j-1][i-1]+cost)
      }
    }
    return dp[b.length][a.length]
  }
  function fuzzyIncludes(text, term){
    const t = (text||'').toLowerCase()
    const q = (term||'').toLowerCase()
    if (t.includes(q)) return true
    // simple typo tolerance
    if (q.length>=4){
      for(let i=0;i<=t.length-q.length;i++){
        const seg = t.slice(i,i+q.length)
        if (editDistance(seg,q)<=1) return true
      }
    }
    return false
  }
  function expandTerms(term){
    const base = [term.toLowerCase()]
    Object.entries(synonyms).forEach(([k,arr])=>{
      if (base.some(t => t.includes(k)) || arr.some(s=> term.toLowerCase().includes(s))) base.push(...arr)
    })
    return Array.from(new Set(base))
  }
  function performWeightedSearch(list, term){
    const terms = expandTerms(term)
    const weights = { name:10, tagline:8, tags:7, short:6, category:5, full:4, industries:3, useCases:2 }
    const scored = list.map(v=>{
      let score = 0
      const add = (field, text)=>{ if (!text) return; if (terms.some(t=> fuzzyIncludes(text, t))) score += weights[field] }
      add('name', v.name)
      add('tagline', v.tagline)
      add('tags', (v.tags||[]).join(' '))
      add('short', v.shortDescription)
      add('category', `${v.category} ${v.subcategory}`)
      add('full', v.fullDescription)
      add('industries', (v.industries||[]).join(' '))
      add('useCases', (v.useCases||[]).join(' '))
      return { v, score }
    })
    .filter(x=> x.score>0)
    .sort((a,b)=> b.score - a.score)
    return scored.map(x=> x.v)
  }
  function applyFilters(list){
    let out = [...list]
    if (activeFilters.verified) out = out.filter(v=> v.isVerified)
    if (activeFilters.featured) out = out.filter(v=> v.isFeatured)
    if (selectedCategory) out = out.filter(v => v.category.toLowerCase().includes(selectedCategory) || v.tags?.some(t=> t.toLowerCase().includes(selectedCategory)))
    // budget range (using startingPrice fallback)
    out = out.filter(v=> (v.startingPrice||0) >= activeFilters.budget[0] && (v.startingPrice||0) <= activeFilters.budget[1])
    if (activeFilters.rating>0) out = out.filter(v=> (v.metrics?.satisfactionScore||0) >= activeFilters.rating)
    // integrations contains any selected
    if (activeFilters.integrations.length>0) out = out.filter(v=> (v.integrations||[]).some(iv=> activeFilters.integrations.includes(iv)))
    return out
  }
  function sortResults(list){
    const sorters = {
      relevant: (a,b) => (b.metrics.viewCount + b.metrics.demoRequests*10) - (a.metrics.viewCount + a.metrics.demoRequests*10),
      rated: (a,b) => (b.metrics.satisfactionScore - a.metrics.satisfactionScore),
      requested: (a,b) => (b.metrics.demoRequests - a.metrics.demoRequests),
      roi: (a,b) => ((b.results?.metric1?.match(/\d+/)?.[0]||0) - (a.results?.metric1?.match(/\d+/)?.[0]||0)),
      newest: (a,b) => new Date(b.createdAt) - new Date(a.createdAt),
      price_asc: (a,b) => (a.startingPrice||0) - (b.startingPrice||0),
    }
    const fn = sortBy==='relevant'?sorters.relevant: sortBy==='rated'?sorters.rated: sortBy==='requested'?sorters.requested: sortBy==='roi'?sorters.roi: sortBy==='newest'?sorters.newest: sorters.price_asc
    return [...list].sort(fn)
  }

  const featuredVendors = useMemo(() => {
    const f = allVendors.filter(v => v.isFeatured)
    if (f.length >= 6) return f.slice(0, 6)
    return [...allVendors].sort((a,b)=> (b.metrics.viewCount - a.metrics.viewCount)).slice(0, 6)
  }, [allVendors])

  const categories = useMemo(() => ({
    Industry: [
      { key: 'proptech', icon: '🏢', name: 'PropTech', count: 17, desc: 'Smart buildings & real estate innovation', preview: 'BuildSense AI - 40% energy savings' },
      { key: 'fintech', icon: '💰', name: 'FinTech', count: 20, desc: 'Financial services & payment innovation', preview: 'FinFlow - AI lending platform' },
      { key: 'contech', icon: '🏗️', name: 'ConTech', count: 22, desc: 'Construction tech & project management', preview: 'SiteVision - Drone surveying' },
      { key: 'medtech', icon: '🏥', name: 'MedTech', count: 19, desc: 'Medical devices & diagnostics', preview: 'DiagnostAI - 99.5% accuracy' },
      { key: 'healthtech', icon: '💊', name: 'HealthTech', count: 31, desc: 'Telemedicine & health platforms', preview: 'CarePulse - Remote monitoring' },
      { key: 'supplychain', icon: '🏭', name: 'Supplychain & Manufacturing Tech', count: 28, desc: 'Smart factories & resilient supply chains', preview: 'FactoryTalk • Blue Yonder • SAP' },
    ],
    Software: [
      { key: 'ai', icon: '🤖', name: 'Artificial Intelligence', desc: 'NLP, computer vision, predictive analytics', preview: 'Most searched: CogniFlow' },
      { key: 'ml', icon: '📊', name: 'Machine Learning', desc: 'AutoML, model training, ML ops' },
      { key: 'iot', icon: '🌐', name: 'Internet of Things', desc: 'Sensors, connectivity, edge devices' },
      { key: 'web3', icon: '⛓️', name: 'Blockchain / Web3', desc: 'Smart contracts, DeFi, NFTs' },
      { key: 'arvr', icon: '🥽', name: 'AR/VR', desc: 'Immersive experiences, training simulations' },
      { key: 'digital-twin', icon: '🔄', name: 'Digital Twin', desc: 'Virtual replicas, simulation, optimization' },
      { key: 'edge-computing', icon: '⚡', name: 'Edge Computing', desc: 'Real-time processing, low-latency solutions' },
    ],
    Hardware: [
      { key: 'semiconductors', icon: '💾', name: 'Computing & Processing' },
      { key: 'networking', icon: '🌐', name: 'Networking & Connectivity Vendors' },
      { key: 'automation-robotics', icon: '🦾', name: 'Automation & Robotics' },
      { key: 'power-infrastructure', icon: '⚡', name: 'Power & Infrastructure' },
      { key: '3d-printing', icon: '🖨️', name: '3D Printing' },
      { key: 'quantum', icon: '⚛️', name: 'Quantum Computing' },
    ],
  }), [])

  const filteredVendors = useMemo(() => {
    let list = [...allVendors]
    // Apply quick filters first for performance
    if (quickFilters.verified) list = list.filter(v => v.isVerified)
    if (quickFilters.featured) list = list.filter(v => v.isFeatured)
    if (quickFilters.freeTrial) list = list.filter(v => (v.pricingModel||'').toLowerCase().includes('free'))
    if (quickFilters.enterprise) list = list.filter(v => v.tags?.includes('Enterprise'))

    // Apply advanced filter panel
    list = applyFilters(list)

    // Search
    const term = (debouncedTerm||'').trim()
    if (term.length>0) {
      list = performWeightedSearch(list, term)
    }

    return sortResults(list)
  }, [allVendors, debouncedTerm, selectedCategory, quickFilters, sortBy, activeFilters])

  useEffect(() => {
    if (selectedCategory) setSearchParams({ category: selectedCategory })
    else setSearchParams({})
  }, [selectedCategory, setSearchParams])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(()=> setLoading(false), 250)
    return () => clearTimeout(t)
  }, [query, selectedCategory, quickFilters, sortBy, view])

  useEffect(() => {
    // persist saved vendor ids to localStorage
    try { localStorage.setItem('savedVendorIds', JSON.stringify(Array.from(saved))) } catch {}
  }, [saved])

  useEffect(() => {
    if (showModal) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [showModal])

  function openModal(type, vendor){
    setSelectedVendor(vendor)
    setModalType(type)
    setShowModal(true)
  }

  const [statVendors, setStatVendors] = useState(0)
  const [statRating, setStatRating] = useState(0)
  const [statCompanies, setStatCompanies] = useState(0)
  const [statValue, setStatValue] = useState(0)
  useEffect(() => {
    let raf
    const animate = (setter, target, duration=800) => {
      const start = performance.now()
      const step = (t) => {
        const p = Math.min(1, (t - start) / duration)
        setter(Math.floor(p * target))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    animate(setStatVendors, 270)
    animate(setStatRating, 48)
    animate(setStatCompanies, 1200)
    animate(setStatValue, 2500)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Mobile sidebar toggle */}
      <button onClick={()=> setSidebarOpen(v=>!v)} className="lg:hidden fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <LayoutGrid size={16}/> Menu
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20 top-20" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Dark gradient with glassmorphism) */}
      <aside className={`fixed z-30 top-20 left-0 h-[calc(100vh-5rem)] w-[280px] transition-transform duration-300 ${sidebarOpen? 'translate-x-0':'-translate-x-full'} lg:translate-x-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl flex flex-col backdrop-blur-md`}>
        {/* Header / Brand */}
        <div className="px-5 pt-5">
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="p-5">
              <div className="text-xs uppercase tracking-wide text-white/70">Navigation</div>
              <div className="text-xl font-bold">Discover</div>
            </div>
          </div>
        </div>

        {/* Nav Groups */}
        <nav className="mt-4 px-3 space-y-6 overflow-y-auto pb-20">
          {/* Industry Solutions */}
          <div>
            <div className="px-2 mb-3">
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg">
                Industry Solutions
              </div>
            </div>
            <div className="space-y-1">
              <a href="/discover/fintech" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/fintech')? 'bg-white/10 border-l-4 border-green-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">💰</span>
                <span className="font-medium">FinTech</span>
              </a>
              <a href="/discover/proptech" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/proptech')? 'bg-white/10 border-l-4 border-blue-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🏢</span>
                <span className="font-medium">PropTech</span>
              </a>
              <a href="/discover/contech" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/contech')? 'bg-white/10 border-l-4 border-orange-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🏗️</span>
                <span className="font-medium">ConTech</span>
              </a>
              <a href="/discover/medtech" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/medtech')? 'bg-white/10 border-l-4 border-red-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🏥</span>
                <span className="font-medium">MedTech</span>
              </a>
              <a href="/discover/healthtech" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/healthtech')? 'bg-white/10 border-l-4 border-teal-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">💊</span>
                <span className="font-medium">HealthTech</span>
              </a>
              <a href="/discover/supply-chain" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/supply')? 'bg-white/10 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🏭</span>
                <span className="font-medium">Supply Chain</span>
              </a>
            </div>
          </div>

          {/* Software & AI */}
          <div>
            <div className="px-2 mb-3">
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg">
                Software & AI
              </div>
            </div>
            <div className="space-y-1">
              <a href="/discover/ai" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/ai')? 'bg-white/10 border-l-4 border-blue-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🤖</span>
                <span className="font-medium">AI</span>
              </a>
              <a href="/discover/ml" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/ml')? 'bg-white/10 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">📊</span>
                <span className="font-medium">ML</span>
              </a>
              <a href="/discover/iot" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/iot')? 'bg-white/10 border-l-4 border-cyan-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🌐</span>
                <span className="font-medium">IoT</span>
              </a>
              <a href="/discover/web3" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/web3')? 'bg-white/10 border-l-4 border-purple-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">⛓️</span>
                <span className="font-medium">Web3</span>
              </a>
              <a href="/discover/arvr" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/arvr')? 'bg-white/10 border-l-4 border-pink-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🥽</span>
                <span className="font-medium">AR/VR</span>
              </a>
              <a href="/discover/digital-twin" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/digital-twin')? 'bg-white/10 border-l-4 border-indigo-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🔄</span>
                <span className="font-medium">Digital Twin</span>
              </a>
              <a href="/discover/edge-computing" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/edge')? 'bg-white/10 border-l-4 border-cyan-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">⚡</span>
                <span className="font-medium">Edge Computing</span>
              </a>
            </div>
          </div>

          {/* Hardware & Infrastructure */}
          <div>
            <div className="px-2 mb-3">
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg">
                Hardware & Infrastructure
              </div>
            </div>
            <div className="space-y-1">
              <a href="/discover/semiconductors" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/semiconductors')? 'bg-white/10 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">💾</span>
                <span className="font-medium">Semiconductors</span>
              </a>
              <a href="/discover/networking" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/networking')? 'bg-white/10 border-l-4 border-cyan-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🌐</span>
                <span className="font-medium">Networking</span>
              </a>
              <a href="/discover/automation-robotics" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/automation')? 'bg-white/10 border-l-4 border-amber-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🦾</span>
                <span className="font-medium">Automation & Robotics</span>
              </a>
              <a href="/discover/power-infrastructure" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/power')? 'bg-white/10 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">⚡</span>
                <span className="font-medium">Power Infrastructure</span>
              </a>
              <a href="/discover/3d-printing" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/3d-printing')? 'bg-white/10 border-l-4 border-fuchsia-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">🧩</span>
                <span className="font-medium">3D Printing</span>
              </a>
              <a href="/discover/quantum" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${currentPath.includes('/quantum')? 'bg-white/10 border-l-4 border-teal-400' : 'hover:bg-white/5'}`}>
                <span className="text-lg">⚛️</span>
                <span className="font-medium">Quantum Computing</span>
              </a>
            </div>
          </div>

          {/* Services & Solutions */}
          <div>
            <div className="px-2 text-[11px] uppercase tracking-wide text-white/60 mb-2">Services & Solutions</div>
            <a href="/hire" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${currentPath.startsWith('/hire')? 'bg-white/10 border-l-4 border-purple-400' : 'hover:bg-white/5'}`}>
              <Briefcase size={20} className="text-purple-300"/>
              <div>
                <div className="font-semibold">Hire Development Team</div>
                <div className="text-xs text-white/70">Vetted teams to build your solution</div>
              </div>
            </a>
            <a href="/find-talent" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${currentPath.startsWith('/find-talent')? 'bg-white/10 border-l-4 border-indigo-400' : 'hover:bg-white/5'}`}>
              <Briefcase size={20} className="text-indigo-300"/>
              <div>
                <div className="font-semibold">Find Talent</div>
                <div className="text-xs text-white/70">Engineers and specialists</div>
              </div>
            </a>
          </div>

          {/* My Workspace */}
          <div>
            <div className="px-2 text-[11px] uppercase tracking-wide text-white/60 mb-2">My Workspace</div>
            <a href="/saved-new" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${currentPath.startsWith('/saved-new')? 'bg-white/10 border-l-4 border-rose-400' : 'hover:bg-white/5'}`}>
              <Heart size={20} className="text-rose-300"/>
              <div>
                <div className="font-semibold">Saved Vendors <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10">Your shortlist</span></div>
                <div className="text-xs text-white/70">Favorites and comparisons</div>
              </div>
            </a>
            <a href="/saved-firms" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition mt-2 ${currentPath.startsWith('/saved-firms')? 'bg-white/10 border-l-4 border-blue-400' : 'hover:bg-white/5'}`}>
              <Heart size={20} className="text-blue-300" fill="currentColor"/>
              <div>
                <div className="font-semibold">Saved Firms <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10">Dev teams</span></div>
                <div className="text-xs text-white/70">Development partners</div>
              </div>
            </a>
          </div>

          {/* Insights & Reports */}
          <div>
            <div className="px-2 text-[11px] uppercase tracking-wide text-white/60 mb-2">
              Insights & Reports <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">Coming</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>📘</span>
                <span className="font-medium">Industry Reports</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>📈</span>
                <span className="font-medium">Trends & Forecasts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>🧩</span>
                <span className="font-medium">Tech Explainers</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>🚀</span>
                <span className="font-medium">Startup Spotlights</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>🏆</span>
                <span className="font-medium">Top Vendors This Month</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div className="px-2 text-[11px] uppercase tracking-wide text-white/60 mb-2">
              Alerts <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Coming</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>📬</span>
                <span className="font-medium">New Vendor Alerts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>📈</span>
                <span className="font-medium">Category Alerts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>🛠</span>
                <span className="font-medium">Product Updates</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>💼</span>
                <span className="font-medium">Talent Alerts</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed">
                <span>🤝</span>
                <span className="font-medium">Partnership Alerts</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Main Content with proper padding for sidebar */}
      <div className="lg:pl-[320px] pt-24">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 md:py-20 overflow-hidden">
        {/* Colored glow overlays matching sidebar theme */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-700/20" />
        
        {/* Animated background elements */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/10 blur-3xl rounded-full animate-pulse" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[45rem] h-[45rem] bg-purple-500/10 blur-3xl rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-indigo-500/10 blur-3xl rounded-full" />
        
        {/* Decorative grid pattern */}
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Floating shapes */}
        <div className="pointer-events-none absolute top-20 left-[10%] w-16 h-16 bg-white/10 rounded-2xl rotate-12 animate-bounce" style={{animationDuration: '3s'}} />
        <div className="pointer-events-none absolute bottom-32 right-[15%] w-20 h-20 bg-purple-300/20 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}} />
        <div className="pointer-events-none absolute top-40 right-[20%] w-12 h-12 bg-indigo-300/20 rounded-lg rotate-45 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1s'}} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6 shadow-lg">
              <CheckCircle2 size={16} className="text-emerald-300" />
              <span>Trusted by 10,000+ businesses worldwide</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Discover Emerging Tech<br/>
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">That Transforms Your Business</span>
            </h1>
            
            {/* Subheading */}
            <p className="mt-6 text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
              Connect with <span className="font-bold text-white">1,000+ vetted</span> technology vendors. 
              <br className="hidden md:block" />
              Browse AI, IoT, Blockchain, and emerging solutions tailored to your industry.
            </p>
            
            {/* Feature highlights */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-emerald-300" />
                <span className="font-medium">100% Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-300" />
                <span className="font-medium">Expert Curated</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-rose-300" />
                <span className="font-medium">Free to Explore</span>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="#vendor-grid" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
                <LayoutGrid size={20} />
                Browse Vendors
              </a>
              <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all">
                <Heart size={20} />
                View Saved Vendors
              </a>
              <a href="/saved-firms" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all">
                <Heart size={20} className="fill-white" />
                View Saved Firms
              </a>
            </div>
          </div>
        </div>
      </section>

      

      {debouncedTerm && (
        <section className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-sm text-gray-600">🔥 Trending: 'AI for construction' (+340% this week) • Popular today: 'warehouse robotics'</div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Browse by Solution Type</h2>
          <p className="text-lg text-white/90 font-medium">Organized for easy discovery</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {['Industry','Software','Hardware'].map(tab => (
            <button key={tab} onClick={()=>setSelectedSection(tab)} className={`px-6 py-3 rounded-xl font-bold text-base transition-all shadow-md ${selectedSection===tab?'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105':'bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50'}`}>{tab} {tab==='Industry'?'Solutions':tab==='Software'?'Platforms':'Systems'}</button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories[selectedSection].map((c) => {
            const supported = new Set(['proptech','fintech','contech','medtech','healthtech','supplychain','ai','ml','iot','web3','arvr','digital-twin','semiconductors','robotics','networking','automation-robotics','power-infrastructure','3d-printing','edge-computing','quantum'])
            const href = supported.has(c.key) ? `/discover/${c.key}` : undefined
            const grad = c.key==='proptech' ? 'from-green-500/20 to-blue-500/20' : c.key==='fintech' ? 'from-emerald-500/20 to-cyan-500/20' : c.key==='contech' ? 'from-amber-500/20 to-orange-500/20' : c.key==='medtech' ? 'from-rose-500/20 to-red-500/20' : c.key==='ai' ? 'from-blue-500/20 to-indigo-500/20' : c.key==='ml' ? 'from-emerald-500/20 to-lime-500/20' : c.key==='iot' ? 'from-cyan-500/20 to-sky-500/20' : c.key==='web3' ? 'from-violet-500/20 to-fuchsia-500/20' : c.key==='arvr' ? 'from-purple-500/20 to-pink-500/20' : c.key==='digital-twin' ? 'from-indigo-500/20 to-blue-500/20' : c.key==='semiconductors' ? 'from-emerald-500/20 to-cyan-500/20' : c.key==='robotics' || c.key==='automation-robotics' ? 'from-amber-500/20 to-orange-500/20' : c.key==='networking' ? 'from-cyan-500/20 to-blue-500/20' : c.key==='power-infrastructure' ? 'from-emerald-500/20 to-cyan-500/20' : c.key==='drones' ? 'from-sky-500/20 to-cyan-500/20' : c.key==='3d-printing' ? 'from-fuchsia-500/20 to-pink-500/20' : c.key==='edge-computing' ? 'from-cyan-500/20 to-teal-500/20' : 'from-indigo-500/20 to-purple-500/20'
            const ctaGrad = c.key==='proptech' ? 'from-green-600 to-blue-600' : c.key==='fintech' ? 'from-emerald-600 to-cyan-600' : c.key==='contech' ? 'from-amber-600 to-orange-600' : c.key==='medtech' ? 'from-rose-600 to-red-600' : c.key==='ai' ? 'from-blue-600 to-indigo-600' : c.key==='ml' ? 'from-emerald-600 to-lime-600' : c.key==='iot' ? 'from-cyan-600 to-sky-600' : c.key==='web3' ? 'from-violet-600 to-fuchsia-600' : c.key==='arvr' ? 'from-purple-600 to-pink-600' : c.key==='digital-twin' ? 'from-indigo-600 to-blue-600' : c.key==='semiconductors' ? 'from-emerald-600 to-cyan-600' : c.key==='robotics' || c.key==='automation-robotics' ? 'from-amber-600 to-orange-600' : c.key==='networking' ? 'from-cyan-600 to-blue-600' : c.key==='power-infrastructure' ? 'from-emerald-600 to-cyan-600' : c.key==='drones' ? 'from-sky-600 to-cyan-600' : c.key==='3d-printing' ? 'from-fuchsia-600 to-pink-600' : c.key==='edge-computing' ? 'from-cyan-600 to-teal-600' : 'from-indigo-600 to-purple-600'
            const displayName = ({
              'proptech':'Real Estate Technology Vendors',
              'fintech':'Finance Technology Vendors',
              'contech':'Construction Technology Vendors',
              'medtech':'Medical Device Vendors',
              'healthtech':'Healthcare Technology Vendors',
              'supplychain':'Supply Chain & Manufacturing Tech Vendors',
              'ai':'Artificial Intelligence',
              'ml':'Machine Learning',
              'iot':'Internet of Things',
              'web3':'Blockchain / Web3',
              'arvr':'AR/VR (Augmented & Virtual Reality)',
              'digital-twin':'Digital Twin',
              'edge-computing':'Edge Computing',
              'semiconductors':'Computing & Processing',
              'networking':'Networking & Connectivity Vendors',
              'automation-robotics':'Automation & Robotics',
              'power-infrastructure':'Power & Infrastructure',
              '3d-printing':'3D Printing',
              'quantum':'Quantum Computing'
            }[c.key]) || c.name
            const descMap = ({
              'proptech':'Smart buildings, property ops, and tenant experience platforms powered by IoT sensors and AI analytics. Optimize energy, maintenance, and comfort across portfolios.',
              'fintech':'Digital banking, payments, and risk platforms. AI-driven underwriting, AML/Compliance automation, and developer-first payment APIs.',
              'contech':'Field-to-office construction tech for safety, surveying, project controls, and BIM. Drones, sensors, and analytics to reduce delays and rework.',
              'medtech':'Connected medical devices, imaging, diagnostics, and surgical systems. IoMT, wearables, and compliant data workflows (FDA/CE/ISO).',
              'healthtech':'Care delivery, EHR, telehealth, RPM, and engagement platforms. Improve outcomes and experiences with secure, HIPAA-ready solutions.',
              'supplychain':'Industry 4.0 platforms for smart factories, planning, logistics, and predictive maintenance. Improve throughput and resilience end-to-end.',
              'ai':'NLP, computer vision, and predictive analytics platforms. MLOps tooling to train, deploy, and monitor models at scale.',
              'ml':'AutoML, feature stores, and training pipelines. Accelerate experimentation and model delivery with robust lifecycle tooling.',
              'iot':'Sensors, connectivity, device management, and analytics. Build edge-to-cloud visibility with secure IoT stacks.',
              'web3':'Smart contracts, tokenization, identity, and DeFi infrastructure. Build blockchain applications with enterprise-grade tooling.',
              'arvr':'Spatial computing for training, design reviews, and remote assist. Immersive experiences to improve learning and efficiency.',
              'digital-twin':'Simulation and optimization using live operational data. Plan, test, and predict with virtual replicas of assets and systems.',
              'edge-computing':'Low-latency processing and orchestration at the edge. Run inference and analytics closer to data sources.',
              'semiconductors':'Processors, GPUs, and compute modules. Foundations for AI, graphics, and high-performance workloads.',
              'networking':'5G, LoRaWAN, Wi‑Fi, and industrial connectivity. Secure, scalable networking for devices, sites, and fleets.',
              'automation-robotics':'Industrial and service robotics, cobots, PLCs, and automation platforms to streamline operations and quality.',
              'power-infrastructure':'Power systems, UPS, batteries, and site infrastructure. Ensure reliability, capacity, and efficiency at scale.',
              '3d-printing':'Additive manufacturing for prototyping and production. Materials, printers, and workflow software.',
              'quantum':'Quantum hardware and developer stacks for next-gen compute and research.'
            })
            const previewMap = ({
              'proptech':'Smart building ops • Energy AI • Tenant apps',
              'fintech':'Payments • Lending • Risk & Compliance',
              'contech':'BIM • Drones • Safety & Project Controls',
              'medtech':'Imaging • Diagnostics • Surgical Systems',
              'healthtech':'Telehealth • EHR • Patient Engagement',
              'supplychain':'Smart factory • Logistics • Planning',
              'ai':'NLP • Vision • Predictive Analytics',
              'ml':'AutoML • MLOps • Feature Stores',
              'iot':'Sensors • Connectivity • Analytics',
              'web3':'Smart Contracts • Identity • DeFi',
              'arvr':'Training • Remote Assist • Design',
              'digital-twin':'Simulation • Optimization • Monitoring',
              'edge-computing':'Inference • Orchestration • Low Latency',
              'semiconductors':'CPUs • GPUs • Edge Modules',
              'networking':'5G • LoRaWAN • Wi‑Fi • SD‑WAN',
              'automation-robotics':'Cobots • PLCs • Vision • AMRs',
              'power-infrastructure':'UPS • Batteries • Energy Mgmt',
              '3d-printing':'Materials • Printers • Slicing',
              'quantum':'Qubits • SDKs • Simulators'
            })
            const longDesc = descMap[c.key] || c.desc
            const preview = previewMap[c.key] || c.preview
            const CardInner = (
              <div className="group relative w-full h-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all overflow-hidden flex flex-col min-h-[520px]">
                <div className={`p-6 bg-gradient-to-r ${grad}`}>
                  <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-white grid place-items-center text-3xl border-4 border-white shadow">{c.icon}</div>
                    <div className="text-right">
                      <div className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-slate-900">{displayName}</div>
                    {c.count && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{c.count} vendors</span>}
                  </div>
                  <div className="mt-2 text-[15px] leading-6 text-gray-700">{longDesc}</div>
                  <div className="mt-1 text-sm text-gray-500">{preview}</div>
                  {/* Subcategories (per category key) */}
                  {(() => {
                    const subcatMap = {
                      // Industry
                      'proptech': [
                        'Property & Asset Management',
                        'Building Intelligence & Automation',
                        'Smart Facilities & Infrastructure',
                        'Real Estate Finance & Investment Tech',
                      ],
                      'fintech': [
                        'Digital Payments & Money Transfers',
                        'Lending & Credit Tech',
                        'WealthTech & Investment Platforms',
                        'InsurTech & RegTech',
                      ],
                      'contech': [
                        'Drone Surveying',
                        'BIM & Design',
                        'Site Safety & Monitoring',
                        'Project Management & Controls',
                      ],
                      'medtech': [
                        'Diagnostics & Imaging',
                        'Wearables & IoMT',
                        'Surgical Systems',
                        'Remote Monitoring',
                      ],
                      'healthtech': [
                        'Telemedicine',
                        'EHR & Interoperability',
                        'Patient Engagement',
                        'AI Triage & RPM',
                      ],
                      'supplychain': [
                        'Smart Factory (MES)',
                        'Logistics & WMS',
                        'Predictive Maintenance',
                        'Planning & S&OP',
                      ],
                      // Software
                      'ai': [
                        'NLP',
                        'Computer Vision',
                        'Predictive Analytics',
                        'MLOps Platforms',
                      ],
                      'ml': [
                        'AutoML',
                        'Feature Stores',
                        'Training Pipelines',
                        'Model Serving',
                      ],
                      'iot': [
                        'Device Management',
                        'Connectivity Platforms',
                        'Edge Analytics',
                        'Sensor Networks',
                      ],
                      'web3': [
                        'Smart Contracts',
                        'DeFi Infrastructure',
                        'Identity & Wallets',
                        'Tokenization / NFT',
                      ],
                      'arvr': [
                        'Training & Simulation',
                        'Remote Assist',
                        'Spatial Design / Review',
                        'XR Collaboration',
                      ],
                      'digital-twin': [
                        'Simulation Engines',
                        'Asset Twins',
                        'Process Twins',
                        'Monitoring & Alerts',
                      ],
                      'edge-computing': [
                        'Inference at Edge',
                        'Orchestration',
                        'Low-Latency Networking',
                        'Data Filtering',
                      ],
                      // Hardware
                      'semiconductors': [
                        'CPUs & Microcontrollers',
                        'GPUs & Accelerators',
                        'Edge Compute Modules',
                        'Dev Kits',
                      ],
                      'networking': [
                        '5G Private Networks',
                        'LoRaWAN Gateways',
                        'Wi‑Fi & SD‑WAN',
                        'Industrial Ethernet',
                      ],
                      'automation-robotics': [
                        'Cobots & AMRs',
                        'PLCs & Control',
                        'Machine Vision',
                        'Safety & QA',
                      ],
                      'power-infrastructure': [
                        'UPS & Backup',
                        'Battery Systems',
                        'Power Distribution',
                        'Energy Management',
                      ],
                      '3d-printing': [
                        'Materials',
                        'Industrial Printers',
                        'Slicing & Workflow',
                        'Post-Processing',
                      ],
                      'quantum': [
                        'Hardware Platforms',
                        'SDKs & Simulators',
                        'Quantum Cloud',
                        'Research Tools',
                      ],
                    }
                    const subcats = subcatMap[c.key] || []
                    if (!subcats.length) return null
                    return (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Subcategories</div>
                        <div className="mb-2 h-px bg-gray-200" />
                        <div className="flex flex-wrap gap-2">
                          {subcats.map(s => (
                            <span key={s} className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:border-blue-300">{s}</span>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                  <div className="mt-auto pt-4">
                    <div className={`w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold bg-gradient-to-r ${ctaGrad}`}>
                      Explore vendors
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )
            return href ? (
              <a key={c.key} href={href} className="block h-full">{CardInner}</a>
            ) : (
              <button key={c.key} onClick={()=>{ setSelectedCategory(c.key); document.getElementById('vendor-grid')?.scrollIntoView({behavior:'smooth'}) }} className="text-left">
                {CardInner}
              </button>
            )
          })}
        </div>

        
        {/* AI Agents Section */}
        {false && (<section className="max-w-7xl mx-auto px-6 pt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Connect with an Agent</h2>
            <p className="text-gray-600">Discover, vet, hire, get insights, and model ROI — guided by specialized AI agents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Astra */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">🧭</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Astra</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Discovery Navigator</span>
                </div>
                <div className="text-sm text-gray-700 italic mt-1">“Tell me what kind of tech you’re exploring — I’ll find the best vendors and case studies for you.”</div>
                <p className="text-sm text-gray-600 mt-2">Find relevant vendors and reports instantly. Personalized, fast, and intuitive.</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>{ setSelectedCategory('ai'); document.getElementById('vendor-grid')?.scrollIntoView({behavior:'smooth'}) }} className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold inline-flex items-center gap-2"><TargetIcon size={16}/> Try Astra</button>
                  <a href="#vendor-grid" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">Explore vendors</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.astra.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-blue-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['AI for construction safety','IoT for site monitoring','Compare top 3 vendors'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('astra', p)} className="px-2 py-1 rounded-full border text-xs hover:border-blue-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.astra.input} onChange={(e)=> setAgentInput('astra', e.target.value)} placeholder="Ask Astra..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('astra')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Vera */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">🔍</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Vera</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Vendor Vetting Analyst</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Generates trust scores, comparisons, and highlights funding maturity and enterprise readiness.</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>{ setModalType('vet'); setSelectedVendor(selectedVendor||{}); setShowModal(true) }} className="h-10 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold inline-flex items-center gap-2"><Shield size={16}/> Try Vera</button>
                  <a href="#vendor-grid" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">Compare vendors</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.vera.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-emerald-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Analyze Vendor A','Compare A vs B','Show trust score factors'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('vera', p)} className="px-2 py-1 rounded-full border text-xs hover:border-emerald-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.vera.input} onChange={(e)=> setAgentInput('vera', e.target.value)} placeholder="Ask Vera..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('vera')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Leo */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-purple-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">🧑‍💻</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Leo</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Developer Matchmaker</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Match with pre-vetted developers or firms based on scope, stack, and timeline.</p>
                <div className="mt-4 flex gap-2">
                  <a href="/hire" className="h-10 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold inline-flex items-center gap-2"><Briefcase size={16}/> Try Leo</a>
                  <a href="/hire" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">See teams</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.leo.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-purple-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['We need React + Node','Budget ~ $50k','Start in 2 weeks'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('leo', p)} className="px-2 py-1 rounded-full border text-xs hover:border-purple-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.leo.input} onChange={(e)=> setAgentInput('leo', e.target.value)} placeholder="Ask Leo..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('leo')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Nia */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-cyan-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-cyan-500/20 to-sky-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">📊</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Nia</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">Insight Curator</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Curates trends, reports, and case studies based on your interests and behavior.</p>
                <div className="mt-4 flex gap-2">
                  <a href="/insights" className="h-10 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-semibold inline-flex items-center gap-2"><BarChart3 size={16}/> Try Nia</a>
                  <a href="/insights" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">Explore insights</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.nia.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-cyan-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['AI in healthcare','IoT startups this week','Download 2025 report'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('nia', p)} className="px-2 py-1 rounded-full border text-xs hover:border-cyan-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.nia.input} onChange={(e)=> setAgentInput('nia', e.target.value)} placeholder="Ask Nia..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('nia')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Atlas */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">🧮</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Atlas</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">ROI & Strategy Advisor</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Model ROI and adoption impact with data from real deployments.</p>
                <div className="mt-4 flex gap-2">
                  <a href="/insights" className="h-10 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold inline-flex items-center gap-2"><Calculator size={16}/> Try Atlas</a>
                  <a href="#vendor-grid" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">See similar outcomes</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.atlas.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-amber-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['ROI for AR/VR training','Assumptions used','Show similar deployments'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('atlas', p)} className="px-2 py-1 rounded-full border text-xs hover:border-amber-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.atlas.input} onChange={(e)=> setAgentInput('atlas', e.target.value)} placeholder="Ask Atlas..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('atlas')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Eve */}
            <div className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-rose-500 transition-all overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-rose-500/20 to-red-500/20">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white grid place-items-center text-2xl border-4 border-white shadow">✨</div>
                  <div className="text-right"><span className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">EmergingTech Verified</span></div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-slate-900">Eve</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Experience Concierge</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">“Are you here to explore vendors, find talent, or analyze ROI?” Start with quick actions.</p>
                <div className="mt-4 flex gap-2">
                  <a href="#vendor-grid" className="h-10 px-4 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold inline-flex items-center gap-2"><Star size={16}/> Try Eve</a>
                  <a href="/discover" className="h-10 px-4 rounded-lg border text-gray-700 inline-flex items-center">Find your path</a>
                </div>
                <div className="mt-4 rounded-xl border bg-gray-50 p-3 h-56 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {agentChats.eve.messages.map((m,i)=> (
                      <div key={i} className={`${m.from==='user'?'ml-8 bg-rose-600 text-white':'mr-8 bg-white text-gray-800 border'} rounded-lg px-3 py-2 text-sm w-fit max-w-[85%]`}>{m.text}</div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Find vendors','Hire developers','Get insights','Analyze ROI'].map(p => (
                      <button key={p} onClick={()=> sendAgentMessage('eve', p)} className="px-2 py-1 rounded-full border text-xs hover:border-rose-300">{p}</button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={agentChats.eve.input} onChange={(e)=> setAgentInput('eve', e.target.value)} placeholder="Ask Eve..." className="flex-1 h-10 rounded-lg border px-3 bg-white" />
                    <button onClick={()=> sendAgentMessage('eve')} className="h-10 px-4 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>)}
        {/* Featured Vendors (dummy) */}
        {false && (<section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Featured Vendors</h3>
            <a href="#vendor-grid" className="text-blue-600 font-semibold">Browse all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* FinTech */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <button
                title={saved.has('feat-payflow')? 'Unsave' : 'Save'}
                onClick={()=> toggleSaveVendor('feat-payflow')}
                className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white border border-gray-200 hover:border-blue-300">
                <Heart size={16} className={saved.has('feat-payflow')? 'text-red-500' : 'text-gray-400'} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white grid place-items-center text-2xl">💰</div>
                <div>
                  <div className="font-semibold text-slate-900">PayFlow</div>
                  <div className="text-xs text-gray-600">FinTech • Real-time payments</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">Instant payouts API with fraud controls and treasury dashboards.</div>
              <a href="/discover/fintech" className="mt-3 inline-block text-sm text-blue-600 font-semibold">Explore FinTech →</a>
            </div>
            {/* PropTech */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <button
                title={saved.has('feat-buildsense')? 'Unsave' : 'Save'}
                onClick={()=> toggleSaveVendor('feat-buildsense')}
                className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white border border-gray-200 hover:border-blue-300">
                <Heart size={16} className={saved.has('feat-buildsense')? 'text-red-500' : 'text-gray-400'} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white grid place-items-center text-2xl">🏢</div>
                <div>
                  <div className="font-semibold text-slate-900">BuildSense</div>
                  <div className="text-xs text-gray-600">PropTech • Smart buildings</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">AI energy optimization and occupancy analytics for CRE.</div>
              <a href="/discover/proptech" className="mt-3 inline-block text-sm text-blue-600 font-semibold">Explore PropTech →</a>
            </div>
            {/* ConTech */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <button
                title={saved.has('feat-sitevision')? 'Unsave' : 'Save'}
                onClick={()=> toggleSaveVendor('feat-sitevision')}
                className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white border border-gray-200 hover:border-blue-300">
                <Heart size={16} className={saved.has('feat-sitevision')? 'text-red-500' : 'text-gray-400'} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white grid place-items-center text-2xl">🏗️</div>
                <div>
                  <div className="font-semibold text-slate-900">SiteVision</div>
                  <div className="text-xs text-gray-600">ConTech • Drone progress</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">Aerial mapping, volumetrics, and progress tracking.</div>
              <a href="/discover/contech" className="mt-3 inline-block text-sm text-blue-600 font-semibold">Explore ConTech →</a>
            </div>
            {/* HealthTech */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <button
                title={saved.has('feat-carepulse')? 'Unsave' : 'Save'}
                onClick={()=> toggleSaveVendor('feat-carepulse')}
                className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white border border-gray-200 hover:border-blue-300">
                <Heart size={16} className={saved.has('feat-carepulse')? 'text-red-500' : 'text-gray-400'} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white grid place-items-center text-2xl">💊</div>
                <div>
                  <div className="font-semibold text-slate-900">CarePulse</div>
                  <div className="text-xs text-gray-600">HealthTech • Remote monitoring</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">Patient vitals, alerts, and analytics for hospitals and clinics.</div>
              <a href="/discover/healthtech" className="mt-3 inline-block text-sm text-blue-600 font-semibold">Explore HealthTech →</a>
            </div>
          </div>
        </section>)}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-6" id="vendor-grid">
        

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({length:6}).map((_,i)=> <SkeletonCard key={i} />)}
          </div>
        ) : filteredVendors.length === 0 ? (
          null
        ) : (
          <div className={`${view==='grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}`}>
            {(filteredVendors.slice(0, 12)).map((v) => (
              view==='grid' ? (
                <FeaturedCard
                  key={v.id}
                  v={v}
                  expanded={expandedCard===v.id}
                  onToggleExpand={()=> setExpandedCard(prev=> prev===v.id ? null : v.id)}
                  saved={saved.has(v.id)}
                  onToggleSave={()=> toggleSaveVendor(v.id)}
                  inComparison={comparisonList.includes(v.id)}
                  onToggleCompare={()=> setComparisonList(prev=> prev.includes(v.id)? prev.filter(id=>id!==v.id) : (prev.length<3?[...prev, v.id]:prev))}
                  onOpenModal={(type)=> openModal(type, v)}
                />
              ) : (
                <ListCard key={v.id} v={v} />
              )
            ))}
          </div>
        )}

        {comparisonList.length>0 && (
          <CompareBar vendors={filteredVendors.filter(v=> comparisonList.includes(v.id)).slice(0,3)} onClear={()=> setComparisonList([])} />
        )}
      </section>

      <FilterPanel
        open={filterPanelOpen}
        onClose={()=> setFilterPanelOpen(false)}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onSave={(name, emailNotify)=> setSavedSearches(prev=> [...prev, { name, filters: activeFilters, ts: Date.now(), notify: emailNotify }])}
      />

      {showModal && selectedVendor && (
          <ModalBase onClose={()=>{ setShowModal(false); setModalType(''); setSelectedVendor(null); setFormData({}); setSubmitSuccess(false); setIsSubmitting(false); }}>
            {modalType==='demo' && (
              <RequestDemoModal
                vendor={selectedVendor}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                submitSuccess={submitSuccess}
                setSubmitSuccess={setSubmitSuccess}
                onDone={()=> setTimeout(()=>{ setShowModal(false); }, 1500)}
              />
            )}
            {modalType==='quote' && (
              <RequestQuoteModal
                vendor={selectedVendor}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                submitSuccess={submitSuccess}
                setSubmitSuccess={setSubmitSuccess}
                onDone={()=> setTimeout(()=>{ setShowModal(false); }, 1500)}
              />
            )}
            {modalType==='vet' && (
              <VetVendorModal
                vendor={selectedVendor}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                submitSuccess={submitSuccess}
                setSubmitSuccess={setSubmitSuccess}
                onDone={()=> setTimeout(()=>{ setShowModal(false); }, 1500)}
              />
            )}
            {modalType==='contact' && (
              <ContactVendorModal
                vendor={selectedVendor}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                submitSuccess={submitSuccess}
                setSubmitSuccess={setSubmitSuccess}
                onDone={()=> setTimeout(()=>{ setShowModal(false); }, 1500)}
              />
            )}
          </ModalBase>
        )}

      {false && (<section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Featured This Month ⭐</h3>
          <a href="#" className="text-blue-600 font-semibold">See all</a>
        </div>
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 min-w-max">
            {featuredVendors.map(v => (
              <CompactCard key={v.id} v={v} />
            ))}
          </div>
        </div>
      </section>)}

      {/* Footer inside content area */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/70 text-sm">©2025 Edge Marketplace</div>
            <nav className="flex items-center gap-3 text-sm text-white/70">
              <a href="/about" className="hover:text-white">About Us</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <span>•</span>
              <a href="/cookies" className="hover:text-white">Cookie Policy</a>
            </nav>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}

// Helper components below

function SearchSuggestions({ term, vendors, onPick }) {
  const t = (term || '').toLowerCase()
  if (!t || t.length < 2) return null
  const names = vendors.map(v => v.name)
  const pool = [
    ...names,
    ...vendors.flatMap(v => [v.category, v.subcategory, ...(v.tags||[]), ...(v.industries||[])]),
  ].filter(Boolean)
  const unique = Array.from(new Set(pool))
  const contains = unique.filter(x => (x||'').toLowerCase().includes(t)).slice(0, 5)
  // did you mean = closest name by edit distance
  let didYouMean = null
  let best = Infinity
  for (const n of names) {
    const d = Math.min(best, (function ed(a,b){
      const A=a.toLowerCase(), B=b.toLowerCase()
      const dp = Array(B.length+1).fill(null).map(()=>Array(A.length+1).fill(0))
      for(let i=0;i<=A.length;i++) dp[0][i]=i
      for(let j=0;j<=B.length;j++) dp[j][0]=j
      for(let j=1;j<=B.length;j++){
        for(let i=1;i<=A.length;i++){
          const cost = A[i-1]===B[j-1]?0:1
          dp[j][i] = Math.min(dp[j-1][i]+1, dp[j][i-1]+1, dp[j-1][i-1]+cost)
        }
      }
      return dp[B.length][A.length]
    })(n, t))
    if (d < best) { best = d; didYouMean = n }
  }
  const related = unique.filter(x => x && x !== didYouMean).slice(0, 3)

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
      {contains.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Suggestions</div>
          <div className="flex flex-wrap gap-2">
            {contains.map(s => (
              <button key={s} onClick={()=> onPick(s)} className="px-2 py-1 rounded-lg border border-gray-200 text-sm hover:border-blue-300">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {didYouMean && best>2 && (
        <div className="mb-2 text-sm text-gray-700">Did you mean <button className="text-blue-600 font-semibold" onClick={()=> onPick(didYouMean)}>{didYouMean}</button>?</div>
      )}
      <div className="text-xs text-gray-500">Trending searches: <button onClick={()=> onPick('AI for construction')} className="underline">AI for construction</button>, <button onClick={()=> onPick('warehouse robotics')} className="underline">warehouse robotics</button></div>
    </div>
  )
}

function FilterPanel({ open, onClose, activeFilters, setActiveFilters, onSave }) {
  if (!open) return null
  const updateBudget = (idx, val) => {
    setActiveFilters(prev => ({ ...prev, budget: prev.budget.map((v,i)=> i===idx? Number(val||0) : v) }))
  }
  const toggleBool = (key) => setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }))
  const setRating = (val) => setActiveFilters(prev => ({ ...prev, rating: Number(val) }))
  const toggleArray = (key, value) => setActiveFilters(prev => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter(x=>x!==value) : [...prev[key], value] }))

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-slate-900">Filters</div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg hover:bg-gray-100">Close</button>
        </div>

        <div className="space-y-6">
          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Smart Filters</div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">Best Match for Your Industry: <span className="font-semibold">ConTech solutions recommended for you</span></div>
            <div className="mt-2 p-3 rounded-lg bg-purple-50 text-purple-800 text-sm">Similar to what you saved: <span className="font-semibold">PropTech + IoT vendors</span></div>
            <div className="mt-2 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm">Popular with companies like yours: <span className="font-semibold">Teams of 50-200 often choose...</span></div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Solution Requirements</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Cost reduction','Process automation','Data analytics','Customer experience','Compliance/Security','Sustainability'].map(opt => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" onChange={()=> toggleArray('industries', opt)} checked={activeFilters.industries.includes(opt)} /> {opt}
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Budget & Pricing</div>
            <div className="flex items-center gap-2">
              <input type="number" value={activeFilters.budget[0]} onChange={e=> updateBudget(0, e.target.value)} className="w-28 border rounded px-2 py-1" />
              <span>to</span>
              <input type="number" value={activeFilters.budget[1]} onChange={e=> updateBudget(1, e.target.value)} className="w-28 border rounded px-2 py-1" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {[
                ['freeTrial','Free trial available'],
                ['freemium','Freemium model'],
                ['guarantee','Money-back guarantee'],
                ['flexPay','Flexible payment terms'],
              ].map(([k,label])=> (
                <label key={k} className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" onChange={()=> toggleBool(k)} checked={!!activeFilters[k]} /> {label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Trust & Verification</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['verified','EmergingTech Verified'],
                ['featured','Featured only'],
                ['iso','ISO/SOC 2'],
                ['gdpr','GDPR compliant'],
                ['rating','4+ stars'],
                ['case','Case studies available'],
              ].map(([k,label])=> (
                <label key={k} className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" onChange={()=> k==='rating'? setRating(4.0) : toggleBool(k)} checked={k==='rating'? activeFilters.rating>=4.0 : !!activeFilters[k]} /> {label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Integration Ecosystem</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Salesforce','Microsoft 365','Google Workspace','AWS','Slack','HubSpot'].map(integ => (
                <label key={integ} className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" onChange={()=> toggleArray('integrations', integ)} checked={activeFilters.integrations.includes(integ)} /> {integ}
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 mb-2">Vendor Performance</div>
            <div className="text-sm">Satisfaction Score ≥
              <input type="number" min={0} max={5} step={0.1} value={activeFilters.rating} onChange={e=> setRating(e.target.value)} className="ml-2 w-20 border rounded px-2 py-1" />
            </div>
          </section>

          <div className="sticky bottom-0 bg-white border-t pt-3">
            <div className="text-sm text-gray-600 mb-2">{`Results preview updates automatically`}</div>
            <div className="flex items-center justify-between gap-2">
              <button onClick={()=> { setActiveFilters({ verified:false, featured:false, budget:[0,500000], companyStage:[], industries:[], integrations:[], deployment:[], rating:0 }) }} className="px-3 py-2 rounded-lg border border-gray-200">Reset All</button>
              <button onClick={()=> { const name = window.prompt('Name this search','e.g., PropTech under $50K with API'); if (name) onSave(name, true); }} className="px-3 py-2 rounded-lg border border-blue-200 text-blue-700">Save Search</button>
              <button onClick={onClose} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Apply Filters</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

function ListCard({ v }) {
  const ctaText = v.primaryCTA?.text || 'Details'
  return (
    <article className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow" style={{ background: v.brandColor }}>
          <span>{v.logoEmoji}</span>
        </div>
        <div>
          <div className="font-semibold text-slate-900">{v.name}</div>
          <div className="text-xs text-gray-500">{v.category} • {v.subcategory}</div>
        </div>
      </div>
      <a href={v.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 font-semibold text-sm">{ctaText}</a>
    </article>
  )
}

function CompactCard({ v }) {
  return (
    <article className="min-w-[280px] bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: v.brandColor }}>
          <span>{v.logoEmoji}</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{v.name}</div>
          <div className="text-xs text-gray-500 truncate">{v.tagline}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        <span className="font-semibold text-slate-900">{v.results?.metric1 || 'High ROI'}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <a href="#" className="text-blue-600 font-semibold inline-flex items-center gap-1">Quick View <ArrowRight size={14} /></a>
        {v.isVerified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">Verified</span>}
      </div>
    </article>
  )
}

function FeaturedCard({ v, expanded, onToggleExpand, saved, onToggleSave, inComparison, onToggleCompare, onOpenModal }) {
  const ctaText = v.primaryCTA?.text || 'See Live Demo'
  const urgency = v.primaryCTA?.urgency
  const metrics = [v.results?.metric1 || '40% Savings', v.results?.metric2 || '10x Increase', v.results?.metric3 || '99.9% SLA']
  const industries = (v.industries || []).slice(0, 3)
  const industriesMore = Math.max(0, (v.industries || []).length - industries.length)
  const priceLabel = typeof v.startingPrice === 'string' ? v.startingPrice : (typeof v.startingPrice === 'number' ? `$${v.startingPrice.toLocaleString()}/mo` : 'Contact for pricing')
  const integrationsCount = Array.isArray(v.integrations) ? v.integrations.length : (v.integrations || 0)
  const supportLabel = v.metrics?.avgResponseTime ? `${v.metrics.avgResponseTime} response` : '< 2 hours response'
  const createdAt = v.lastUpdated || v.createdAt
  const daysAgo = createdAt ? Math.max(1, Math.round((Date.now() - new Date(createdAt)) / (1000*60*60*24))) : 2

  const PrimaryIcon = /trial/i.test(ctaText) ? Gift : /demo/i.test(ctaText) ? Play : /quote|price/i.test(ctaText) ? Calculator : ArrowRight
  const SecondaryIcon = /download|case/i.test(v.secondaryCTA?.text||'') ? Download : /video|watch/i.test(v.secondaryCTA?.text||'') ? Play : Eye

  const hasFreeTrial = /free/i.test(v.pricingModel || '') || /trial/i.test(ctaText)

  return (
    <article
      className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${inComparison? 'border-blue-400' : 'border-gray-100'} overflow-hidden min-h-[520px] hover:-translate-y-2`}
    >
      {/* Save */}
      <button
        title={saved ? 'Saved' : 'Save for later'}
        aria-label="Save vendor"
        onClick={onToggleSave}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center bg-white/90 border ${saved? 'border-red-200' : 'border-gray-200'} shadow-sm hover:scale-110 transition`}
      >
        <Heart size={18} className={saved? 'text-red-500' : 'text-gray-600'} />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        {v.isVerified && (
          <span title="Vetted by our team" className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
            <CheckCircle2 size={12} /> Verified
          </span>
        )}
        {v.isFeatured && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">⭐ Featured</span>
        )}
        {hasFreeTrial && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">🎁 Free Trial</span>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 pt-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-200/40 to-purple-200/40 blur-md" />
          <div className="relative w-16 h-16 rounded-xl grid place-items-center text-3xl shadow" style={{ background: v.brandColor }}>
            <span className="select-none">{v.logoEmoji}</span>
          </div>
        </div>
        <div className="min-w-0">
          <a href={v.websiteUrl} target="_blank" rel="noreferrer" className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${v.brandColor || '#1d4ed8'}, #6d28d9)` }}>
            {v.name}
          </a>
          <div className="text-sm text-gray-500">{v.category} • {v.subcategory}</div>
          <div className="mt-1 italic text-gray-700 line-clamp-2">{v.tagline}</div>
        </div>
      </div>

      {/* Category & tags */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">{v.category}</span>
        {v.sector && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700" title="Sector specialization">{v.sector}</span>
        )}
        {industries.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{t}</span>
        ))}
        {industriesMore>0 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">+{industriesMore} more</span>}
      </div>

      {/* Description */}
      <div className="mt-3 text-sm text-gray-600">
        <p className={`${expanded? '' : 'line-clamp-3'}`}>{expanded ? (v.fullDescription || v.shortDescription || v.tagline) : (v.shortDescription || v.tagline)}</p>
        {Array.isArray(v.industries) && v.industries.length>0 && (
          <div className="mt-2 text-xs text-gray-700"><span className="font-semibold">Industries solved:</span> {v.industries.join(', ')}</div>
        )}
        {(v.fullDescription || v.shortDescription) && (
          <button onClick={onToggleExpand} className="mt-1 text-blue-600 text-sm font-semibold">
            {expanded ? 'Show less ↑' : 'Read full description ↓'}
          </button>
        )}
      </div>

      {/* Key results */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{m}</div>
            <div className="text-[11px] text-gray-500">{i===0?'Cost Savings':i===1?'Speed Increase':'Uptime SLA'}</div>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span>Trusted by {v.customers?.totalCount || 500}+ companies</span>
          <span className="inline-flex items-center gap-1 text-yellow-600"><Star size={14}/> {v.metrics?.satisfactionScore?.toFixed?.(1) || v.metrics?.satisfactionScore || 4.8}/5 <span className="text-gray-500">({v.metrics?.demoRequests || 47} reviews)</span></span>
        </div>
        {v.customers?.testimonial && (
          <div className="text-sm text-gray-600 line-clamp-1" title={v.customers?.testimonial}>
            <span className="inline-flex items-center gap-1 text-gray-700"><Quote size={14}/> "{v.customers.testimonial}"</span>
            {v.customers?.testimonialAuthor && <span className="ml-2 text-xs text-gray-500">— {v.customers.testimonialAuthor}</span>}
          </div>
        )}
      </div>

      {/* Quick info */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-[12px] text-gray-700">
        <div title={`Pricing from ${priceLabel}`} className="flex items-center gap-1"><span>💰</span><span>From {priceLabel}</span></div>
        <div title="Implementation time" className="flex items-center gap-1"><span>⚡</span><span>{v.implementationTime || '< 2 weeks'}</span></div>
        <div title="Integrations" className="flex items-center gap-1"><span>🔗</span><span>{integrationsCount}+</span></div>
        <div title="Support response" className="flex items-center gap-1"><span>💬</span><span>{supportLabel}</span></div>
      </div>

      {/* Action zone */}
      <div className="absolute left-0 right-0 bottom-0 p-6 pt-4 bg-gradient-to-t from-white via-white to-white/70">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="accent-blue-600" checked={!!inComparison} onChange={onToggleCompare} />
            <span>Add to compare</span>
          </label>
          <div className="text-xs text-gray-500">Updated {daysAgo} days ago</div>
        </div>

        <button onClick={()=> onOpenModal((/quote|price/i.test(ctaText)? 'quote' : /demo|trial/i.test(ctaText)? 'demo' : 'contact'))} className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.01] transition">
          <PrimaryIcon size={18} /> {ctaText}
        </button>
        {urgency && (
          <div className="mt-2 text-[12px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 inline-block animate-pulse">{urgency}</div>
        )}

        {v.secondaryCTA?.text && (
          <button onClick={()=> onOpenModal(/case|video|watch/i.test(v.secondaryCTA.text)? 'contact' : 'demo')} className="mt-3 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold bg-white hover:bg-blue-50">
            <SecondaryIcon size={16} /> {v.secondaryCTA.text}
          </button>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <button onClick={()=> onOpenModal('vet')} className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700"><Shield size={14}/> Vet this vendor</button>
            <a href="#" className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700"><Eye size={14}/> View full profile →</a>
          </div>
          <div className="flex items-center gap-3">
            <span title="Monthly views">👁️ {v.metrics?.viewCount?.toLocaleString?.() || v.metrics?.viewCount} views</span>
            <span title="Demos requested">📊 {v.metrics?.demoRequests} demos</span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(1000px 300px at top right, rgba(59,130,246,0.10), transparent 60%)' }} />
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[480px] animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
      <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-64 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-14 bg-gray-100 rounded" />
        <div className="h-14 bg-gray-100 rounded" />
        <div className="h-14 bg-gray-100 rounded" />
      </div>
      <div className="absolute left-6 right-6 bottom-6">
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="mt-2 h-4 w-40 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

function CompareBar({ vendors, onClear }) {
  return (
    <div className="fixed left-0 right-0 bottom-4 z-40">
      <div className="mx-auto max-w-[1200px] bg-white border border-blue-200 shadow-2xl rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-slate-900">Compare {vendors.length} vendor{vendors.length>1?'s':''}</div>
          <button onClick={onClear} className="text-sm text-gray-600 underline">Clear</button>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto">
          {vendors.map(v => (
            <div key={v.id} className="min-w-[200px] flex items-center gap-2 border border-gray-200 rounded-xl p-2">
              <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: v.brandColor }}>
                <span className="text-base">{v.logoEmoji}</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{v.name}</div>
                <div className="text-xs text-gray-500 truncate">{v.category}</div>
              </div>
            </div>
          ))}
          <a href="#" className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Compare {vendors.length} vendors</a>
        </div>
      </div>
    </div>
  )
}
