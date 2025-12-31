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
      <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-sky-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">{x}</span>)}
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
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-cyan-100 to-sky-100 border-2 border-cyan-500">
          <div className="text-sm text-gray-800 leading-6" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '7.5rem' }}>{v.fullDescription || v.about || v.shortDescription || v.tagline}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
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

export default function DigitalTwin(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/digital-twin'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Digital Twin' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/digital-twin'); return }
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
    const mk = (id, data) => ({ id, ...data })
    const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain.replace(/^https?:\/\//,'').replace(/\/$/,'')}&sz=128`
    return [
      {
        key: 'built',
        title: 'Smart Infrastructure & Built Environment',
        vendors: (()=>{
          const industries = ['Smart Buildings','Facilities','Infrastructure']
          const solutions = ['BIM','GIS','Digital Twin']
          const services = ['Implementation','Support']
          return [
          mk('dt-built-cityzenith', {
            name:'Cityzenith', website:'https://www.cityzenith.com/', logoUrl: fav('cityzenith.com'),
            tagline:'Urban-scale twins for buildings and districts',
            fullDescription:'Cityzenith focuses on city and campus-scale digital twins for the built environment. Solutions unify BIM, GIS, IoT, and operational data into a single pane of glass. Teams can analyze carbon impact, simulate scenarios, and coordinate stakeholders. Ideal for owners, operators, and municipalities modernizing portfolios.'
          }),
          mk('dt-built-willow', {
            name:'Willow', website:'https://www.willowinc.com/', logoUrl: fav('willowinc.com'),
            tagline:'Smart building twins for operations and ESG',
            fullDescription:'Willow’s platform creates a living twin of buildings and portfolios. It connects systems, sensors, and assets to deliver actionable insights for operations and sustainability. Owners benefit from improved uptime, energy optimization, and occupant experiences. Deployed across commercial real estate and infrastructure.'
          }),
          mk('dt-built-invicara', {
            name:'Invicara', website:'https://www.invicara.com/', logoUrl: fav('invicara.com'),
            tagline:'Data-powered twins across design, build, operate',
            fullDescription:'Invicara streamlines data through the building lifecycle. By aligning BIM models with asset data, it helps teams transition from construction to operations with integrity. Facilities teams gain reliable, searchable information for maintenance and planning. Designed for owners seeking better handover and lifecycle value.'
          }),
          mk('dt-built-ecodomus', {
            name:'EcoDomus (by Autodesk)', website:'https://ecodomus.com/', logoUrl: fav('ecodomus.com'),
            tagline:'BIM-to-operations data management for twins',
            fullDescription:'EcoDomus specializes in transforming BIM into operational value. It organizes asset information, spaces, and systems to support CMMS and facility workflows. Owners leverage a consistent data model for maintenance, safety, and compliance. Fits portfolios aiming to operationalize construction data at scale.'
          }),
          mk('dt-built-vgis', {
            name:'vGIS', website:'https://vgis.io/', logoUrl: fav('vgis.io'),
            tagline:'AR visualization for GIS, BIM, and asset data',
            fullDescription:'vGIS overlays GIS and BIM models into the real world using AR. Field crews see underground utilities, infrastructure, and design intent on site. Reduces rework, improves safety, and accelerates inspections and as-builts. Useful for utilities, municipalities, and AEC teams.'
          }),
          mk('dt-built-arup-neuron', {
            name:'Arup Neuron', website:'https://www.arup.com/services/digital/neuron', logoUrl: fav('arup.com'),
            tagline:'Digital platform for building performance insights',
            fullDescription:'Arup Neuron connects building systems and data to drive performance. It supports monitoring, optimization, and reporting across energy and comfort. The approach blends engineering expertise with digital tooling. Tailored for complex assets seeking measurable operational outcomes.'
          })
          ].map(v => ({ ...v, industries: v.industries || industries, solutions: v.solutions || solutions, services: v.services || services }))
        })()
      },
      {
        key: 'industrial',
        title: 'Industrial Systems & Manufacturing Operations',
        vendors: (()=>{
          const industries = ['Manufacturing','Energy','Industrial']
          const solutions = ['Predictive Maintenance','Simulation','Optimization']
          const services = ['Integration','Support']
          return [
          mk('dt-ind-cosmotech', { name:'Cosmo Tech', website:'https://www.cosmotech.com/', logoUrl:fav('cosmotech.com'), tagline:'Simulation-based decision intelligence', fullDescription:'Cosmo Tech provides simulation digital twins for complex industrial systems. Teams explore what‑if scenarios across production, supply chain, and maintenance. The platform helps quantify risk and optimize outcomes under uncertainty. Built for operations leaders driving resilient performance.' }),
          mk('dt-ind-twinthread', { name:'TwinThread', website:'https://twinthread.com/', logoUrl:fav('twinthread.com'), tagline:'Operational intelligence for equipment and plants', fullDescription:'TwinThread accelerates insights from industrial data to improve reliability and yield. Prebuilt applications target common use cases like predictive maintenance. Engineers iterate quickly to detect anomalies and act earlier. Good fit for manufacturers seeking time-to-value.' }),
          mk('dt-ind-seebo', { name:'Seebo (Rockwell Automation)', website:'https://www.seebo.com/', logoUrl:fav('seebo.com'), tagline:'Process-centric twins for quality and efficiency', fullDescription:'Seebo models process behavior to pinpoint root causes of losses. By aligning OT data with process graphs, it guides actions that reduce waste and improve OEE. Now part of Rockwell Automation, it complements broader industrial stacks. Designed for continuous improvement teams.' }),
          mk('dt-ind-thingworx', { name:'PTC ThingWorx', website:'https://www.ptc.com/en/products/thingworx', logoUrl:fav('ptc.com'), tagline:'Industrial IoT platform for scalable twins', fullDescription:'ThingWorx connects assets, aggregates telemetry, and powers industrial applications. Combine with Kepware, Vuforia, and Windchill for end-to-end value. Manufacturers deploy dashboards, alerts, and AR guidance at scale. Suited for organizations standardizing on PTC ecosystems.' }),
          mk('dt-ind-akselos', { name:'Akselos', website:'https://www.akselos.com/', logoUrl:fav('akselos.com'), tagline:'Physics-based models for critical assets', fullDescription:'Akselos builds high-fidelity digital models to assess structural integrity. Physics-informed insights help predict fatigue and optimize maintenance. Used across energy and heavy industry for safety and life extension. Ideal where accuracy and speed both matter.' }),
          mk('dt-ind-ansys', { name:'ANSYS Twin Builder', website:'https://www.ansys.com/products/digital-twin', logoUrl:fav('ansys.com'), tagline:'Model-based engineering and predictive twins', fullDescription:'ANSYS Twin Builder supports system-level modeling and simulation. Engineers validate design choices and predict performance throughout lifecycle. Coupled with analytics, teams reduce prototypes and accelerate delivery. Appropriate for complex equipment and systems.' })
          ].map(v => ({ ...v, industries: v.industries || industries, solutions: v.solutions || solutions, services: v.services || services }))
        })()
      },
      {
        key: 'urban',
        title: 'Urban Mobility & Environmental Simulation',
        vendors: (()=>{
          const industries = ['Cities','Transportation','Environment']
          const solutions = ['3D City','Mobility Analytics','Simulation']
          const services = ['Consulting','Support']
          return [
          mk('dt-urb-nomoko', { name:'Nomoko', website:'https://www.nomoko.xyz/', logoUrl:fav('nomoko.xyz'), tagline:'High-fidelity 3D twins of cities and assets', fullDescription:'Nomoko creates photorealistic 3D twins for urban planning and real estate. Accurate context supports site analysis, communication, and design. Stakeholders explore scenarios with a shared spatial foundation. Useful across municipalities, developers, and AEC firms.' }),
          mk('dt-urb-cityscape', { name:'CityScape Digital', website:'https://cityscapedigital.com/', logoUrl:fav('cityscapedigital.com'), tagline:'Visualization for planning and public engagement', fullDescription:'CityScape Digital delivers visualizations and twins that clarify complex developments. Helps communicate impact, sightlines, and massing with stakeholders. Supports planning approvals and community understanding. Common in large urban regeneration projects.' }),
          mk('dt-urb-virtualcity', { name:'Virtual City Systems', website:'https://www.virtualcitysystems.de/', logoUrl:fav('virtualcitysystems.de'), tagline:'3D geospatial platforms for urban data', fullDescription:'Virtual City Systems provides 3D city platforms for managing geospatial datasets. Integrates models, terrain, and semantics to support urban operations. Open standards and APIs enable interoperability with existing tools. Targeted to cities and utilities with rich spatial data.' }),
          mk('dt-urb-51world', { name:'51World', website:'https://www.51.world/', logoUrl:fav('51.world'), tagline:'Digital twins for city-scale simulation and ops', fullDescription:'51World builds large-scale twins for smart city operations and simulation. Data fusion allows traffic, environment, and asset monitoring. Operators visualize states and test changes before rollouts. Deployed for urban management and infrastructure planning.' }),
          mk('dt-urb-mainblades', { name:'Mainblades', website:'https://www.mainblades.com/', logoUrl:fav('mainblades.com'), tagline:'Automated aircraft inspection and reporting', fullDescription:'Mainblades uses drones and AI for aircraft inspection with digital twin outputs. Inspections become faster and more consistent, with traceable records. Airlines and MROs reduce downtime and improve safety. A focused twin use case in aviation operations.' }),
          mk('dt-urb-airsage', { name:'AirSage', website:'https://www.airsage.com/', logoUrl:fav('airsage.com'), tagline:'Mobility intelligence from anonymized signals', fullDescription:'AirSage provides population movement analytics to inform planning. Insights support transportation, retail, and public sector decisions. When combined with digital twins, data helps stress-test designs. Enables evidence-based urban mobility strategies.' })
          ].map(v => ({ ...v, industries: v.industries || industries, solutions: v.solutions || solutions, services: v.services || services }))
        })()
      },
      {
        key: 'ai',
        title: 'AI-Driven Modeling & Integration Platforms',
        vendors: (()=>{
          const industries = ['Industrial','AEC','Logistics']
          const solutions = ['Synthetic Data','Simulation','Analytics']
          const services = ['Platform','Support']
          return [
          mk('dt-ai-cognite', { name:'Cognite', website:'https://www.cognite.com/', logoUrl:fav('cognite.com'), tagline:'Industrial data foundation with AI applications', fullDescription:'Cognite Data Fusion organizes OT/IT data for industrial AI at scale. Contextualization links assets, signals, and documents to accelerate use cases. Operators deploy monitoring, optimization, and autonomy patterns faster. Built for heavy industry modernization.' }),
          mk('dt-ai-blackshark', { name:'blackshark.ai', website:'https://blackshark.ai/', logoUrl:fav('blackshark.ai'), tagline:'AI-generated 3D from satellite and aerial data', fullDescription:'blackshark.ai reconstructs large-scale 3D environments using computer vision. The platform enables realistic, up-to-date digital twins of the planet. Developers and enterprises embed results in simulation and planning. Useful for defense, logistics, and mapping.' }),
          mk('dt-ai-mindtech', { name:'Mindtech Global', website:'https://mindtech.global/', logoUrl:fav('mindtech.global'), tagline:'Synthetic data for computer vision models', fullDescription:'Mindtech’s platform creates synthetic, annotated scenes to train CV models. Teams produce diverse datasets that are hard to capture in the real world. Improves model robustness and speeds iteration cycles. Supports retail, smart cities, and automation use cases.' }),
          mk('dt-ai-prevu3d', { name:'Prevu3D', website:'https://prevu3d.com/', logoUrl:fav('prevu3d.com'), tagline:'Reality capture and collaborative 3D workspaces', fullDescription:'Prevu3D turns scans into interactive 3D spaces for planning and collaboration. Teams measure, annotate, and simulate changes before on-site work. Reduces travel and speeds alignment across stakeholders. Effective in factories, logistics, and facilities.' }),
          mk('dt-ai-duality', { name:'Duality AI', website:'https://www.duality.ai/', logoUrl:fav('duality.ai'), tagline:'High-fidelity simulation and synthetic data', fullDescription:'Duality provides physics-accurate environments for testing AI agents and robotics. Digital twins become safe sandboxes to evaluate edge cases. Synthetic data improves perception and decision systems. Ideal for autonomy, inspection, and digital factory pilots.' }),
          mk('dt-ai-numina', { name:'Numina', website:'https://numina.co/', logoUrl:fav('numina.co'), tagline:'Street-level intelligence for people and mobility', fullDescription:'Numina uses computer vision to understand movement in streets and public spaces. Privacy-by-design insights support planning and safer streets. Trends feed into digital twins for scenario testing and measurement. Useful for DOTs, planners, and campus operators.' })
          ].map(v => ({ ...v, industries: v.industries || industries, solutions: v.solutions || solutions, services: v.services || services }))
        })()
      }
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🔄</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">Digital Twin</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Virtual replicas and simulations</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore sub topics from Smart Infrastructure & Built Environment, Industrial Systems & Manufacturing Operations, Urban Mobility & Environmental Simulation and AI-Driven Modeling & Integration Platforms</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
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
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
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
