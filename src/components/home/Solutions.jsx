export default function Solutions(){
  return (
    <section id="solutions" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900">Solutions</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">Explore solutions across AI/ML, Blockchain & Security, Cloud Infrastructure, IoT & Edge, Data & Analytics, and more.</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{t:'AI & ML', d:'Agents, RAG, Vision, NLP'},{t:'Blockchain & Security', d:'Identity, KYC, Smart Contracts'},{t:'Cloud & DevOps', d:'Kubernetes, FinOps, Observability'},{t:'IoT & Edge', d:'Sensors, Gateways, Telemetry'},{t:'Data & Analytics', d:'Pipelines, Warehouses, BI'},{t:'CX & Marketing', d:'Personalization, CDP, Automation'}].map((c)=> (
            <div key={c.t} className="rounded-2xl border bg-white p-5">
              <div className="text-lg font-semibold text-slate-900">{c.t}</div>
              <div className="text-sm text-gray-600 mt-1">{c.d}</div>
              <div className="mt-3">
                <a href="/discover" className="text-sm text-blue-600">Browse vendors →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

