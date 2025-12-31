import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-cyan-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-teal-500/20">
        <div className="flex items-center justify-between">
          <div className="w-16 h-16 rounded-full bg-white grid place-items-center border-4 border-white shadow overflow-hidden">
            <img src={v.logoUrl || '/logos/placeholder.svg'} alt={v.name} className="max-h-9 object-contain" />
          </div>
          <div className="space-y-1 text-right">
            <div className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">✓ EmergingTech Verified</div>
            {v.isFeatured && <div className="inline-block text-xs font-semibold text-white bg-yellow-500 px-2 py-1 rounded-full ml-2">⭐ Featured</div>}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-2xl font-bold text-slate-900">{v.name}</div>
        <div className="text-sm font-semibold text-gray-700 italic mb-4">{v.tagline}</div>
        {Array.isArray(v.positions) && v.positions.length>0 && (
          <div className="mt-2 text-xs text-gray-700"><span className="font-semibold">Edge positions: </span>{v.positions.join(' • ')}</div>
        )}
        {Array.isArray(v.highlights) && v.highlights.length>0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {v.highlights.slice(0,3).map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">{s}</span>
            ))}
            {v.highlights.length>3 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">+{v.highlights.length-3} more</span>}
          </div>
        )}
        {Array.isArray(v.industries) && v.industries.length>0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-800 mb-2">Industries</div>
            <div className="flex flex-wrap gap-2">
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-400">
          <div className="text-sm text-gray-800 leading-relaxed">{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        {Array.isArray(v.customers) && v.customers.length>0 && (
          <div className="mt-3 text-sm text-gray-700">
            <span className="font-semibold">Main customers: </span>
            <span>{v.customers.join(', ')}</span>
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EdgeComputing(){
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [saved, setSaved] = useState(new Set())
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoVendor, setDemoVendor] = useState(null)

  useEffect(()=>{
    if (!currentUser) return
    const unsub = fsSubscribeSaved(currentUser.uid, (list)=>{
      setSaved(new Set(list.map(x=> String(x.id))))
    })
    return ()=> unsub && unsub()
  }, [currentUser])

  async function toggleSaveVendor(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/edge-computing'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Edge Computing' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/edge-computing'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(form){
    if (!currentUser || !demoVendor) return
    await createDemoRequest({
      userId: currentUser.uid,
      vendorId: String(demoVendor.id),
      formData: form,
      status: 'pending'
    })
    setDemoOpen(false)
    setDemoVendor(null)
  }

  const sections = useMemo(()=>{
    const mk = (id, d) => ({ id, ...d })
    const fav = (url) => `https://www.google.com/s2/favicons?domain=${url.replace(/^https?:\/\//,'').replace(/\/$/,'')}&sz=128`
    return [
      {
        key:'infra',
        title:'Edge Infrastructure & Connectivity Systems',
        vendors:(()=>{
          const industries=['Telecom','Industrial','Enterprise']
          const solutions=['Edge Sites','Private 5G','Connectivity']
          const services=['Deployment','Support']
          return [
            mk('edge-infra-edgeuno',{ name:'EdgeUno', website:'https://edgeuno.com/', logoUrl:fav('https://edgeuno.com/'), tagline:'Low-latency infrastructure across LATAM and emerging regions', fullDescription:'EdgeUno provides carrier-grade edge infrastructure across Latin America and beyond. Teams deploy workloads close to users for streaming, gaming, and enterprise apps. Coverage and peering reduce latency and jitter. Suitable for global services entering new markets with reliability requirements.' }),
            mk('edge-infra-edgenectar',{ name:'EdgeNectar', website:'https://www.edgenectar.com/', logoUrl:fav('https://www.edgenectar.com/'), tagline:'Distributed edge PoPs for content and applications', fullDescription:'EdgeNectar operates distributed points of presence to bring content and applications closer to end users. The platform emphasizes performance, observability, and secure delivery. Useful for media, retail, and SaaS workloads needing consistent QoS at the edge.' }),
            mk('edge-infra-aruba-5g',{ name:'HPE Aruba Networking (Private 5G)', website:'https://www.arubanetworks.com/solutions/private-5g/', logoUrl:fav('https://www.arubanetworks.com/'), tagline:'Private 5G and Wi‑Fi integrations for secure edge estates', fullDescription:'Aruba integrates Wi‑Fi and Private 5G to support industrial and campus use cases. Enterprises connect devices with predictable performance and policy controls. Unified management improves operations. Designed for environments with mobility, density, and security needs.' }),
            mk('edge-infra-gcore',{ name:'Gcore', website:'https://gcore.com/', logoUrl:fav('https://gcore.com/'), tagline:'Global edge network for compute, CDN, and streaming', fullDescription:'Gcore delivers a global edge platform for compute, CDN, and low‑latency streaming. Developers run services closer to users while keeping costs predictable. Tooling provides deployment automation and monitoring. Common in gaming, media, and interactive apps.' }),
            mk('edge-infra-stmicro',{ name:'STMicroelectronics', website:'https://www.st.com/', logoUrl:fav('https://www.st.com/'), tagline:'Silicon and reference designs for embedded and edge devices', fullDescription:'STMicroelectronics supplies microcontrollers, sensors, and connectivity enabling edge devices. Reference designs accelerate prototyping and production. Ecosystem tools support firmware, security, and energy management. Widely used across industrial and consumer products.' }),
            mk('edge-infra-datacore',{ name:'DataCore Software (SUSE)', website:'https://www.datacore.com/', logoUrl:fav('https://www.datacore.com/'), tagline:'Software-defined storage powering resilient edge footprints', fullDescription:'DataCore provides software-defined storage used to build resilient, performant edge footprints. Organizations standardize on flexible storage services across sites. Policy, caching, and replication reduce downtime risks. Fits distributed operations and constrained environments.' }),
          ].map(v=>({ ...v, industries, solutions, services }))
        })()
      },
      {
        key:'mgmt',
        title:'Edge Management, Orchestration & Security Platforms',
        vendors:(()=>{
          const industries=['Retail','Industrial','Smart Cities']
          const solutions=['Orchestration','Zero-Touch','Security']
          const services=['Managed','Support']
          return [
            mk('edge-mgmt-zededa',{ name:'ZEDEDA', website:'https://www.zededa.com/', logoUrl:fav('https://www.zededa.com/'), tagline:'Open orchestration and lifecycle at the distributed edge', fullDescription:'ZEDEDA provides an open edge orchestration platform to deploy and manage apps at scale. Teams gain visibility, control, and zero‑touch onboarding across fleets. Security and policy guardrails simplify operations. Integrates with Kubernetes, clouds, and existing CI/CD.' }),
            mk('edge-mgmt-avassa',{ name:'Avassa Systems', website:'https://avassa.io/', logoUrl:fav('https://avassa.io/'), tagline:'Application orchestration purpose‑built for many small sites', fullDescription:'Avassa focuses on operating applications reliably across many small, intermittent sites. Policy, staging, and health insights fit edge realities. Operators update safely and consistently. Integrations align with developer workflows and existing platforms.' }),
            mk('edge-mgmt-zpe',{ name:'ZPE Systems', website:'https://www.zpesystems.com/', logoUrl:fav('https://www.zpesystems.com/'), tagline:'Out-of-band, automation, and secure remote operations', fullDescription:'ZPE Systems enables secure remote operations with out-of-band management, automation, and access controls. Teams remediate issues without on‑site visits. Useful for distributed retail, industrial, and telecom edges where uptime matters.' }),
            mk('edge-mgmt-ntt',{ name:'NTT DATA', website:'https://www.nttdata.com/global/en/', logoUrl:fav('https://www.nttdata.com/'), tagline:'Global services to design, deploy, and operate edge estates', fullDescription:'NTT DATA provides consulting and managed services for edge programs. Offerings span architecture, rollout, and day‑2 operations. Customers leverage global reach and ecosystem partnerships. Focus on measurable outcomes and security.' }),
            mk('edge-mgmt-arm',{ name:'Arm Holdings', website:'https://www.arm.com/', logoUrl:fav('https://www.arm.com/'), tagline:'CPU IP and software ecosystems powering edge compute', fullDescription:'Arm’s CPU architectures and software ecosystems underpin many edge devices and servers. Tooling and partners support power‑efficient, performant solutions. Developers benefit from broad hardware choice and community. Foundational for IoT, gateways, and micro datacenters.' }),
            mk('edge-mgmt-kinara',{ name:'Kinara', website:'https://www.kinara.ai/', logoUrl:fav('https://www.kinara.ai/'), tagline:'Edge AI acceleration for real-time computer vision', fullDescription:'Kinara delivers edge AI accelerators and SDKs for real‑time vision. Customers deploy high‑throughput inference with low power. Tooling simplifies model deployment and tuning. A fit for retail analytics, safety, and industrial inspection.' }),
          ].map(v=>({ ...v, industries, solutions, services }))
        })()
      },
      {
        key:'ai',
        title:'Edge Intelligence, AI & Data Processing',
        vendors:(()=>{
          const industries=['Industrial','Retail','Mobility']
          const solutions=['Edge AI','Inference','Data Pipelines']
          const services=['SDK','Support']
          return [
            mk('edge-ai-ambarella',{ name:'Ambarella', website:'https://www.ambarella.com/', logoUrl:fav('https://www.ambarella.com/'), tagline:'SoCs and CVflow AI for cameras and edge devices', fullDescription:'Ambarella provides SoCs with CVflow AI acceleration for vision at the edge. Devices process video locally to reduce bandwidth and latency. Reference designs speed development. Used in automotive, security, and robotics.' }),
            mk('edge-ai-nvidia',{ name:'NVIDIA (Edge AI)', website:'https://www.nvidia.com/en-us/edge-computing/', logoUrl:fav('https://www.nvidia.com/'), tagline:'Edge AI platforms from Jetson to EGX and Triton', fullDescription:'NVIDIA offers hardware and software stacks for edge AI—from Jetson modules to EGX servers and Triton Inference Server. Developers deploy optimized models with rich tooling. Common across robotics, inspection, and retail analytics.' }),
            mk('edge-ai-edge-impulse',{ name:'Edge Impulse', website:'https://www.edgeimpulse.com/', logoUrl:fav('https://www.edgeimpulse.com/'), tagline:'ML lifecycle platform for embedded and edge devices', fullDescription:'Edge Impulse streamlines data collection, model training, and deployment for embedded ML. Teams build reliable models quickly and deploy to MCUs and Linux. Ideal for sensor intelligence, anomaly detection, and audio/vision.' }),
          ].map(v=>({ ...v, industries, solutions, services }))
        })()
      },
      {
        key:'apps',
        title:'Edge Applications & Industry Use Cases',
        vendors:(()=>{
          const industries=['Manufacturing','Smart Cities','Retail']
          const solutions=['Monitoring','Optimization','Analytics']
          const services=['Integration','Support']
          return [
            mk('edge-apps-edgecell',{ name:'Edgecell', website:'https://edgecell.io/', logoUrl:fav('https://edgecell.io/'), tagline:'Programmable connectivity and application edge', fullDescription:'Edgecell provides a programmable connectivity and application edge for enterprises. Teams deploy services close to devices for better performance. Policy and telemetry improve control. Useful for private networks and industrial estates.' }),
            mk('edge-apps-relayr',{ name:'Relayr (Munich Re)', website:'https://relayr.io/', logoUrl:fav('https://relayr.io/'), tagline:'Outcome-based industrial IoT and reliability solutions', fullDescription:'Relayr delivers outcome-based solutions improving uptime and efficiency. Platforms collect data, analyze performance, and drive actions on site. Backed by Munich Re, models align technology with risk reduction and ROI.' }),
            mk('edge-apps-swim',{ name:'Swim.ai', website:'https://www.swim.ai/', logoUrl:fav('https://www.swim.ai/'), tagline:'Stateful streaming for real-time digital twins', fullDescription:'Swim enables always-on streaming applications that maintain digital twin state in real time. Operators gain continuous insights and complex event handling. Works well for transportation, energy, and smart city operations.' }),
            mk('edge-apps-veea',{ name:'Veea Inc.', website:'https://www.veea.com/', logoUrl:fav('https://www.veea.com/'), tagline:'Edge nodes and platform for secure local services', fullDescription:'Veea offers edge nodes and a platform to run secure local services near users and devices. Solutions support retail, venues, and smart spaces. Focus on simplified deployment, management, and integrations with existing systems.' }),
            mk('edge-apps-davra',{ name:'Davra', website:'https://davra.com/', logoUrl:fav('https://davra.com/'), tagline:'IoT/edge application platform for operations', fullDescription:'Davra provides an application platform to ingest data, build dashboards, and trigger actions at the edge. Teams deliver operational insights with low latency. Used across transport, utilities, and industry to improve safety and efficiency.' }),
          ].map(v=>({ ...v, industries, solutions, services }))
        })()
      }
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🛰️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">Edge Computing</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Operate AI and apps close to devices for low-latency, secure insights</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Platforms, orchestration, and infrastructure to deploy and manage edge workloads at scale.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 25 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {sections.map(sec => (
            <div key={sec.key} className="mb-12">
              <div className="relative my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                <div className="px-4 py-1 rounded-full bg-white border text-cyan-700 font-semibold tracking-wide">{sec.title}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sec.vendors.map(v => (
                  <VendorCard
                    key={v.id}
                    v={v}
                    saved={saved.has(v.id)}
                    onToggleSave={()=> toggleSaveVendor(v)}
                    onRequestDemo={()=> openDemo(v)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
