'use client'


import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronRight, Loader2, ShieldCheck, BarChart3, Zap, ArrowUp, ArrowDown, Plus, X, Search } from 'lucide-react'

function Field({ label, required, children, hint }){
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#0F172A]">{label}{required && <span className="text-red-500">*</span>}</label>
        {hint && <span className="text-xs text-[#94A3B8]">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export default function CompareVendors(){
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const [context, setContext] = useState({
    company:'', industry:'', size:'', project:'', goal:'', budget:'', timeline:'', extra:''
  })
  const [vendors, setVendors] = useState(['','',''])
  const [vendorQuery, setVendorQuery] = useState('')
  const [priorities, setPriorities] = useState([
    { key:'cost', label:'Cost Efficiency' },
    { key:'performance', label:'Performance & Reliability' },
    { key:'security', label:'Security & Compliance' },
    { key:'integration', label:'Integration Flexibility' },
    { key:'support', label:'Customer Support' },
    { key:'innovation', label:'Innovation & Future Roadmap' },
    { key:'scale', label:'Scalability' },
    { key:'ux', label:'Ease of Use & Adoption' },
  ])

  const canNext1 = context.company && context.industry && context.project && context.goal && context.timeline
  const canNext2 = vendors.filter(v=> v.trim()).length >= 1

  const movePriority = useCallback((i, dir) => {
    setPriorities(prev => {
      const arr = [...prev]
      const j = dir==='up' ? i-1 : i+1
      if (j<0 || j>=arr.length) return prev
      const t = arr[i]; arr[i]=arr[j]; arr[j]=t
      return arr
    })
  }, [])

  const submit = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'Vendor Comparison Request',
          email: email,
          context: context,
          vendors: vendors.filter(v => v.trim()),
          priorities: priorities.map((p, i) => ({ rank: i + 1, ...p })),
          submittedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        setLoading(false)
        setSubmitted(true)
      } else {
        setLoading(false)
        alert('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setLoading(false)
      alert('There was an error. Please try again.')
    }
  }

  const Stepper = () => (
    <div className="max-w-[800px] mx-auto mb-8">
      <div className="flex items-center justify-center gap-6">
        {[1,2,3].map(n => (
          <div key={n} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full grid place-items-center text-white font-semibold ${step===n? 'bg-gradient-to-r from-[#7C3AED] to-[#2563EB]' : step>n? 'bg-teal-500' : 'bg-gray-300'}`}>
              {step>n ? <CheckCircle2 size={18} className="text-white"/> : n}
            </div>
            {n<3 && <div className={`w-20 h-1 rounded ${step>n? 'bg-teal-400' : 'bg-gray-300'}`}></div>}
          </div>
        ))}
      </div>
      <div className="mt-3 text-center text-sm text-[#475569]">① Your Context → ② Vendor Selection → ③ Priorities</div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A]">
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 text-teal-600 mb-4">
            <CheckCircle2 size={42}/>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold">Analysis Request Submitted!</h2>
          <p className="mt-3 text-lg text-[#475569]">Your personalized vendor comparison is on its way. Expect delivery in 3-5 business days.</p>
        </div>
      </section>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A]">
      <Hero onStart={()=> document.getElementById('form-start')?.scrollIntoView({ behavior:'smooth' })} />

      <ValueProps />

      <section id="form-start" className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <Stepper />
          <div className="bg-white rounded-2xl shadow border border-[#E2E8F0] p-8">
            {step===1 && (
              <Step1 context={context} setContext={setContext} email={email} setEmail={setEmail} />
            )}
            {step===2 && (
              <Step2 vendors={vendors} setVendors={setVendors} vendorQuery={vendorQuery} setVendorQuery={setVendorQuery} />)
            }
            {step===3 && (
              <Step3 priorities={priorities} movePriority={movePriority} />
            )}

            <div className="mt-8 flex items-center justify-between">
              <button disabled={step===1} onClick={()=> setStep(s=> Math.max(1, s-1))} className={`h-11 px-5 rounded-lg border ${step===1? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>Back</button>
              {step<3 ? (
                <button disabled={(step===1 && !canNext1) || (step===2 && !canNext2)} onClick={()=> setStep(s=> Math.min(3, s+1))} className={`h-11 px-6 rounded-lg text-white ${((step===1 && !canNext1) || (step===2 && !canNext2))? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:opacity-95'}`}>Save & Continue</button>
              ) : (
                <button onClick={submit} className="h-11 px-6 rounded-lg text-white bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:opacity-95">Submit for Analysis</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <PoweredBy />

      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Loader2 size={28} className="mx-auto animate-spin text-[#2563EB]"/>
            <div className="mt-3 font-semibold">Submitting Your Analysis Request…</div>
            <div className="text-sm text-[#475569]">Our experts are reviewing your needs</div>
          </div>
        </div>
      )}
    </div>
  )
}

const Hero = React.memo(function Hero({ onStart }){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.35),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.35),transparent_40%)]" />
      <div className="relative py-24 md:py-28 text-white bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#312E81]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">In‑depth Tech Evaluations<br/>Tailored to Your Use Case</h1>
          <p className="mt-5 max-w-3xl mx-auto text-white/90 text-lg">Taloflow replicates real‑life top analyst guidance while providing the detail of an army of researchers diligently curating and entering data.</p>
          <div className="mt-10 flex items-center justify-center">
            <button onClick={onStart} className="h-14 px-8 rounded-xl bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#2563EB] font-semibold shadow hover:shadow-lg">Start Your Evaluation <ChevronRight className="inline ml-1" size={18}/></button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/90">
            <span>✓ Unbiased comparisons</span>
            <span>✓ Custom scoring</span>
            <span>✓ Free</span>
          </div>
        </div>
      </div>
    </section>
  )
})



