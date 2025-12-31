'use client'


import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'
import { Activity, Users, BarChart3, TrendingUp, ArrowUpRight, Sparkles, Star } from 'lucide-react'
import vendorsData from '../data/vendors.js'

function range(n){ return Array.from({length:n}, (_,i)=> i) }
function fmt(n){ return n.toLocaleString() }

function genActivity(days=90){
  const today = new Date()
  return range(days).map(i=>{
    const d = new Date(today.getTime() - (days-1-i)*24*3600*1000)
    const views = Math.floor(Math.random()*4) + (Math.random()>0.7? Math.floor(Math.random()*6):0)
    const requests = Math.random()>0.85? 1: 0
    return { date: d.toISOString(), views, requests }
  })
}

const activityData = genActivity(90)

function useDateFiltered(rangeKey){
  const days = rangeKey==='last7days'?7: rangeKey==='last30days'?30: rangeKey==='last3months'?90: 365
  return useMemo(()=> activityData.slice(-days), [rangeKey])
}

export default function Insights(){
  // --- Hero metrics (animated counters) ---
  const [tick, setTick] = useState(0)
  useEffect(()=>{ const id = setInterval(()=> setTick(t=> t+1), 1200); return ()=> clearInterval(id) },[])
  const heroMetrics = [
    { key:'vendors', label:'Active Vendors', value: 1247, delta:+5.4, badge:'New this week', grad:'from-blue-500 to-indigo-600', icon:<BarChart3 className="text-white" size={18}/>, data:[3,5,6,4,7,9,12,10,14,16] },
    { key:'requests', label:'Demo Requests', value: 9823, delta:+12.3, badge:null, grad:'from-emerald-500 to-teal-600', icon:<Activity className="text-white" size={18}/>, data:[2,2,3,5,8,7,9,12,11,13] },
    { key:'reports', label:'Reports & Case Studies', value: 214, delta:+3.1, badge:null, grad:'from-violet-500 to-fuchsia-600', icon:<Sparkles className="text-white" size={18}/>, data:[1,2,2,3,4,5,6,6,7,8] },
    { key:'buyers', label:'Active Buyers/Researchers', value: 6432, delta:+7.8, badge:null, grad:'from-rose-500 to-pink-600', icon:<Users className="text-white" size={18}/>, data:[4,6,5,6,7,9,10,12,12,14] },
    { key:'adoption', label:'Platform Adoption Rate', value: 68, percent:true, delta:+2.2, badge:null, grad:'from-amber-500 to-orange-600', icon:<TrendingUp className="text-white" size={18}/>, data:[20,24,26,30,35,40,44,52,61,68] },
  ]

  // --- Industry matrix data ---
  const industries = [
    { key:'proptech', icon:'🏢', name:'PropTech', vendors:186, growth:32, demos:73, topTech:'AI RPA', sat:4.6, newThisWeek:7, color:'from-blue-50 to-indigo-50', bar:'bg-indigo-500', badge:'hot' },
    { key:'contech', icon:'🏗️', name:'ConTech', vendors:142, growth:18, demos:58, topTech:'Digital Twin', sat:4.4, newThisWeek:5, color:'from-amber-50 to-orange-50', bar:'bg-amber-500', badge:'rising' },
    { key:'healthcare', icon:'🏥', name:'Healthcare', vendors:205, growth:21, demos:64, topTech:'AI Imaging', sat:4.7, newThisWeek:9, color:'from-rose-50 to-red-50', bar:'bg-rose-500', badge:'rising' },
    { key:'edge', icon:'⚡', name:'Edge Computing', vendors:117, growth:14, demos:42, topTech:'Edge AI', sat:4.3, newThisWeek:3, color:'from-cyan-50 to-teal-50', bar:'bg-cyan-500' },
    { key:'drones', icon:'🚁', name:'Drones', vendors:98, growth:26, demos:51, topTech:'VTOL', sat:4.5, newThisWeek:4, color:'from-sky-50 to-cyan-50', bar:'bg-sky-500', badge:'rising' },
    { key:'robotics', icon:'🦾', name:'Robotics', vendors:164, growth:19, demos:60, topTech:'Cobots', sat:4.6, newThisWeek:6, color:'from-amber-50 to-orange-50', bar:'bg-amber-500' },
  ]

  // --- Featured carousel content ---
  const featured = [
    { type:'trend', title:'AI Adoption Surges 340% in Healthcare', sub:'Hospitals lead Edge AI trials for imaging', big:'+340%', grad:'from-blue-600 to-indigo-600' },
    { type:'leader', title:'Market Leader: Edge Orchestration', sub:'Avassa, Barbara, ClearBlade among top performers', big:'Top 5', grad:null },
    { type:'roi', title:'234% Average ROI in PropTech', sub:'Faster time-to-value via prebuilt data models', big:'234%', grad:null },
    { type:'report', title:'Just Published: Q3 Robotics Benchmark', sub:'Deployment speed, uptime, and TCO', big:'Download', grad:null },
  ]
  const [featIdx, setFeatIdx] = useState(0)
  useEffect(()=>{ const id = setInterval(()=> setFeatIdx(i=> (i+1)%featured.length), 5000); return ()=> clearInterval(id)},[])

  const recs = vendorsData.slice(0,3).map(v=> ({ id:v.id, name:v.name, logo:v.logoEmoji||'🏢', match: Math.min(98, Math.max(70, Math.round((v.metrics?.satisfactionScore||4.5)*18))) }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-[280px] z-40 border-r bg-white">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:ml-[280px] max-w-[1440px] mx-auto px-6 pt-24 pb-20">
      {/* Hero: Animated Stats Banner */}
      <section className="">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Industry Insights</h1>
            <p className="text-gray-600">All Industries · Platform-wide activity and trends</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {heroMetrics.map((m)=> (
            <div key={m.key} className={`relative rounded-2xl p-4 text-white bg-gradient-to-r ${m.grad} shadow-lg hover:shadow-2xl transition`}> 
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/15 grid place-items-center">{m.icon}</div>
                {m.badge && <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20">{m.badge}</span>}
              </div>
              <div className="mt-3 text-2xl font-extrabold tracking-tight">{m.percent? `${Math.min(m.value, m.value + (tick%3))}%` : (m.value + (tick%3)).toLocaleString()}</div>
              <div className="text-xs opacity-90">{m.label}</div>
              <div className="mt-2 flex items-center gap-1 text-xs"><ArrowUpRight size={14}/> <span>{m.delta}%</span> <span className="opacity-80">last 30d</span></div>
              <Sparkline data={m.data} color="white" />
            </div>
          ))}
        </div>
      </section>

      {/* Industry Performance Matrix */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Industry Performance</h2>
          <button className="text-sm px-3 py-2 rounded-lg border">All Filters</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {industries.map(ind => (
            <IndustryCard key={ind.key} ind={ind} />
          ))}
        </div>
      </section>

      {/* Cross-Industry Insights Panel */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Technology Adoption Trends</div>
            <div className="text-xs text-gray-600">Most Innovative Industry: Healthcare</div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['AI',78,'bg-indigo-500'],['IoT',64,'bg-emerald-500'],['Blockchain',28,'bg-violet-500'],['AR/VR',36,'bg-rose-500']
            ].map(([label, pct, cls])=> (
              <div key={label}>
                <div className="flex items-center justify-between text-xs text-gray-600"><span>{label}</span><span>{pct}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${cls}`} style={{ width: pct+'%' }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Buyer Behavior Patterns</div>
            <div className="text-xs text-emerald-700">Fastest Moving: Drones</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <MiniBar title="Eval Cycle (days)" items={[['PropTech',18],['ConTech',22],['Robotics',16],['Healthcare',20]]} />
            <MiniBar title="Conversion Rate %" items={[['PropTech',12],['ConTech',9],['Robotics',15],['Healthcare',11]]} color="bg-emerald-500" />
            <div className="col-span-2 text-xs text-gray-600">Peak Activity: Tue–Thu, 9–11am (heatmap)</div>
          </div>
        </div>
      </section>

      {/* Featured Insights Carousel */}
      <section className="mt-10">
        <div className="relative rounded-2xl overflow-hidden border bg-white">
          <div className="grid md:grid-cols-2">
            {featured.map((f, i)=> (
              <div key={i} className={`${i===featIdx? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity p-6 ${f.grad? 'text-white bg-gradient-to-r '+f.grad : ''}`}>
                <div className="text-xs font-semibold flex items-center gap-2">{f.type==='trend'?'Trend Alert': f.type==='leader'?'Market Leader':'New Report'} {f.type==='trend' && <Sparkles size={14}/>}</div>
                <div className="mt-2 text-2xl font-bold">{f.title}</div>
                <div className="text-sm opacity-80">{f.sub}</div>
                <div className="mt-3 text-4xl font-extrabold">{f.big}</div>
                <div className="mt-4"><button className={`px-4 py-2 rounded-lg ${f.grad? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>{f.type==='report'?'Download Report →':'Read Analysis →'}</button></div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {featured.map((_,i)=> <button key={i} onClick={()=> setFeatIdx(i)} className={`w-2 h-2 rounded-full ${i===featIdx?'bg-slate-900':'bg-gray-300'}`} />)}
          </div>
        </div>
      </section>

      {/* Market Pulse */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">What's Happening Now</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            <li><span className="animate-pulse inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"/>Healthcare facility requested demo from FlexBots — <span className="text-gray-500">2m ago</span></li>
            <li><span className="animate-pulse inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"/>3 new PropTech vendors added — <span className="text-gray-500">14m ago</span></li>
            <li><span className="animate-pulse inline-block w-2 h-2 rounded-full bg-rose-500 mr-2"/>Q4 Robotics Report downloaded 42× — <span className="text-gray-500">1h ago</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">This Week's Movers</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            {[['1','🏅','BuildSense AI','PropTech','+156%'],['2','🥈','Avassa','Edge','+121%'],['3','🥉','ClearBlade','IoT','+98%'],['4','','FlexBots','Robotics','+76%'],['5','','AeroScan','Drones','+65%']].map(([rank, medal, name, cat, change])=> (
              <li key={name} className="flex items-center gap-2"><span className="w-6">#{rank} {medal}</span><span className="flex-1">{name} <span className="text-xs text-gray-500">· {cat}</span></span><span className="text-emerald-600 font-semibold">{change}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Industry Spotlight</div>
          <div className="mt-3 text-sm text-gray-700">Supply Chain: <span className="font-semibold text-slate-900">847 active evaluations</span></div>
          <div className="mt-2 text-xs text-gray-600">Top 3 technologies: Edge AI, Digital Twin, RPA</div>
          <div className="mt-3"><button className="px-3 py-2 rounded-lg border">Deep Dive →</button></div>
        </div>
      </section>

      {/* Intelligence Reports Library */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Intelligence Reports</h2>
          <div className="flex items-center gap-2">
            <select className="border rounded-lg px-2 py-1 text-sm"><option>All Industries</option><option>PropTech</option><option>Robotics</option></select>
            <select className="border rounded-lg px-2 py-1 text-sm"><option>All Types</option><option>Benchmark</option><option>Forecast</option></select>
            <input className="border rounded-lg px-2 py-1 text-sm" placeholder="Search reports..." />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=> (
            <div key={i} className="rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition">
              <div className="h-28 bg-gradient-to-r from-indigo-500 to-blue-500" />
              <div className="p-4">
                <div className="text-sm font-semibold">Q{(i%4)+1} {2024 + Math.floor(i/4)} Industry Benchmark</div>
                <div className="text-xs text-gray-600">Type: Benchmark · 28 pages · 1,203 downloads</div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600"><Star size={14} className="text-amber-500"/> 4.{(i%3)+2}/5 · Trending</div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Read Online</button>
                  <button className="px-3 py-2 rounded-lg border text-sm">Download PDF</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Engine Teaser */}
      <section className="mt-10 rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Interactive</div>
            <div className="text-2xl font-bold text-slate-900">Compare Vendors</div>
            <div className="text-sm text-gray-600">Compare 1,247 vendors across 50+ criteria</div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Start Comparison →</button>
        </div>
        <div className="mt-4 text-xs text-gray-600">Used by 2,400+ companies</div>
      </section>

      {/* Smart Recommendations */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Based on Your Activity</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {recs.map(r=> (
            <div key={r.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 grid place-items-center text-lg">{r.logo}</div>
                <div className="font-semibold truncate">{r.name}</div>
                <div className="ml-auto text-emerald-700 text-sm font-semibold">{r.match}% match</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Explore Vendors</button>
                <button className="px-3 py-2 rounded-lg border text-sm">Not Interested</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community & Social Proof */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Top Discussions</div>
          <ul className="mt-3 text-sm text-gray-700 space-y-2">
            {['Best ROI for Edge AI in Retail','PropTech integrations thread','Drones compliance Q&A','Digital Twin case studies'].map((t,i)=> (
              <li key={i} className="flex items-center justify-between"><span className="truncate mr-2">{t}</span><span className="text-xs text-gray-500">{(i+3)*5} replies · {(i+2)*100} views</span></li>
            ))}
          </ul>
          <div className="mt-3"><button className="text-sm text-blue-600">View All Discussions →</button></div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Success Stories Snapshot</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {Array.from({length:3}).map((_,i)=> (
              <div key={i} className="rounded-xl border p-3">
                <div className="text-sm font-semibold">Anonymous • Manufacturing</div>
                <div className="text-sm text-gray-700">“We reduced evaluation time by 32% and improved ROI to 186% within 9 months.”</div>
                <button className="mt-2 text-sm text-blue-600">Read Full Story →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Center */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActionCard title="Find Your Solution" body="Answer 5 questions to get personalized vendor recommendations" cta="Take Assessment →" grad="from-blue-600 to-indigo-600" icon="🔎" />
        <ActionCard title="Schedule Consultation" body="Book a free 30-minute consultation with our specialists" cta="Book Call →" grad="from-emerald-600 to-teal-600" icon="📅" />
        <ActionCard title="Custom Report" body="Request a custom industry analysis tailored to your needs" cta="Request Report →" grad="from-violet-600 to-fuchsia-600" icon="📄" />
      </section>
      </div>
    </div>
  )
}

// --- Small helpers ---
function Sparkline({ data, color='white' }){
  const w=180, h=40
  const max = Math.max(...data)
  const pts = data.map((v,i)=> [ (i/(data.length-1))*w, h - (v/max)*h ])
  const d = pts.map((p,i)=> (i? 'L':'M')+p[0]+','+p[1]).join(' ')
  return (
    <svg width={w} height={h} className="mt-2 opacity-70">
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

function IndustryCard({ ind }){
  const badge = ind.growth>30? '🔥 Hot' : ind.growth>=20? '⚡ Rising fast' : '📈 Steady'
  const router = useRouter()
  const route = ind.key==='healthcare' ? '/insights/healthcare' : undefined
  return (
    <div onClick={()=> route && navigate(route)} className={`relative rounded-2xl border overflow-hidden bg-gradient-to-tr ${ind.color} group hover:-translate-y-1 hover:shadow-xl transition ${route? 'cursor-pointer' : ''}`}> 
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ind.bar}`} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-3xl">{ind.icon}</div>
          <div className="text-[11px] px-2 py-0.5 rounded-full bg-white/70">{badge}</div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-900">{ind.name}</div>
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-800">
          <div><span className="font-semibold">Vendors:</span> {ind.vendors}</div>
          <div className="flex items-center gap-1 text-emerald-700"><ArrowUpRight size={14}/> <span className="font-semibold">{ind.growth}%</span> MoM</div>
          <div><span className="font-semibold">Active demos:</span> {ind.demos}</div>
          <div><span className="font-semibold">Top tech:</span> {ind.topTech}</div>
          <div className="flex items-center gap-1"><Star size={14} className="text-amber-500"/> {ind.sat}</div>
          <div className="text-xs bg-white/70 px-2 py-0.5 rounded-full">New this week: {ind.newThisWeek}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {Array.from({length:3}).map((_,i)=> <div key={i} className="w-6 h-6 rounded-full bg-white grid place-items-center text-[11px] border">{i+1}</div>)}
          </div>
          <button onClick={(e)=> { e.stopPropagation(); route && navigate(route) }} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm opacity-0 group-hover:opacity-100 transition">Explore {ind.name} →</button>
        </div>
      </div>
    </div>
  )
}

function MiniBar({ title, items, color='bg-blue-500' }){
  return (
    <div>
      <div className="text-xs font-medium text-slate-900">{title}</div>
      <div className="mt-2 space-y-2">
        {items.map(([label, v])=> (
          <div key={label}>
            <div className="flex items-center justify-between text-xs text-gray-600"><span>{label}</span><span>{v}</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: Math.min(100, v*5)+'%' }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionCard({ title, body, cta, grad, icon }){
  return (
    <div className={`rounded-2xl p-5 text-white bg-gradient-to-r ${grad} hover:shadow-xl transition`}>
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-xl font-bold">{title}</div>
      <div className="text-sm opacity-90">{body}</div>
      <div className="mt-4"><button className="px-4 py-2 rounded-lg bg-white text-slate-900 text-sm">{cta}</button></div>
    </div>
  )
}

function Sidebar(){
  const router = useRouter()
  return (
    <aside className="h-full flex flex-col">
      {/* Branding header */}
      <div className="px-4 py-5 border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-[20px]"><span>📊</span> <span>Insights Hub</span></div>
        <div className="text-[12px] text-gray-500">Market Intelligence</div>
        <div className="mt-2 text-[13px] text-slate-700 flex items-center gap-1">▼ <span>All Industries</span></div>
      </div>

      {/* Platform health mini-widget */}
      <div className="mx-3 mt-3 rounded-xl border bg-emerald-50 p-3">
        <div className="text-[12px] text-slate-900 font-semibold">Today's Activity</div>
        <div className="mt-1 text-[12px] text-gray-700">🔄 342 Active Searches</div>
        <div className="text-[12px] text-gray-700">✅ 89 Demos Booked</div>
      </div>

      {/* Industry navigation */}
      <div className="px-3 mt-4">
        <div className="text-[10px] tracking-wider text-gray-500 font-semibold">INDUSTRIES</div>
        <div className="mt-2 space-y-1">
          {[
            ['🏥','Healthcare','hot','/insights/healthcare'],['💰','Finance','','#'],['🏗️','Construction','rising','#'],['🏢','Real Estate','','#'],['🔗','Supply Chain','','#'],['⚙️','Manufacturing','','#']
          ].map(([icon, name, badge, href])=> (
            <button key={name} onClick={()=> href && navigate(href)} className="w-full relative flex items-center gap-3 px-3 py-2 rounded-[10px] text-[15px] text-gray-700 hover:bg-gray-100 transition">
              <span className="w-1.5 h-6 rounded bg-transparent mr-1" />
              <span className="text-[20px]">{icon}</span>
              <span className="flex-1 text-left">{name}</span>
              {badge==='hot' && <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Hot</span>}
              {badge==='rising' && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Rising</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace tools */}
      <div className="px-3 mt-5">
        <div className="text-[10px] tracking-wider text-gray-500 font-semibold">WORKSPACE</div>
        <div className="mt-2 space-y-1">
          {[
            ['🔖','My Shortlist','12'],['🔔','Alerts','3'],['📊','My Activity',''],['⚡','ROI Calculator',''],['🔄','Compare Vendors',''],['📥','Downloads','8']
          ].map(([icon, label, badge])=> (
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] text-gray-600 hover:bg-gray-100 transition">
              <span className="text-[18px]">{icon}</span>
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className="w-5 h-5 rounded-full bg-blue-600 text-white grid place-items-center text-[10px]">{badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 mt-4">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50 text-[14px] text-gray-600">
          <span>🔍</span>
          <input className="flex-1 bg-transparent outline-none" placeholder="Search insights..." />
          <span className="text-[11px] text-gray-400">Ctrl+K</span>
        </div>
      </div>

      {/* Profile & settings */}
      <div className="mt-auto">
        <div className="mx-3 my-3 border-t pt-3">
          <button className="w-full flex items-center justify-between px-3 py-2 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg">🌓 <span className="ml-2 flex-1 text-left">Dark Mode</span> <span className="text-gray-400">○──</span></button>
          <button className="w-full flex items-center justify-between px-3 py-2 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg">🔔 <span className="ml-2 flex-1 text-left">Notifications</span> <span className="text-gray-400">──○</span></button>
        </div>
        <div className="px-3 pb-4 border-t pt-3">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center">JD</div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-slate-900 truncate">John Doe</div>
              <div className="text-[12px] text-gray-600 truncate">Acme Corporation</div>
              <div className="text-[11px] text-gray-500 truncate">Product Manager</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

