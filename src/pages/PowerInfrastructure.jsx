import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20">
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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PowerInfrastructure(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/power-infrastructure'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Power Infrastructure' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/power-infrastructure'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(form){
    if (!currentUser || !demoVendor) return
    await createDemoRequest({ userId: currentUser.uid, vendorId: String(demoVendor.id), formData: form, status: 'pending' })
    setDemoOpen(false)
    setDemoVendor(null)
  }

  const sections = useMemo(()=>{
    const mk = (id, d) => ({ id, ...d })
    const fav = (url) => `https://www.google.com/s2/favicons?domain=${url.replace(/^https?:\/\//,'').replace(/\/$/,'')}&sz=128`
    return [
      {
        key:'smart-grids',
        title:'Smart Grids & Energy Storage Systems',
        vendors:[
          mk('pwr-sg-form',{ name:'Form Energy', website:'https://formenergy.com/', logoUrl:fav('https://formenergy.com/'), tagline:'Multi-day storage for reliable clean energy', fullDescription:'Form Energy develops multi-day energy storage systems designed to balance renewable-heavy grids. Long-duration storage helps utilities improve reliability and reduce emissions. Projects target system resilience and cost-effective decarbonization.' }),
          mk('pwr-sg-enervenue',{ name:'EnerVenue', website:'https://enervenue.com/', logoUrl:fav('https://enervenue.com/'), tagline:'Nickel-hydrogen stationary storage platform', fullDescription:'EnerVenue offers nickel-hydrogen battery systems for stationary storage applications. Technology emphasizes long life, wide temperature tolerance, and low maintenance. Solutions suit utility, C&I, and microgrid deployments.' }),
          mk('pwr-sg-antora',{ name:'Antora Energy', website:'https://www.antoraenergy.com/', logoUrl:fav('https://www.antoraenergy.com/'), tagline:'Thermal batteries for industrial decarbonization', fullDescription:'Antora Energy builds thermal battery systems that store renewable energy as heat and deliver electricity or process heat on demand. This approach targets hard-to-abate industrial loads and improves energy flexibility.' }),
          mk('pwr-sg-pila',{ name:'Pila Energy', website:'https://pilaenergy.com/', logoUrl:fav('https://pilaenergy.com/'), tagline:'Advanced storage for distributed energy systems', fullDescription:'Pila Energy develops energy storage solutions aimed at distributed and resilient power. Systems integrate with solar and microgrids to enable peak shaving and backup. Operators gain reliability and cost optimization.' }),
          mk('pwr-sg-evault',{ name:'Energy Vault', website:'https://energyvault.com/', logoUrl:fav('https://energyvault.com/'), tagline:'Gravity-based and battery storage systems', fullDescription:'Energy Vault provides gravity and battery-based storage platforms with software orchestration. Projects enhance grid flexibility, renewable integration, and frequency response. Customers pursue decarbonization with bankable systems.' }),
        ]
      },
      {
        key:'ups',
        title:'UPS & Power Management Hardware',
        vendors:[
          mk('pwr-ups-eaton',{ name:'Eaton Corporation', website:'https://www.eaton.com/us/en-us/products/backup-power-ups-surge-it-power-distribution.html', logoUrl:fav('https://www.eaton.com/'), tagline:'UPS, PDUs, and power quality solutions', fullDescription:'Eaton provides UPS systems, PDUs, and surge protection for IT and industrial environments. Offerings address uptime, power quality, and scalability. Integration and monitoring tools support data centers and edge sites.' }),
          mk('pwr-ups-vertiv',{ name:'Vertiv Group', website:'https://www.vertiv.com/en-us/products-catalog/ups-power-management/', logoUrl:fav('https://www.vertiv.com/'), tagline:'Critical infrastructure for digital continuity', fullDescription:'Vertiv delivers UPS, power distribution, and thermal solutions for data centers and telecom. Platforms focus on resilience, efficiency, and lifecycle services. Enterprises rely on Vertiv for mission-critical continuity.' }),
          mk('pwr-ups-schneider',{ name:'Schneider Electric', website:'https://www.se.com/us/en/work/solutions/for-business/data-centers-and-networks/ups-power-supply/', logoUrl:fav('https://www.se.com/'), tagline:'End-to-end power and infrastructure', fullDescription:'Schneider Electric offers UPS, power distribution, and management software across scales. EcoStruxure enables monitoring, automation, and optimization. Solutions span data centers, buildings, and industrial sites.' }),
          mk('pwr-ups-apc',{ name:'APC by Schneider Electric', website:'https://www.apc.com/us/en/', logoUrl:fav('https://www.apc.com/'), tagline:'Rack power, UPS, and edge infrastructure', fullDescription:'APC provides racks, UPS, and edge-ready enclosures with integrated cooling and monitoring. Solutions simplify deployment for branch, closet, and micro data center use cases. Global availability supports standardized rollouts.' }),
          mk('pwr-ups-tripplite',{ name:'Tripp Lite', website:'https://www.tripplite.com/', logoUrl:fav('https://www.tripplite.com/'), tagline:'Power protection and distribution', fullDescription:'Tripp Lite (by Eaton) focuses on surge protection, UPS, and power distribution. Broad catalog supports office, lab, and server environments. Customers balance cost, reliability, and ease of deployment.' }),
        ]
      },
      {
        key:'cooling',
        title:'Cooling Systems (Liquid, Immersion, HVAC)',
        vendors:[
          mk('pwr-cl-liquidstack',{ name:'LiquidStack', website:'https://liquidstack.com/', logoUrl:fav('https://liquidstack.com/'), tagline:'Two-phase immersion cooling for data centers', fullDescription:'LiquidStack provides two-phase immersion cooling systems that increase density and reduce energy use. Platforms target high-performance compute and edge. Operators improve PUE while enabling compact deployments.' }),
          mk('pwr-cl-submer',{ name:'Submer Technologies', website:'https://submer.com/', logoUrl:fav('https://submer.com/'), tagline:'Immersion cooling and turnkey pods', fullDescription:'Submer delivers immersion cooling solutions and modular pods for data centers. Benefits include higher density, lower noise, and improved efficiency. Tooling and services streamline design and rollout.' }),
          mk('pwr-cl-grc',{ name:'Green Revolution Cooling', website:'https://grcooling.com/', logoUrl:fav('https://grcooling.com/'), tagline:'Single-phase immersion cooling platforms', fullDescription:'GRC offers single-phase immersion cooling systems for HPC and enterprise. Solutions reduce energy costs and extend equipment life. Partners and references support predictable adoption.' }),
          mk('pwr-cl-asetek',{ name:'Asetek', website:'https://www.asetek.com/', logoUrl:fav('https://www.asetek.com/'), tagline:'Liquid cooling for servers and HPC', fullDescription:'Asetek develops liquid cooling technology for servers and HPC deployments. Designs aim for reliability, maintainability, and performance per watt. OEM integrations support standardization across fleets.' }),
          mk('pwr-cl-aewin',{ name:'AEWIN Technologies', website:'https://www.aewin.com/', logoUrl:fav('https://www.aewin.com/'), tagline:'Industrial platforms and thermal designs', fullDescription:'AEWIN provides industrial compute platforms and thermal solutions. Offerings include rugged servers and custom designs. Customers address harsh environments and specialized cooling needs.' }),
        ]
      },
      {
        key:'solar',
        title:'Solar & Renewable Hardware Integration',
        vendors:[
          mk('pwr-sr-array',{ name:'Array Technologies', website:'https://arraytechinc.com/', logoUrl:fav('https://arraytechinc.com/'), tagline:'Solar trackers for utility-scale plants', fullDescription:'Array Technologies manufactures solar tracking systems that increase energy yield. Rugged designs and controls reduce O&M costs. Utilities deploy at scale for predictable performance and bankability.' }),
          mk('pwr-sr-ironridge',{ name:'IronRidge', website:'https://www.ironridge.com/', logoUrl:fav('https://www.ironridge.com/'), tagline:'Mounting and racking for solar', fullDescription:'IronRidge provides mounting and racking solutions for commercial and residential solar. Systems are engineered for code compliance and long-term durability. Installers benefit from standardized components and tools.' }),
          mk('pwr-sr-ecofasten',{ name:'EcoFasten', website:'https://ecofasten.com/', logoUrl:fav('https://ecofasten.com/'), tagline:'Roof attachments and mounting hardware', fullDescription:'EcoFasten supplies roof attachments and mounting hardware that speed installs and protect roofs. Product lines address diverse roof types. Integrators reduce install time and callbacks.' }),
          mk('pwr-sr-sunfolding',{ name:'Sunfolding', website:'https://sunfolding.com/', logoUrl:fav('https://sunfolding.com/'), tagline:'Simplified single-axis trackers', fullDescription:'Sunfolding builds single-axis trackers with air-driven actuators, reducing parts and maintenance. Designs target cost, reliability, and speed of construction. Projects achieve competitive LCOE at utility scale.' }),
          mk('pwr-sr-tabuchi',{ name:'Tabuchi Electric', website:'https://www.tabuchicamerica.com/', logoUrl:fav('https://www.tabuchicamerica.com/'), tagline:'Inverters and storage-ready solutions', fullDescription:'Tabuchi Electric offers inverters and integrated storage-ready systems for homes and small C&I. Solutions emphasize reliability, efficiency, and straightforward installation. Channel support aids project delivery.' }),
        ]
      },
      {
        key:'microgrid',
        title:'Microgrid & Building Energy Controllers',
        vendors:[
          mk('pwr-mg-schneider',{ name:'Schneider Electric', website:'https://www.se.com/us/en/work/solutions/for-business/buildings/microgrid/', logoUrl:fav('https://www.se.com/'), tagline:'Microgrid controls and building energy management', fullDescription:'Schneider Electric provides microgrid controls, building automation, and energy management under EcoStruxure. Solutions optimize distributed assets, resilience, and operating costs across sites.' }),
          mk('pwr-mg-siemens',{ name:'Siemens AG', website:'https://www.siemens.com/global/en/products/energy/energy-automation-and-smart-grid/microgrid.html', logoUrl:fav('https://www.siemens.com/'), tagline:'Grid automation and microgrid platforms', fullDescription:'Siemens offers grid automation, DERMS, and microgrid platforms that coordinate distributed resources. Utilities and campuses enhance reliability, sustainability, and flexibility with integrated systems.' }),
          mk('pwr-mg-abb',{ name:'ABB Ltd.', website:'https://new.abb.com/distributed-energy/microgrids', logoUrl:fav('https://new.abb.com/'), tagline:'Distributed energy controllers and systems', fullDescription:'ABB delivers distributed energy and microgrid controllers with protection and automation. Solutions support islanding, black start, and seamless transition. Operators manage energy flows with robust tooling.' }),
          mk('pwr-mg-honeywell',{ name:'Honeywell International', website:'https://buildings.honeywell.com/us/en/solutions/sustainability/microgrid', logoUrl:fav('https://buildings.honeywell.com/'), tagline:'Building-level automation and energy control', fullDescription:'Honeywell provides building automation and microgrid solutions to reduce energy use and emissions. Platforms integrate HVAC, metering, and DERs. Enterprises pursue sustainability and resilience goals.' }),
          mk('pwr-mg-xendee',{ name:'Xendee Corporation', website:'https://xendee.com/', logoUrl:fav('https://xendee.com/'), tagline:'Design and operation platform for microgrids', fullDescription:'Xendee offers software for design and optimization of microgrids, including techno-economic modeling. Planners evaluate configurations, costs, and emissions. Tools support lifecycle decisions from design to operations.' }),
        ]
      },
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">⚡</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">Power & Infrastructure</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Smart grids, energy storage, UPS, cooling, renewables, and microgrids</div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {sections.map(sec => (
            <div key={sec.key} className="mb-12">
              <div className="relative my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">{sec.title}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
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
