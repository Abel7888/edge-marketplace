import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

export default function RequestInformation(){
  const navigate = useNavigate()
  const location = useLocation()
  const prefillFirm = useMemo(()=>{
    const state = location.state||{}
    return { firmId: state.firmId||'', firmName: state.firmName||'' }
  }, [location.state])

  const [form, setForm] = useState({
    projectName: '',
    appTypes: [],
    industries: [],
    stage: '',
    help: [],
    budget: '',
    timeline: '',
    tech: '',
    name: '',
    company: '',
    email: '',
    call: '',
  })

  function toggle(listKey, val){
    setForm(f => ({...f, [listKey]: (f[listKey]||[]).includes(val) ? f[listKey].filter(x=> x!==val) : [...(f[listKey]||[]), val]}))
  }

  function submit(e){
    e.preventDefault()
    const lines = []
    if (prefillFirm.firmName) lines.push(`Target Firm: ${prefillFirm.firmName} (${prefillFirm.firmId})`)
    lines.push(
      `Project Name or Goal: ${form.projectName}`,
      `Type of Application: ${form.appTypes.join(', ')||'-'}`,
      `Industry Focus: ${form.industries.join(', ')||'-'}`,
      `Current Stage: ${form.stage||'-'}`,
      `Help Needed: ${form.help.join(', ')||'-'}`,
      `Estimated Budget Range (USD): ${form.budget||'-'}`,
      `Timeline / Launch Goal: ${form.timeline||'-'}`,
      `Preferred Technologies / Integrations: ${form.tech||'-'}`,
      `Contact: ${form.name||'-'} | ${form.company||'-'} | ${form.email||'-'}`,
      `Short Call First?: ${form.call||'-'}`
    )
    const subject = encodeURIComponent('RFI - Hire an Application Development Team')
    const body = encodeURIComponent(lines.join('\n'))
    window.location.href = `mailto:abelassefa788@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <button onClick={()=> navigate(-1)} className="text-sm text-blue-700">← Back</button>
        <h1 className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🤝 Request for Information – Hire an Application Development Team</h1>
        <p className="mt-2 text-gray-700">We’d love to learn more about your project so we can connect you with the right team. Please share a few quick details below — it only takes a minute.</p>
        {prefillFirm.firmName && (
          <div className="mt-4 p-3 rounded-xl border bg-white text-sm">You are requesting information to: <span className="font-semibold">{prefillFirm.firmName}</span></div>
        )}
        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold">1. Project Name or Goal</label>
            <input value={form.projectName} onChange={e=> setForm(f=>({...f, projectName:e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="What are you building or hoping to achieve?"/>
          </div>

          <div>
            <div className="text-sm font-semibold">2. Type of Application</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['Web','Mobile','Cross-platform','Other'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.appTypes.includes(x)?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="checkbox" className="hidden" checked={form.appTypes.includes(x)} onChange={()=> toggle('appTypes', x)} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">3. Industry Focus</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['Healthcare','Finance','Real Estate','Construction','Manufacturing / IoT','Other'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.industries.includes(x)?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="checkbox" className="hidden" checked={form.industries.includes(x)} onChange={()=> toggle('industries', x)} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">4. Current Stage</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['Idea','Prototype / MVP','In Development','Scaling'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.stage===x?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="radio" name="stage" className="hidden" checked={form.stage===x} onChange={()=> setForm(f=>({...f, stage:x}))} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">5. What kind of help do you need?</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['Full development team','Team extension','UI/UX','QA / Testing','Consulting'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.help.includes(x)?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="checkbox" className="hidden" checked={form.help.includes(x)} onChange={()=> toggle('help', x)} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">6. Estimated Budget Range (USD)</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['<$25K','$25K–$50K','$50K–$100K','$100K+','Not sure yet'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.budget===x?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="radio" name="budget" className="hidden" checked={form.budget===x} onChange={()=> setForm(f=>({...f, budget:x}))} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold">7. Timeline or Launch Goal</label>
            <input value={form.timeline} onChange={e=> setForm(f=>({...f, timeline:e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="When do you hope to start or go live?"/>
          </div>

          <div>
            <label className="block text-sm font-semibold">8. Any preferred technologies or integrations? <span className="text-gray-500 font-normal">(Optional)</span></label>
            <textarea value={form.tech} onChange={e=> setForm(f=>({...f, tech:e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2" rows={3} placeholder="e.g., React Native, Salesforce, Snowflake, Stripe" />
          </div>

          <div>
            <div className="text-sm font-semibold">9. Contact Info</div>
            <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={form.name} onChange={e=> setForm(f=>({...f, name:e.target.value}))} className="border rounded-lg px-3 py-2" placeholder="Name"/>
              <input value={form.company} onChange={e=> setForm(f=>({...f, company:e.target.value}))} className="border rounded-lg px-3 py-2" placeholder="Company"/>
              <input value={form.email} onChange={e=> setForm(f=>({...f, email:e.target.value}))} className="border rounded-lg px-3 py-2" placeholder="Email"/>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">10. Would you like a short call before we match you?</div>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {['Yes, please','No, just send matches'].map(x=> (
                <label key={x} className={`px-3 py-1.5 rounded-full border cursor-pointer ${form.call===x?'bg-blue-600 text-white border-blue-600':'bg-white'}`}>
                  <input type="radio" name="call" className="hidden" checked={form.call===x} onChange={()=> setForm(f=>({...f, call:x}))} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Submit RFI</button>
          </div>
        </form>
      </div>
    </div>
  )
}
