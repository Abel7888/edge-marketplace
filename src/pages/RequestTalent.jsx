import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

export default function RequestTalent(){
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = useMemo(()=> ({
    role: location.state?.role || '',
    category: location.state?.category || '',
  }), [location.state])

  const [form, setForm] = useState({
    role: prefill.role,
    category: prefill.category,
    prerequisites: '',
    startWhen: '',
    engagement: '',
    location: '',
    timeZone: '',
    weeklyHours: '',
    duration: '',
    budget: '',
    notes: '',
    name: '',
    company: '',
    email: '',
  })

  function update(k, v){ setForm(f => ({ ...f, [k]: v })) }

  async function submit(e){
    e.preventDefault()
    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'Detailed Talent Request',
          category: form.category,
          role: form.role,
          prerequisites: form.prerequisites,
          startWhen: form.startWhen,
          engagement: form.engagement,
          location: form.location,
          timeZone: form.timeZone,
          weeklyHours: form.weeklyHours,
          duration: form.duration,
          budget: form.budget,
          notes: form.notes,
          name: form.name,
          company: form.company,
          email: form.email,
          submittedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        alert('Request submitted successfully! We\'ll send top candidates within 24 hours.')
        navigate('/find-talent')
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
        <h1 className="text-2xl font-extrabold">Request Vetted Talent</h1>
        <p className="mt-1 text-white/90">Tell us what you need — we\'ll send top candidates within 24 hours.</p>
        <div className="mt-3 text-sm">
          <button className="h-9 px-3 rounded-lg bg-white text-indigo-700 font-semibold" onClick={()=> navigate('/find-talent')}>Back to Find Talent</button>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">Category</label>
            <input value={form.category} onChange={e=> update('category', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., AI, Application Development" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Target Role</label>
            <input value={form.role} onChange={e=> update('role', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., Full-Stack Developer (React/Node)" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Prerequisites / Skills</label>
          <textarea value={form.prerequisites} onChange={e=> update('prerequisites', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" rows={4} placeholder="Key skills, frameworks, certifications, domain knowledge" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">When do you need this role?</label>
            <input value={form.startWhen} onChange={e=> update('startWhen', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., ASAP, next month, Q1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Engagement Type</label>
            <div className="mt-1 flex flex-wrap gap-3 text-sm">
              {['Contract','Contract-to-hire','Long-term','Part-time'].map(opt => (
                <label key={opt} className="inline-flex items-center gap-2 border rounded-lg px-3 py-2">
                  <input type="radio" name="engagement" checked={form.engagement===opt} onChange={()=> update('engagement', opt)} className="accent-indigo-600" /> {opt}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">Work Location</label>
            <input value={form.location} onChange={e=> update('location', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Remote, Hybrid, Onsite (City/Country)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Time Zone / Overlap</label>
            <input value={form.timeZone} onChange={e=> update('timeZone', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., EST, 4+ hours overlap" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">Weekly Hours</label>
            <input value={form.weeklyHours} onChange={e=> update('weeklyHours', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., 20, 40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Duration</label>
            <input value={form.duration} onChange={e=> update('duration', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., 3 months, 12+ months" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Budget Range (USD)</label>
            <input value={form.budget} onChange={e=> update('budget', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="e.g., $50-$80/hr or $10k-$30k" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Additional Notes</label>
          <textarea value={form.notes} onChange={e=> update('notes', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" rows={4} placeholder="Team context, product goals, must-have experience" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-800">Your Name</label>
            <input value={form.name} onChange={e=> update('name', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Company</label>
            <input value={form.company} onChange={e=> update('company', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Email</label>
            <input type="email" value={form.email} onChange={e=> update('email', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="h-12 px-6 rounded-xl bg-indigo-600 text-white font-semibold">Submit Request</button>
        </div>
      </form>
    </div>
  )
}
