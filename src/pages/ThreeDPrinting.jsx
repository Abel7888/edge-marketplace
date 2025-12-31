'use client'


import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

import { useRouter } from 'next/navigation'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-fuchsia-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-fuchsia-50 to-pink-50 border-2 border-fuchsia-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-fuchsia-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ThreeDPrinting(){
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
    if (!currentUser){ router.push('/login?redirect=/discover/3d-printing'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: '3D Printing' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/3d-printing'); return }
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
    const mk = (id, d) => ({ id, rating:4.7, reviewCount:80, successRate:93, responseTime:'< 4 hours', ...d })
    const fav = (url) => `https://www.google.com/s2/favicons?domain=${url.replace(/^https?:\/\//,'').replace(/\/$/,'')}&sz=128`
    return [
      {
        key:'industrial',
        title:'Industrial-Grade 3D Printers (Metal, Polymer, Composite, Ceramic)',
        vendors:[
          mk('3dp-ind-3dsystems',{ name:'3D Systems', website:'https://www.3dsystems.com/', logoUrl:fav('https://www.3dsystems.com/'), tagline:'Pioneers of industrial additive manufacturing platforms', fullDescription:'3D Systems delivers production‑grade printers across metals, polymers, and composites with validated materials and workflows. Factories adopt for end‑use parts, tooling, and medical devices. Software and services streamline design‑to‑manufacture. Proven reliability at global scale.' }),
          mk('3dp-ind-eos',{ name:'EOS GmbH', website:'https://www.eos.info/en', logoUrl:fav('https://www.eos.info/'), tagline:'Metal and polymer AM trusted on the factory floor', fullDescription:'EOS provides high‑performance metal and polymer laser‑powder bed systems. Mature process parameters, monitoring, and QA support serial production. Customers produce lightweight, complex geometries with repeatability. Extensive partner ecosystem for scale‑up.' }),
          mk('3dp-ind-hp',{ name:'HP Digital Manufacturing', website:'https://www.hp.com/us-en/printers/3d-printers.html', logoUrl:fav('https://www.hp.com/'), tagline:'Multi Jet Fusion for high‑throughput polymer parts', fullDescription:'HP’s Multi Jet Fusion platform enables fast, consistent polymer part production. Integrated materials, printers, and services target volume manufacturing. Teams achieve strong surface finish and dimensional accuracy. Deployed in consumer, industrial, and healthcare use cases.' }),
          mk('3dp-ind-stratasys',{ name:'Stratasys Ltd.', website:'https://www.stratasys.com/', logoUrl:fav('https://www.stratasys.com/'), tagline:'Industrial FDM, PolyJet, SAF, and P3 platforms', fullDescription:'Stratasys offers industrial printers and materials for prototyping and production. Technologies cover FDM, PolyJet, SAF, and P3 for broad applications. Software and support programs accelerate adoption. Used widely across aerospace, automotive, and healthcare.' }),
        ]
      },
      {
        key:'desktop-pro',
        title:'Desktop & Professional 3D Printers (For Design Firms, R&D Labs, Education)',
        vendors:[
          mk('3dp-dp-markforged',{ name:'Markforged', website:'https://markforged.com/', logoUrl:fav('https://markforged.com/'), tagline:'Composite and metal printing for the engineering office', fullDescription:'Markforged blends fiber‑reinforced composites and metal AM in accessible systems. Software simplifies part prep and fleet management. Teams replace jigs, fixtures, and functional parts quickly. Ideal for design labs and small‑batch production.' }),
          mk('3dp-dp-ultimaker',{ name:'UltiMaker', website:'https://ultimaker.com/', logoUrl:fav('https://ultimaker.com/'), tagline:'Reliable desktop FFF with broad materials ecosystem', fullDescription:'UltiMaker delivers dependable FFF printers for education and professional use. Open materials and curated profiles enable consistent results. Cloud tools ease sharing and monitoring across teams. Trusted in classrooms, labs, and studios worldwide.' }),
          mk('3dp-dp-raise3d',{ name:'Raise3D', website:'https://www.raise3d.com/', logoUrl:fav('https://www.raise3d.com/'), tagline:'Large‑volume professional printers for prototypes and parts', fullDescription:'Raise3D offers office‑friendly printers with generous build volumes and material options. Systems emphasize print quality, enclosures, and ease of use. Ideal for design validation and functional parts. Software supports workflow control at scale.' }),
          mk('3dp-dp-formlabs',{ name:'Formlabs', website:'https://formlabs.com/', logoUrl:fav('https://formlabs.com/'), tagline:'SLA and SLS platforms with validated resins and powders', fullDescription:'Formlabs brings industrial quality to the desktop with SLA and SLS systems. Validated materials deliver accuracy and repeatability. Turnkey workflows cover dental, medical, and product design. Extensive learning and support resources speed adoption.' }),
        ]
      },
      {
        key:'large-format',
        title:'Large-Format / Construction 3D Printers (For Housing, Infrastructure)',
        vendors:[
          mk('3dp-lf-cobod',{ name:'COBOD International', website:'https://www.cobod.com/', logoUrl:fav('https://www.cobod.com/'), tagline:'Construction printers for buildings and infrastructure', fullDescription:'COBOD develops gantry‑style construction 3D printers for housing and civil projects. Systems emphasize speed, repeatability, and site integration. Contractors reduce labor and material waste with automated workflows. Proven deployments across multiple geographies.' }),
          mk('3dp-lf-mudbots',{ name:'MudBots', website:'https://mudbots.com/', logoUrl:fav('https://mudbots.com/'), tagline:'On‑site concrete printing systems', fullDescription:'MudBots supplies concrete printing solutions tailored for on‑site builds. Configurable systems support varied footprints and mixes. Builders prototype, form, and fabricate structures efficiently. Training and support help teams ramp quickly.' }),
          mk('3dp-lf-xtreee',{ name:'XtreeE', website:'https://www.xtreee.com/', logoUrl:fav('https://www.xtreee.com/'), tagline:'Large‑scale additive for architecture and infrastructure', fullDescription:'XtreeE focuses on large‑format AM for architecture and infrastructure. Robotic systems fabricate complex geometries and optimized structures. Projects target sustainability and performance. Collaboration with architects and engineers is core to delivery.' }),
          mk('3dp-lf-bigrep',{ name:'BigRep', website:'https://bigrep.com/', logoUrl:fav('https://bigrep.com/'), tagline:'Large‑format polymer printers for industrial parts', fullDescription:'BigRep builds large‑format polymer printers enabling full‑scale prototypes and end‑use parts. Systems combine build volume, stability, and material choice. Used in automotive, aerospace, and tooling applications. Software and service support production environments.' }),
        ]
      },
      {
        key:'micro-nano',
        title:'Micro / Nano 3D Printers (For Electronics, Medtech Components)',
        vendors:[
          mk('3dp-mn-nanoscribe',{ name:'Nanoscribe GmbH', website:'https://www.nanoscribe.com/', logoUrl:fav('https://www.nanoscribe.com/'), tagline:'Two‑photon 3D printing for micro‑fabrication', fullDescription:'Nanoscribe delivers two‑photon polymerization systems to create micro‑ and nano‑scale structures. Researchers and OEMs fabricate optics, MEMS, and biomedical devices. High resolution and precision unlock novel designs. Workflow tools streamline from CAD to part.' }),
          mk('3dp-mn-upnano',{ name:'UpNano', website:'https://www.upnano.at/', logoUrl:fav('https://www.upnano.at/'), tagline:'High‑speed micro‑printing with sub‑micron precision', fullDescription:'UpNano offers micro‑printing platforms balancing speed and precision. Systems address life sciences, microfluidics, and photonics. Materials and process controls enable repeatable outcomes. Compact systems fit lab and R&D environments.' }),
          mk('3dp-mn-microlight3d',{ name:'Microlight3D', website:'https://www.microlight3d.com/', logoUrl:fav('https://www.microlight3d.com/'), tagline:'Ultra‑precise 3D micro‑printing solutions', fullDescription:'Microlight3D provides ultra‑precise micro‑printing solutions for complex structures. Applications span micro‑optics, biomed, and materials research. Toolchains support rapid iteration from experiment to device. Proven accuracy for demanding geometries.' }),
          mk('3dp-mn-nanovoxel',{ name:'NanoVoxel', website:'http://www.nanovoxel.com/', logoUrl:fav('http://www.nanovoxel.com/'), tagline:'Advanced micro‑/nano‑fabrication platforms', fullDescription:'NanoVoxel develops platforms for advanced micro‑ and nano‑fabrication. Customers create intricate, tiny components for electronics and medtech. Focus on resolution, throughput, and stability. Supports cutting‑edge R&D and prototyping.' }),
        ]
      },
      {
        key:'hybrid',
        title:'Hybrid Manufacturing Systems (3D Printing + CNC / Subtractive Processes)',
        vendors:[
          mk('3dp-hy-3dhybrid',{ name:'3D Hybrid Solutions Inc.', website:'https://www.3dhybridsolutions.com/', logoUrl:fav('https://www.3dhybridsolutions.com/'), tagline:'Additive heads retrofit onto CNC machines', fullDescription:'3D Hybrid Solutions enables hybrid manufacturing by retrofitting CNCs with additive heads. Shops combine AM deposition with milling in one setup. This reduces changeovers and extends machine utility. Ideal for repair, tooling, and complex parts.' }),
          mk('3dp-hy-phillips',{ name:'Phillips Corp. (Hybrid Solutions)', website:'https://phillipscorp.com/hybrid/', logoUrl:fav('https://phillipscorp.com/'), tagline:'Hybrid upgrades and solutions for machine tools', fullDescription:'Phillips provides hybrid solutions that integrate additive and subtractive processes. Services cover selection, integration, and support. Manufacturers gain flexibility for build, repair, and finishing. Partnerships with OEMs accelerate deployment.' }),
          mk('3dp-hy-hmt',{ name:'Hybrid Manufacturing Technologies', website:'https://www.hybridmanutech.com/', logoUrl:fav('https://www.hybridmanutech.com/'), tagline:'Tool‑changeable AM heads for hybrid platforms', fullDescription:'Hybrid Manufacturing Technologies offers tool‑changeable AM heads for hybrid platforms. Systems enable material deposition and machining in one cell. Users improve lead times and part performance. Modular approach fits diverse machines and materials.' }),
          mk('3dp-hy-dmgmori',{ name:'DMG MORI Co. Ltd.', website:'https://www.dmgmori.com/', logoUrl:fav('https://www.dmgmori.com/'), tagline:'Integrated hybrid machines from a global machine tool leader', fullDescription:'DMG MORI integrates additive and subtractive processes into advanced machine tools. Turnkey systems support precision manufacturing at scale. Users achieve excellent surface finish and dimensional control. Backed by global service and training.' }),
        ]
      },
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🧩</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-4">3D Printing</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Service bureaus, platforms, and industrial AM systems</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore providers across prototyping, production, metals, polymers, and lattices.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 20 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-fuchsia-600 text-fuchsia-700 hover:bg-fuchsia-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {sections.map(sec => (
            <div key={sec.key} className="mb-12">
              <div className="relative my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
                <div className="px-4 py-1 rounded-full bg-white border text-fuchsia-700 font-semibold tracking-wide">{sec.title}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
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

