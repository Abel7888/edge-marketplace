import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-sky-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-sky-500/20 to-cyan-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">{x}</span>)}
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
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold">Request Live Demo</button>
          <button className="h-12 rounded-lg border-2 border-sky-600 text-sky-700 font-semibold bg-white">Get Custom Quote</button>
          <button className="h-12 rounded-lg border text-gray-700">Request Vetting Review</button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-sky-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Drones(){
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

  async function toggleSaveVendor(vendorId){
    if (!currentUser){ navigate('/login?redirect=/discover/drones'); return }
    const id = String(vendorId)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try { if (wasSaved) await fsRemoveSavedVendor(currentUser.uid, id); else await fsSaveVendor(currentUser.uid, id) } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/drones'); return }
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

  const vendors = useMemo(()=>{
    const mk = (i, data) => ({ id:`dr-${String(i).padStart(3,'0')}`, rating:4.7, reviewCount:100+i, successRate:92+(i%5), responseTime:i%3===0?'<2 hours':'<6 hours', ...data })
    return [
      mk(1,{ name:'DJI', tagline:'World leader in drones for consumer and enterprise', industries:['Consumer','Agriculture','Enterprise','Cinematography','Public Safety'], solutions:['Multirotor Drones','Enterprise Platforms','Imaging'], services:['Apps','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=dji.com&sz=128', website:'https://www.dji.com/', fullDescription:'DJI holds 70%+ global market share with broad product lines from Mavic and Mini to enterprise platforms like M30T. Its drones revolutionize construction, medical delivery, and cinematography with advanced safety and imaging.' }),
      mk(2,{ name:'Orqa International', tagline:'FPV systems and mission‑critical components for Blue UAS', industries:['FPV','Industrial','Enterprise'], solutions:['FPV Goggles','Video Systems'], services:['Integration','Support','Education'], logoUrl:'https://www.google.com/s2/favicons?domain=orqa.com&sz=128', website:'https://orqa.com/', fullDescription:'Orqa, based in Croatia, builds FPV systems and mission‑critical components for Blue UAS. Strong presence in education via Drone Soccer and expanded portfolio after merging with Immersion RC.' }),
      mk(3,{ name:'AeroVironment', tagline:'Tactical UAS for defense, public safety, and ISR', industries:['Defense','Public Safety'], solutions:['Tactical UAS','Loitering Munitions'], services:['Training','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=avinc.com&sz=128', website:'https://www.avinc.com/', fullDescription:'AeroVironment develops tactical UAS like Switchblade, Puma 3AE, Raven, and Wasp, supporting U.S. Army and global partners with advanced unmanned systems for ISR and operations.' }),
      mk(4,{ name:'PowerVision', tagline:'Aerial, surface, and underwater robotic devices', industries:['Aerial','Surface','Underwater'], solutions:['Underwater ROVs','Aerial Drones','Surface Robots'], services:['Apps','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=powervision.me&sz=128', website:'https://www.powervision.me/', fullDescription:'PowerVision uniquely mass-produces aerial, surface, and underwater robots, including PowerRay underwater and PowerEgg X AI camera platforms for diverse industrial and consumer use cases.' }),
      mk(5,{ name:'Parrot', tagline:'European enterprise drones with rich partner ecosystem', industries:['Enterprise','Public Safety'], solutions:['ANAFI Series','Thermal Imaging'], services:['Deployment','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=parrot.com&sz=128', website:'https://www.parrot.com/', fullDescription:'Parrot builds professional drones like ANAFI USA/Thermal/Ai, serving public safety and enterprise programs across Europe with emphasis on portability, features, and security.' }),
      mk(6,{ name:'Autel Robotics', tagline:'Feature‑rich consumer and commercial drones', industries:['Commercial','Consumer'], solutions:['Evo Series','Imaging'], services:['Apps','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=autelrobotics.com&sz=128', website:'https://autelrobotics.com/', fullDescription:'Autel offers long‑flight‑time drones with stabilized 4K video and advanced sensing. Evo Nano+ requires no FAA registration; Lite+ uses a 1‑inch class sensor for high image quality.' }),
      mk(7,{ name:'Skydio', tagline:'Autonomous drones and docks designed and built in USA', industries:['Public Safety','Defense','Enterprise','Cinematic'], solutions:['Autonomous Drones','Docking Systems'], services:['Deployment','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=skydio.com&sz=128', website:'https://www.skydio.com/', fullDescription:'Skydio’s autonomous systems enable remote operations for emergency response and infrastructure monitoring. U.S.-designed/assembled with strong supply chain and security posture.' }),
      mk(8,{ name:'Delair', tagline:'Long‑range fixed‑wing UAVs and analytics', industries:['Commercial','Military','Security'], solutions:['Fixed‑Wing UAVs','Analytics'], services:['Deployment','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=delair.aero&sz=128', website:'https://delair.aero/', fullDescription:'Delair specializes in long-endurance fixed-wing UAVs and analytics for surveying, inspection, and security across oil and gas, transport, agriculture, and emergency services.' }),
      mk(9,{ name:'EHang', tagline:'Autonomous aerial vehicles for UAM and logistics', industries:['UAM','Logistics'], solutions:['Passenger AAVs','Cargo AAVs'], services:['Operations','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ehang.com&sz=128', website:'https://www.ehang.com/', fullDescription:'EHang develops passenger and cargo AAVs. EH216 has CAAC certification and is in commercial operation in China, targeting urban air mobility, logistics, and emergency response.' }),
      mk(10,{ name:'Freefly Systems', tagline:'Cine-grade aerial platforms and stabilizers', industries:['Cinematography','Film'], solutions:['Alta Series','Movi Stabilizers'], services:['Support','Integration','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=freeflysystems.com&sz=128', website:'https://freeflysystems.com/', fullDescription:'Freefly builds premium cinema drones and 5‑axis stabilizers. Movi Carbon delivers ultra-smooth shots even at 240mm zoom; Alta X is widely used in professional film work.' }),
      mk(11,{ name:'Flyability', tagline:'Collision‑tolerant drones for indoor inspection', industries:['Industrial Inspection'], solutions:['Elios Series','Inspection'], services:['Deployment','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=flyability.com&sz=128', website:'https://www.flyability.com/', fullDescription:'Flyability’s caged drones (Elios) fly safely in confined spaces like mines, nuclear plants, and oil rigs, enabling safer, cheaper inspections in hazardous environments.' }),
      mk(12,{ name:'Insitu', tagline:'Modular ISR UAS for military and government', industries:['Defense','Government'], solutions:['ScanEagle','Integrator'], services:['Training','Operations','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=insitu.com&sz=128', website:'https://www.insitu.com/', fullDescription:'Insitu’s UAS deliver real-time intelligence for search and rescue, surveillance, and environmental monitoring, with partnerships expanding across Asia-Pacific.' }),
      mk(13,{ name:'Wingtra', tagline:'VTOL mapping drones and WingtraCLOUD', industries:['Surveying','GIS','Mining','Construction','Agriculture','Environmental'], solutions:['WingtraOne','WingtraCLOUD'], services:['Deployment','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=wingtra.com&sz=128', website:'https://wingtra.com/', fullDescription:'Wingtra’s VTOL drones deliver high-precision aerial surveys across construction, mining, and environmental monitoring; WingtraCLOUD simplifies data planning and collaboration.' }),
      mk(14,{ name:'Airobotics', tagline:'Fully automated, government‑grade autonomous systems', industries:['Security','Inspection','Mapping','Precision Ag'], solutions:['Automated Drones','Counter‑UAS'], services:['Deployment','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=airoboticsdrones.com&sz=128', website:'https://www.airoboticsdrones.com/', fullDescription:'Airobotics builds automated drone systems including Iron Drone for counter‑UAS, plus solutions for security, inspection, mapping, and precision agriculture.' }),
      mk(15,{ name:'JOUAV', tagline:'High‑quality fixed‑wing and industrial UAVs', industries:['Industrial','Agriculture'], solutions:['Fixed‑Wing UAVs','Payloads'], services:['Deployment','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=jouav.com&sz=128', website:'https://www.jouav.com/', fullDescription:'JOUAV manufactures fixed‑wing UAVs with extended flight time and versatile payloads, widely used in agriculture, construction, and public safety.' }),
      mk(16,{ name:'Draganfly', tagline:'Enterprise UAS, custom software, and services', industries:['Enterprise','Public Safety'], solutions:['UAS Platforms','Custom Software'], services:['Services','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=draganfly.com&sz=128', website:'https://draganfly.com/', fullDescription:'Draganfly pioneered life‑saving missions and quadcopters, delivering advanced platforms with thermal imaging, autonomy, and professional services.' }),
      mk(17,{ name:'BRINC', tagline:'Public safety drones with two‑way comms', industries:['Law Enforcement','Public Safety'], solutions:['Two‑Way Comms','Indoor Drones'], services:['Deployment','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=brincdrones.com&sz=128', website:'https://www.brincdrones.com/', fullDescription:'BRINC enables safe negotiation and scene assessment via two‑way audio and sensing, used by 500+ U.S. agencies to reduce risk in emergencies.' }),
      mk(18,{ name:'Guardian Agriculture', tagline:'FAA‑approved eVTOL systems for farming', industries:['Agriculture'], solutions:['eVTOL Spraying','Precision Application'], services:['Operations','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=guardian.ag&sz=128', website:'https://www.guardian.ag/', fullDescription:'Guardian’s SC1 eVTOL supports precise, efficient aerial application to reduce pesticide use and costs while boosting yields and sustainability.' }),
      mk(19,{ name:'Flyby Robotics', tagline:'Developer‑friendly UAVs with strong edge compute', industries:['ISR','Photogrammetry','Mapping'], solutions:['F‑11 Series','Edge AI'], services:['Integration','Support','Consulting'], logoUrl:'https://www.google.com/s2/favicons?domain=flybyrobotics.com&sz=128', website:'https://www.flybyrobotics.com/', fullDescription:'Flyby’s NDAA‑compliant F‑11 series supports top/bottom payloads and edge AI for ISR, mapping, and photogrammetry; built for secure integrations.' }),
      mk(20,{ name:'Vantage Robotics', tagline:'Rugged ISR drones for field operations', industries:['ISR','Surveillance','Tactical'], solutions:['Vesper Platform','ISR Payloads'], services:['Deployment','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=vantagerobotics.com&sz=128', website:'https://vantagerobotics.com/', fullDescription:'Vantage Robotics builds rugged, field‑ready ISR drones. Vesper’s tri‑sensor stabilized payload delivers high‑quality imagery even in low light.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🛩️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-4">Drones</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Enterprise, public safety, mapping, and cinematography UAVs</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore leading UAV platforms, autonomy, VTOL, and AI-enabled workflows.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 20 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-sky-600 text-sky-700 hover:bg-sky-600 hover:text-white transition"><GitCompare size={18}/> Compare Top 3</a>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><PhoneCall size={18}/> Get Expert Consultation</button>
          </div>
        </div>
      </section>
      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Drone Vendors</h2>
              <div className="text-gray-600">20 curated vendors across enterprise, public safety, AAV, and cinema</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendors.map(v => (
              <VendorCard
                key={v.id}
                v={v}
                saved={saved.has(v.id)}
                onToggleSave={()=> toggleSaveVendor(v.id)}
                onRequestDemo={()=> openDemo(v)}
              />
            ))}
          </div>
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
