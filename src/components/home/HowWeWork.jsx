export default function HowWeWork(){
  const steps = [
    { t: 'Discover', d: 'Browse curated categories, search with intelligent filters, and shortlist vendors.' },
    { t: 'Evaluate', d: 'Compare profiles, case studies, and metrics. Request demos and quotes.' },
    { t: 'Decide', d: 'Use insights and recommendations to choose the right partner with confidence.' },
    { t: 'Engage', d: 'Streamlined communication and handoff to kick off projects smoothly.' },
  ]
  return (
    <section id="how" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900">How We Work</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">A simple flow designed to reduce friction and deliver outcomes faster.</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s)=> (
            <div key={s.t} className="rounded-2xl border p-5 bg-white">
              <div className="text-lg font-semibold text-slate-900">{s.t}</div>
              <div className="text-sm text-gray-600 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

