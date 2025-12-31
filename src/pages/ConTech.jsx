'use client'


import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

import { useRouter } from 'next/navigation'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-orange-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
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
        {Array.isArray(v.industries) && v.industries.length>0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-800 mb-2">Industries</div>
            <div className="flex flex-wrap gap-2">
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConTech(){
  const router = useRouter()
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
    if (!currentUser){ router.push('/login?redirect=/discover/contech'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'ConTech' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/contech'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(payload){
    console.log('Demo request submitted:', payload)
    setDemoOpen(false)
  }

  const ecosystems = useMemo(()=>{
    const mk = (i, data) => ({ id:`ce-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Autodesk Construction Cloud', tagline:'Connected construction across teams and workflows', industries:['General Contractors','Owners'], solutions:['Docs','Build','Cost'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=construction.autodesk.com&sz=128', website:'https://construction.autodesk.com/', fullDescription:'Autodesk Construction Cloud unifies design through operations with connected document control, field management, cost, and coordination tools for large teams.' }),
      mk(2,{ name:'Procore', tagline:'Enterprise construction management platform', industries:['General Contractors'], solutions:['Project Mgmt','BIM','Quality & Safety'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=procore.com&sz=128', website:'https://www.procore.com/', fullDescription:'Procore centralizes RFIs, drawings, submittals, punch lists, and BIM coordination to improve collaboration and delivery on complex projects.' }),
      mk(3,{ name:'Trimble (Construction)', tagline:'Connected construction and positioning tech', industries:['Contractors','Survey'], solutions:['Project Controls','Positioning'], services:['Hardware','Software'], logoUrl:'https://www.google.com/s2/favicons?domain=construction.trimble.com&sz=128', website:'https://construction.trimble.com/', fullDescription:'Trimble connects field and office with positioning hardware, design tools, and project controls to increase accuracy and productivity.' }),
      mk(4,{ name:'Bentley Systems', tagline:'Infrastructure engineering software', industries:['Infrastructure'], solutions:['Digital Twins','Modeling'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=bentley.com&sz=128', website:'https://www.bentley.com/', fullDescription:'Bentley powers infrastructure design and operations with open modeling, simulation, and digital twin platforms for lifecycle performance.' }),
      mk(5,{ name:'Oracle Construction & Engineering', tagline:'Project delivery and portfolio management', industries:['Owners','EPC'], solutions:['Primavera','Unifier'], services:['Cloud','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=oracle.com&sz=128', website:'https://www.oracle.com/industries/construction-engineering/', fullDescription:'Oracle CE delivers portfolio, schedule, and cost controls for capital programs—improving predictability across owners and EPCs.' }),
      mk(6,{ name:'Hexagon (Geosystems)', tagline:'Reality capture and geospatial intelligence', industries:['Survey','Construction'], solutions:['Scanning','Positioning'], services:['Hardware','Software'], logoUrl:'https://www.google.com/s2/favicons?domain=hexagon.com&sz=128', website:'https://hexagon.com/', fullDescription:'Hexagon provides laser scanning, GNSS, and geospatial platforms to capture reality data and improve construction accuracy and verification.' }),
      mk(7,{ name:'Asite', tagline:'Common data environment and collaboration', industries:['Owners','Contractors'], solutions:['CDE','Workflow'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=asite.com&sz=128', website:'https://www.asite.com/', fullDescription:'Asite offers a secure CDE with workflow automation, forms, and data federation to unify project information across teams.' }),
      mk(8,{ name:'Revizto', tagline:'Unified coordination and issue tracking', industries:['VDC','BIM'], solutions:['Clash & Issues','VR'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=revizto.com&sz=128', website:'https://revizto.com/', fullDescription:'Revizto enables multi‑discipline coordination with issues, clash, and VR contexts in an accessible interface for field and office.' }),
    ]
  }, [])

  const robotics = useMemo(()=>{
    const mk = (i, data) => ({ id:`ar-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Built Robotics', tagline:'Autonomous construction equipment', industries:['Earthworks'], solutions:['Autonomy Kits'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=builtrobotics.com&sz=128', website:'https://www.builtrobotics.com/', fullDescription:'Built Robotics retrofits heavy equipment with autonomy for trenching and earthmoving, improving productivity and safety on site.' }),
      mk(2,{ name:'Komatsu', tagline:'Smart construction and equipment', industries:['Heavy Civil'], solutions:['Autonomous','Smart Construction'], services:['Hardware','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=komatsu.com&sz=128', website:'https://www.komatsu.com/', fullDescription:'Komatsu integrates intelligent machines, drones, and data platforms to optimize jobsite productivity and quality.' }),
      mk(3,{ name:'Caterpillar (Construction)', tagline:'Connected fleets and equipment tech', industries:['Heavy Civil'], solutions:['Autonomy','Telematics'], services:['Hardware','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=cat.com&sz=128', website:'https://www.cat.com/', fullDescription:'Caterpillar delivers connected equipment, autonomy pilots, and robust telematics for safer, more efficient operations.' }),
      mk(4,{ name:'Boston Dynamics', tagline:'Mobile robots for inspections and progress', industries:['Industrial','Construction'], solutions:['Spot','Inspection'], services:['Robotics','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=bostondynamics.com&sz=128', website:'https://www.bostondynamics.com/', fullDescription:'Boston Dynamics’ Spot automates routine inspections and captures reality data, improving safety and consistency of site documentation.' }),
      mk(5,{ name:'COBOD', tagline:'Large‑scale 3D printing for construction', industries:['Housing','Industrial'], solutions:['3D Printers'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=cobod.com&sz=128', website:'https://cobod.com/', fullDescription:'COBOD builds gantry 3D printers for large structures, enabling faster construction and reduced waste.' }),
      mk(6,{ name:'ICON', tagline:'3D printed homes and systems', industries:['Housing'], solutions:['Printers','Materials'], services:['Delivery','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=iconbuild.com&sz=128', website:'https://www.iconbuild.com/', fullDescription:'ICON develops 3D printing systems and materials to deliver resilient, affordable housing with rapid deployment.' }),
      mk(7,{ name:'Apis Cor', tagline:'Mobile 3D printing robotics', industries:['Housing'], solutions:['Printers'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=apis-cor.com&sz=128', website:'https://apis-cor.com/', fullDescription:'Apis Cor offers portable 3D printing robots to fabricate building shells on site, reducing manual labor and timelines.' }),
      mk(8,{ name:'Sarcos Robotics', tagline:'Robotic systems and exoskeletons', industries:['Industrial','Construction'], solutions:['Robotics','Safety'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=sarcos.com&sz=128', website:'https://www.sarcos.com/', fullDescription:'Sarcos builds robotic systems and wearable solutions to augment workers and automate hazardous tasks in the field.' }),
    ]
  }, [])

  const materials = useMemo(()=>{
    const mk = (i, data) => ({ id:`sm-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'CarbonCure', tagline:'Low‑carbon concrete via CO₂ mineralization', industries:['Ready‑Mix'], solutions:['CO₂ Injection'], services:['Tech Licensing','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=carboncure.com&sz=128', website:'https://www.carboncure.com/', fullDescription:'CarbonCure reduces concrete’s carbon footprint by injecting CO₂ into fresh concrete, improving strength and enabling cement reduction.' }),
      mk(2,{ name:'Holcim', tagline:'Sustainable building materials and solutions', industries:['Materials'], solutions:['Low‑carbon Cement','Recycling'], services:['Delivery','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=holcim.com&sz=128', website:'https://www.holcim.com/', fullDescription:'Holcim delivers low‑carbon cement, recycled aggregates, and circular construction solutions to decarbonize the built environment.' }),
      mk(3,{ name:'CRH', tagline:'Global building materials leader', industries:['Materials'], solutions:['Cement','Aggregates','Asphalt'], services:['Delivery','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=crh.com&sz=128', website:'https://www.crh.com/', fullDescription:'CRH supplies cement, aggregates, and asphalt with sustainability programs to lower embodied carbon and improve performance.' }),
      mk(4,{ name:'Kingspan', tagline:'High‑performance insulation and envelopes', industries:['Buildings'], solutions:['Insulation','Envelope'], services:['Advisory','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=kingspan.com&sz=128', website:'https://www.kingspan.com/', fullDescription:'Kingspan provides advanced insulation and envelope systems for energy‑efficient, sustainable buildings.' }),
      mk(5,{ name:'HeidelbergCement', tagline:'Decarbonizing cement and concrete', industries:['Materials'], solutions:['Low‑carbon Cement'], services:['Delivery','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=heidelbergmaterials.com&sz=128', website:'https://www.heidelbergmaterials.com/', fullDescription:'Heidelberg Materials advances low‑carbon cement, CCUS initiatives, and circularity to reduce the footprint of concrete.' }),
      mk(6,{ name:'Ecocem', tagline:'Low‑carbon cements and SCMs', industries:['Materials'], solutions:['GGBS','CemSolutions'], services:['Supply','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ecocem.com&sz=128', website:'https://www.ecocem.com/', fullDescription:'Ecocem develops low‑carbon cement technologies using supplementary cementitious materials to achieve significant CO₂ reductions.' }),
      mk(7,{ name:'Interface', tagline:'Sustainable flooring systems', industries:['Interiors'], solutions:['Carpet Tile','LVT'], services:['Recycling','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=interface.com&sz=128', website:'https://www.interface.com/', fullDescription:'Interface delivers carbon‑negative flooring options and take‑back programs, advancing circularity in interior finishes.' }),
    ]
  }, [])

  const immersive = useMemo(()=>{
    const mk = (i, data) => ({ id:`im-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Autodesk (Revit)', tagline:'BIM authoring for building design', industries:['AEC'], solutions:['BIM'], services:['Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=autodesk.com&sz=128', website:'https://www.autodesk.com/products/revit/overview', fullDescription:'Revit supports BIM across architecture, MEP, and structures with coordinated modeling and documentation for lifecycle integration.' }),
      mk(2,{ name:'Bentley Systems (SYNCHRO)', tagline:'4D construction planning and control', industries:['Infrastructure','Buildings'], solutions:['4D Planning','Controls'], services:['Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=bentley.com&sz=128', website:'https://www.bentley.com/software/synchro/', fullDescription:'SYNCHRO connects models, schedules, and cost for 4D planning and project controls—improving visibility and delivery.' }),
      mk(3,{ name:'Revizto', tagline:'Real‑time model coordination and VR', industries:['AEC'], solutions:['Coordination','VR'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=revizto.com&sz=128', website:'https://revizto.com/', fullDescription:'Revizto unifies coordination and issue tracking with VR contexts to connect design, VDC, and field teams.' }),
      mk(4,{ name:'Unity (Industry)', tagline:'Real‑time 3D for digital twins and training', industries:['AEC','Manufacturing'], solutions:['RT3D','Digital Twin'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=unity.com&sz=128', website:'https://unity.com/solutions/industry', fullDescription:'Unity Industry powers immersive visualization, simulation, and digital twins for design reviews, field guidance, and training.' }),
      mk(5,{ name:'Matterport', tagline:'3D capture and digital twins of spaces', industries:['AEC','Facilities'], solutions:['Capture','Digital Twin'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=matterport.com&sz=128', website:'https://matterport.com/', fullDescription:'Matterport captures spaces into shareable digital twins for facilities, documentation, and collaboration across the lifecycle.' }),
      mk(6,{ name:'Trimble (SketchUp)', tagline:'Intuitive 3D design for AEC', industries:['AEC'], solutions:['Modeling'], services:['Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=sketchup.com&sz=128', website:'https://www.sketchup.com/', fullDescription:'SketchUp accelerates early‑stage design and coordination with accessible modeling and a vast ecosystem of components.' }),
      mk(7,{ name:'Asite', tagline:'Lifecycle collaboration and CDE', industries:['Owners','AEC'], solutions:['CDE','Workflow'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=asite.com&sz=128', website:'https://www.asite.com/', fullDescription:'Asite CDE and workflows integrate with BIM processes, supporting lifecycle data continuity and collaboration.' }),
      mk(8,{ name:'Autodesk (Navisworks)', tagline:'Model aggregation and clash detection', industries:['AEC'], solutions:['Clash','Review'], services:['Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=autodesk.com&sz=128', website:'https://www.autodesk.com/products/navisworks/overview', fullDescription:'Navisworks aggregates models for coordination, clash detection, and 4D simulation—connecting design and construction planning.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`startup-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'ICON', tagline:'Advanced 3D printing for construction', industries:['Housing','Commercial'], solutions:['3D Printing','Materials'], services:['Delivery','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=iconbuild.com&sz=128', website:'https://iconbuild.com/materials', fullDescription:'ICON develops advanced construction technologies including robotic 3D printing systems and proprietary materials. Their Vulcan printer can construct entire homes and structures with precision and speed. Lavacrete material provides durability and thermal performance while reducing waste. Pioneering scalable solutions for affordable housing, disaster relief, and sustainable construction with reduced labor requirements and environmental impact.' }),
      mk(2,{ name:'Kojo', tagline:'Materials procurement and tracking platform', industries:['General Contractors','Specialty'], solutions:['Procurement','Tracking','Analytics'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=usekojo.com&sz=128', website:'https://www.usekojo.com/', fullDescription:'Kojo streamlines construction materials procurement with centralized ordering, delivery tracking, and spend analytics. Platform connects field teams, project managers, and suppliers to eliminate manual processes and reduce material delays. Real-time visibility into orders, deliveries, and costs helps teams stay on schedule and budget. Integrates with accounting and project management systems to provide end-to-end procurement intelligence and control.' }),
      mk(3,{ name:'Howie', tagline:'AI-powered construction project intelligence', industries:['General Contractors'], solutions:['AI Analytics','Project Intelligence'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=howie.systems&sz=128', website:'https://howie.systems', fullDescription:'Howie uses artificial intelligence to analyze construction project data and provide actionable insights for better decision-making. Platform ingests data from multiple sources including schedules, RFIs, submittals, and daily reports to identify risks and opportunities. Predictive analytics help teams anticipate delays, cost overruns, and quality issues before they occur. Natural language interface makes complex project intelligence accessible to all team members regardless of technical expertise.' }),
      mk(4,{ name:'Track3D', tagline:'AI-powered progress tracking from photos', industries:['General Contractors','Owners'], solutions:['Progress Tracking','AI Vision'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=track3d.ai&sz=128', website:'https://track3d.ai/', fullDescription:'Track3D leverages computer vision and AI to automatically track construction progress from standard photos and videos. Technology compares site conditions against BIM models and schedules to measure completion percentages and identify variances. Eliminates manual progress reporting and provides objective, data-driven insights for project stakeholders. Helps teams verify contractor pay applications, identify delays early, and maintain accurate project records with minimal effort.' }),
      mk(5,{ name:'PlanHub', tagline:'Preconstruction and bid management platform', industries:['General Contractors','Subcontractors'], solutions:['Bid Management','Preconstruction'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=planhub.com&sz=128', website:'https://planhub.com/', fullDescription:'PlanHub connects contractors and subcontractors through a cloud-based preconstruction and bid management platform. Streamlines the entire bidding process from project discovery to bid submission and award. Contractors can manage invitations, track responses, and compare bids in one centralized location. Subcontractors gain access to more opportunities and can respond to bids faster with integrated takeoff and estimating tools that improve win rates.' }),
      mk(6,{ name:'Briq', tagline:'Financial intelligence for construction', industries:['General Contractors','Specialty'], solutions:['Financial Analytics','Forecasting'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=briq.ai&sz=128', website:'https://briq.ai/', fullDescription:'Briq provides financial intelligence and automation for construction companies to improve profitability and cash flow. Platform aggregates data from accounting, project management, and operational systems to deliver real-time financial insights. Automated forecasting and scenario planning help teams make informed decisions about resource allocation and project selection. Reduces manual financial reporting time while increasing accuracy and visibility into company and project-level performance metrics.' }),
      mk(7,{ name:'Built', tagline:'Construction finance and payment automation', industries:['General Contractors','Lenders'], solutions:['Payment Automation','Lien Waivers'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=getbuilt.com&sz=128', website:'https://getbuilt.com/', fullDescription:'Built modernizes construction lending and payment processes with automated draw management and compliance tracking. Platform connects owners, lenders, general contractors, and subcontractors to streamline payment workflows and reduce risk. Automated lien waiver collection and verification ensures compliance while speeding up payment cycles. Real-time visibility into project budgets, draws, and payments improves cash flow management and reduces disputes across all project stakeholders.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🏗️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">ConTech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Robotics, BIM, materials, and lifecycle platforms</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore intelligent construction ecosystems, autonomous robotics, sustainable materials, and immersive lifecycle tools.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#ce" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 1 — Intelligent Construction Ecosystems */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-semibold tracking-wide">Intelligent Construction Ecosystems</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="ce" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ecosystems.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Automated Building & Robotics Revolution */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-semibold tracking-wide">Automated Building & Robotics Revolution</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="ar" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {robotics.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Sustainable Materials & Smart Infrastructure */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-semibold tracking-wide">Sustainable Materials & Smart Infrastructure</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="sm" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {materials.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Immersive Design & Lifecycle Integration */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-semibold tracking-wide">Immersive Design & Lifecycle Integration</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="im" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {immersive.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Startups to Watch */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-purple-700 font-semibold tracking-wide">Startups to Watch</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="startups" className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {startups.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}

