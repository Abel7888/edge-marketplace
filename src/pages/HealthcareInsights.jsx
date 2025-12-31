import { useEffect, useState } from 'react'
import { Activity, HeartPulse, Users, BarChart3, TrendingUp, Star, FileText, Calendar, ArrowUpRight } from 'lucide-react'

export default function HealthcareInsights(){
  const [tick, setTick] = useState(0)
  useEffect(()=>{ const id=setInterval(()=> setTick(t=> t+1), 1300); return ()=> clearInterval(id)},[])
  const hero = [
    { k:'evaluations', label:'Active Evaluations', val:847, delta:+9.4, grad:'from-rose-500 to-pink-600', icon:<Activity className="text-white" size={18}/>, data:[3,4,5,6,7,9,10,12,13,14] },
    { k:'requests', label:'Demo Requests (30d)', val:342, delta:+12.6, grad:'from-indigo-500 to-blue-600', icon:<Calendar className="text-white" size={18}/>, data:[2,3,4,6,5,7,9,11,10,12] },
    { k:'reports', label:'Downloads (90d)', val:1247, delta:+5.1, grad:'from-violet-500 to-fuchsia-600', icon:<FileText className="text-white" size={18}/>, data:[4,5,5,6,7,8,9,10,10,11] },
    { k:'satisfaction', label:'Avg Satisfaction', val:4.6, delta:+0.2, percent:false, grad:'from-emerald-500 to-teal-600', icon:<Star className="text-white" size={18}/>, data:[3.9,4.0,4.1,4.2,4.3,4.5,4.6,4.6,4.6,4.7] },
  ]

  const movers = [
    ['🏅','MediFlow AI','+156%','342 requests'],
    ['🥈','InsightRad','+134%','298 requests'],
    ['🥉','CareSense Cloud','+98%','221 requests'],
    ['','HealthOps Pro','+76%','187 requests'],
    ['','PatientGraph','+65%','173 requests'],
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Home › Insights › Healthcare</div>
          <h1 className="mt-1 text-4xl font-extrabold text-slate-900">Healthcare Intelligence</h1>
          <div className="text-gray-600">Market pulse, vendor landscape, and ROI benchmarks</div>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hero.map(m=> (
          <div key={m.k} className={`rounded-2xl p-4 text-white bg-gradient-to-r ${m.grad} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-white/15 grid place-items-center">{m.icon}</div>
              <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Last 30d</div>
            </div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight">{m.k==='satisfaction'? (m.val + (tick%2?0:0)).toFixed(1) : (m.val + (tick%3)).toLocaleString()}</div>
            <div className="text-xs opacity-90">{m.label}</div>
            <div className="mt-2 flex items-center gap-1 text-xs"><ArrowUpRight size={14}/> <span>{m.delta}%</span> <span className="opacity-80">vs prev</span></div>
          </div>
        ))}
      </div>

      {/* Market Pulse */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><span className="text-rose-600">🩺</span> Market Pulse</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2 max-h-[320px] overflow-auto">
            <li>🏥 Regional hospital booked demo with <b>MediFlow AI</b> — <span className="text-gray-500">3m ago</span></li>
            <li>📄 Q4 Healthcare Report downloaded <b>42×</b> — <span className="text-gray-500">18m ago</span></li>
            <li>✨ New vendor <b>CareSense Cloud</b> added — <span className="text-gray-500">1h ago</span></li>
            <li>💬 Discussion: <b>HIPAA for AI platforms</b> trending — <span className="text-gray-500">2h ago</span></li>
            <li>🏥 University medical center requested <b>ROI analysis</b> — <span className="text-gray-500">3h ago</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">This Week's Movers</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            {movers.map(([medal,name,chg,req])=> (
              <li key={name} className="flex items-center justify-between">
                <div><span className="mr-2">{medal}</span>{name}</div>
                <div className="text-right text-xs"><div className="text-emerald-600 font-semibold">{chg}</div><div className="text-gray-500">{req}</div></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Key Benchmarks</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border p-3"><div className="text-gray-500 text-xs">Avg ROI</div><div className="text-xl font-bold text-slate-900">234%</div></div>
            <div className="rounded-xl border p-3"><div className="text-gray-500 text-xs">Time to Value</div><div className="text-xl font-bold text-slate-900">4.2 mo</div></div>
            <div className="rounded-xl border p-3"><div className="text-gray-500 text-xs">Satisfaction</div><div className="text-xl font-bold text-slate-900">4.6/5</div></div>
            <div className="rounded-xl border p-3"><div className="text-gray-500 text-xs">Compliance</div><div className="text-xl font-bold text-slate-900">HIPAA, HITRUST</div></div>
          </div>
        </div>
      </section>

      {/* Vendor Landscape */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Vendor Landscape</h2>
          <button className="px-3 py-2 rounded-lg border text-sm">Compare Vendors</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[['MediFlow AI','AI Diagnostics','⭐ 4.8 • 234 reviews'],['InsightRad','Imaging AI','⭐ 4.7 • 189 reviews'],['CareSense Cloud','Remote Monitoring','⭐ 4.6 • 156 reviews']].map(([name,cat,meta])=> (
            <div key={name} className="rounded-2xl border bg-white p-4 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 grid place-items-center text-lg">🏥</div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{name}</div>
                  <div className="text-xs text-gray-500">{cat}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">{meta}</div>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">View Profile</button>
                <button className="px-3 py-2 rounded-lg border text-sm">Request Demo</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Case Studies</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Memorial Regional Hospital','CityHealth Clinics'].map((org,i)=> (
            <div key={org} className="rounded-2xl border bg-white p-4">
              <div className="text-sm font-semibold">{org}</div>
              <div className="text-sm text-gray-700 mt-1">Challenge: Reduce readmissions and improve diagnostic speed.</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-emerald-50 p-3"><div className="text-xl font-bold text-emerald-700">32%</div><div className="text-[11px] text-emerald-700">Reduced Readmit</div></div>
                <div className="rounded-xl bg-indigo-50 p-3"><div className="text-xl font-bold text-indigo-700">2.5×</div><div className="text-[11px] text-indigo-700">Faster Diagnosis</div></div>
                <div className="rounded-xl bg-amber-50 p-3"><div className="text-xl font-bold text-amber-700">$2.4M</div><div className="text-[11px] text-amber-700">Annual Savings</div></div>
              </div>
              <div className="mt-3 text-xs text-gray-600">Implementation: 6 months • Vendor: MediFlow AI • Tags: #AI #Analytics #PatientCare</div>
              <div className="mt-3"><button className="px-3 py-2 rounded-lg border text-sm">Read Full Story →</button></div>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Reports */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Healthcare Reports</h2>
          <div className="flex items-center gap-2"><select className="border rounded-lg px-2 py-1 text-sm"><option>All</option><option>Benchmark</option><option>Forecast</option></select><input className="border rounded-lg px-2 py-1 text-sm" placeholder="Search reports..."/></div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:3}).map((_,i)=> (
            <div key={i} className="rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition">
              <div className="h-28 bg-gradient-to-r from-rose-500 to-pink-600" />
              <div className="p-4">
                <div className="text-sm font-semibold">Q{(i%4)+1} 2025 Healthcare Benchmark</div>
                <div className="text-xs text-gray-600">42 pages · 1,247 downloads · ✨ Trending</div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Read Online</button>
                  <button className="px-3 py-2 rounded-lg border text-sm">Download PDF</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Trends */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Technology Trends</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[['AI Diagnostics',87],['Remote Monitoring',72],['Digital Twin',54]].map(([t,p])=> (
            <div key={t} className="rounded-2xl border bg-white p-4">
              <div className="font-semibold">{t}</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: p+'%' }} /></div>
              <div className="mt-1 text-xs text-gray-600">Adoption: {p}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Benchmarks */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">ROI Benchmarks</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Year 1 Savings</div><div className="text-2xl font-bold text-slate-900">$1.2M</div></div>
          <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">3-Year ROI</div><div className="text-2xl font-bold text-slate-900">234%</div></div>
          <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Breakeven</div><div className="text-2xl font-bold text-slate-900">11 months</div></div>
          <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Total (3Y)</div><div className="text-2xl font-bold text-slate-900">$3.8M</div></div>
        </div>
      </section>

      {/* Community Discussions */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Trending Discussions</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            {['HIPAA compliance for AI','EMR integration best practices','ROI frameworks for diagnostics'].map((t,i)=> (
              <li key={i} className="flex items-center justify-between"><span className="truncate mr-2">{t}</span><span className="text-xs text-gray-500">{(i+3)*8} replies · {(i+2)*200} views</span></li>
            ))}
          </ul>
          <div className="mt-3"><button className="text-sm text-blue-600">View All Discussions →</button></div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Quick Survey</div>
          <div className="mt-2 text-sm text-gray-700">What is your top priority for the next 6 months?</div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
            {['Reduce readmissions','Improve diagnostic accuracy','Optimize operations','Enhance patient engagement'].map(opt=> (
              <label key={opt} className="flex items-center gap-2"><input type="radio" name="prio"/> <span>{opt}</span></label>
            ))}
          </div>
          <div className="mt-3"><button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Submit Response</button></div>
        </div>
      </section>
    </div>
  )
}