function ValueProps(){
  const items = [
    { icon: ShieldCheck, title:'Data‑Driven Insights', desc:'Expert analysis from Taloflow’s team with real‑world performance data.', style:'bg-teal-50 border-teal-200' },
    { icon: BarChart3, title:'Customized to You', desc:'Scores tailored to your use case, priorities, and constraints.', style:'bg-amber-50 border-amber-200' },
    { icon: Zap, title:'Fast & Actionable', desc:'Receive your report in 3–5 business days with clear recommendations.', style:'bg-indigo-50 border-indigo-200' },
  ]
  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">Why Use Our Vendor Analysis Platform?</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map(({icon:Icon,title,desc,style})=> (
            <div key={title} className={`rounded-2xl p-10 border hover:shadow transition ${style}`}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white grid place-items-center mb-4"><Icon size={28}/></div>
              <div className="text-xl font-semibold">{title}</div>
              <div className="mt-1 text-[15px] text-[#475569]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Step1({ context, setContext, email, setEmail }){
  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Tell Us About Your Project</div>
      <div className="text-sm text-[#475569] mb-6">Help us understand your needs so we can deliver the most relevant analysis.</div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Company Name" required><input className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-200 outline-none" value={context.company} onChange={e=> setContext(c=>({...c, company:e.target.value}))} /></Field>
        <Field label="Industry / Sector" required><input className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-200 outline-none" value={context.industry} onChange={e=> setContext(c=>({...c, industry:e.target.value}))} /></Field>
        <Field label="Company Size"><select className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#7C3AED]" value={context.size} onChange={e=> setContext(c=>({...c, size:e.target.value}))}><option value="">Select</option><option>1-50</option><option>51-200</option><option>201-500</option><option>501-1000</option><option>1000+</option></select></Field>
        <Field label="Timeline" required><select className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#7C3AED]" value={context.timeline} onChange={e=> setContext(c=>({...c, timeline:e.target.value}))}><option value="">Select</option><option>ASAP</option><option>1-3 months</option><option>3-6 months</option><option>6-12 months</option><option>12+ months</option><option>Flexible</option></select></Field>
      </div>

      <div className="mt-5">
        <Field label="Project Type or Use Case" required hint="E.g., CRM implementation or Cloud migration">
          <textarea maxLength={300} rows={4} className="w-full px-3 py-2 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-200 outline-none" value={context.project} onChange={e=> setContext(c=>({...c, project:e.target.value}))} />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Primary Goal" required>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {["Reduce costs & optimize spending","Improve operational efficiency","Enable digital transformation","Enhance security & compliance","Scale infrastructure/capabilities"].map(g => (
              <label key={g} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${context.goal===g? 'border-[#2563EB] bg-blue-50':'border-[#E2E8F0]'}`}>
                <input type="radio" name="goal" checked={context.goal===g} onChange={()=> setContext(c=>({...c, goal:g}))} />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-5">
        <Field label="Budget Range">
          <select
            className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2563EB]"
            value={context.budget}
            onChange={e=> setContext(c=>({...c, budget:e.target.value}))}
          >
            <option value="">Select</option>
            <option value="< $50K">{"< $50K"}</option>
            <option value="$50K-$100K">$50K-$100K</option>
            <option value="$100K-$500K">$100K-$500K</option>
            <option value="$500K+">$500K+</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Work Email (for delivery)"><input type="email" className="w-full h-12 px-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2563EB]" value={email} onChange={e=> setEmail(e.target.value)} placeholder="you@company.com"/></Field>
      </div>

      <div className="mt-5">
        <Field label="Additional Context (Optional)"><textarea rows={4} className="w-full px-3 py-2 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2563EB]" value={context.extra} onChange={e=> setContext(c=>({...c, extra:e.target.value}))} /></Field>
      </div>
    </div>
  )
}

const POPULAR_VENDORS = ['Salesforce','HubSpot','Pipedrive','AWS','Azure','GCP','CrowdStrike','Okta','Snowflake','Databricks']

const Step2 = React.memo(function Step2({ vendors, setVendors, vendorQuery, setVendorQuery }){
  const [debouncedQuery, setDebouncedQuery] = useState(vendorQuery)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(vendorQuery), 200)
    return () => clearTimeout(id)
  }, [vendorQuery])
  const suggestions = useMemo(() =>
    POPULAR_VENDORS.filter(v => v.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0,6)
  , [debouncedQuery])

  const setAt = (i, val) => setVendors(prev => prev.map((v,idx)=> idx===i? val : v))
  const addVendor = () => setVendors(prev => prev.length>=5 ? prev : [...prev, ''])
  const removeAt = (i) => setVendors(prev => prev.filter((_,idx)=> idx!==i))

  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Which Vendors Are You Considering?</div>
      <div className="text-sm text-[#475569] mb-6">Add the vendors you're evaluating. We'll tailor the comparison.</div>

      <div className="grid gap-4">
        {vendors.map((v, i)=> (
          <div key={i} className="rounded-xl border-2 border-[#E2E8F0] p-4">
            <Field label={`Vendor ${i+1}${i===0 ? ' (Required)' : ''}`} required={i===0}>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"/>
                <input value={v} onChange={e=> setAt(i, e.target.value)} placeholder="Search or enter vendor name..." className="w-full h-12 pl-10 pr-10 rounded-lg border-2 border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-200 outline-none" />
                {vendors.length>1 && (
                  <button aria-label="Remove" onClick={()=> removeAt(i)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100"><X size={16}/></button>
                )}
              </div>
            </Field>
            {!!v && (
              <div className="mt-2 text-sm text-[#475569]">Selected: <span className="font-medium">{v}</span></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button onClick={addVendor} className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg border ${vendors.length>=5? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}><Plus size={16}/> Add Another Vendor</button>
        <div className="mt-4 rounded-xl border p-4 bg-[#F8FAFC]">
          <div className="text-sm font-semibold mb-2">Popular Vendors</div>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"/>
            <input value={vendorQuery} onChange={e=> setVendorQuery(e.target.value)} placeholder="Filter suggestions" className="w-full h-10 pl-9 rounded-lg border-2 border-[#E2E8F0] focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={()=> setVendorQuery('') || setAt(Math.max(vendors.findIndex(x=> !x), 0), s)} className="px-3 py-1.5 rounded-full border hover:bg-white">{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

const Step3 = React.memo(function Step3({ priorities, movePriority }){
  return (
    <div>
      <div className="text-2xl font-semibold mb-1">What Matters Most to You?</div>
      <div className="text-sm text-[#475569] mb-6">Rank these factors by importance. 1 = Most important.</div>
      <div className="space-y-3">
        {priorities.map((p, i)=> (
          <div key={p.key} className="flex items-center gap-3 p-4 rounded-xl border hover:border-[#94A3B8] bg-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white grid place-items-center font-semibold">{i+1}</div>
            <div className="flex-1">
              <div className="font-medium">{p.label}</div>
              <div className="text-xs text-[#64748B]">Drag alternative: use arrows to reorder</div>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Move Up" onClick={()=> movePriority(i,'up')} className="p-2 rounded border hover:bg-gray-50"><ArrowUp size={16}/></button>
              <button aria-label="Move Down" onClick={()=> movePriority(i,'down')} className="p-2 rounded border hover:bg-gray-50"><ArrowDown size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <label className="text-sm font-medium">Additional Evaluation Criteria (Optional)</label>
        <textarea rows={4} className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2563EB]" placeholder="Any other factors critical to your decision?" />
      </div>
    </div>
  )
})

const PoweredBy = React.memo(function PoweredBy(){
  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="rounded-2xl border bg-white p-10">
          <h3 className="text-2xl font-semibold text-center">Powered by Taloflow's Expert Analysis</h3>
          <p className="mt-2 text-center text-[#475569]">Our analysis leverages Taloflow’s comprehensive vendor intelligence platform—trusted for data‑driven technology decisions.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-[#475569]">
            <span>✓ 10,000+ vendor profiles analyzed</span>
            <span>✓ Expert‑curated market assessments</span>
            <span>✓ Real‑world performance data</span>
            <span>✓ Unbiased, independent evaluations</span>
          </div>
        </div>
      </div>
    </section>
  )
})

