import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all duration-300 overflow-hidden relative">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-amber-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Robotics(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/networking'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Networking' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/networking'); return }
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
        key:'r5g',
        title:'5G / 6G Infrastructure & Small Cells',
        vendors:[
          mk('net-5g-jma',{ name:'JMA Wireless', website:'https://www.jmawireless.com/', logoUrl:fav('https://www.jmawireless.com/'), tagline:'US-built 5G systems and software-defined RAN', fullDescription:'JMA delivers end-to-end 5G infrastructure including software-defined RAN and small cells. Enterprises and operators deploy private and public networks with flexible architectures. Focus on performance, security, and domestic manufacturing.' }),
          mk('net-5g-airspan',{ name:'Airspan Networks', website:'https://www.airspan.com/', logoUrl:fav('https://www.airspan.com/'), tagline:'Open RAN small cells and fixed wireless access', fullDescription:'Airspan provides Open RAN small cells, radios, and software for 5G and FWA. Solutions accelerate densification and rural broadband. Operators benefit from openness, cost efficiency, and rapid rollout options.' }),
          mk('net-5g-commscope',{ name:'CommScope', website:'https://www.commscope.com/', logoUrl:fav('https://www.commscope.com/'), tagline:'End-to-end connectivity for RAN, in-building, and fiber', fullDescription:'CommScope supplies radios, cabling, and in-building solutions that underpin mobile and enterprise networks. Offerings span antennas to fiber, enabling scalable, reliable deployments. Trusted across carriers and critical infrastructure.' }),
          mk('net-5g-casa',{ name:'Casa Systems', website:'https://www.casa-systems.com/', logoUrl:fav('https://www.casa-systems.com/'), tagline:'Cloud-native 5G core, RAN, and broadband edge', fullDescription:'Casa Systems delivers cloud-native network functions for 5G core, RAN, and broadband. Platforms help operators modernize with agility and lower TCO. Designed for performance at the distributed edge.' }),
          mk('net-5g-parallel',{ name:'Parallel Wireless', website:'https://www.parallelwireless.com/', logoUrl:fav('https://www.parallelwireless.com/'), tagline:'Open RAN solutions for coverage and capacity', fullDescription:'Parallel Wireless develops Open RAN software and systems improving coverage and capacity. Rural, enterprise, and urban deployments benefit from vendor flexibility and cost savings. Supports 2G–5G evolution paths.' }),
        ]
      },
      {
        key:'iotgw',
        title:'IoT Gateways & Hubs',
        vendors:[
          mk('net-iot-telit',{ name:'Telit Cinterion', website:'https://www.telit.com/', logoUrl:fav('https://www.telit.com/'), tagline:'Modules, gateways, and device management at scale', fullDescription:'Telit Cinterion provides modules, gateways, and connectivity management for IoT. Builders accelerate connected products from concept to fleet operations. Global coverage and tooling simplify scale and lifecycle.' }),
          mk('net-iot-linklabs',{ name:'Link Labs', website:'https://www.link-labs.com/', logoUrl:fav('https://www.link-labs.com/'), tagline:'Asset tracking and IoT connectivity platforms', fullDescription:'Link Labs offers enterprise asset tracking and connectivity leveraging sub-GHz and cellular. Solutions deliver long battery life and building penetration. Used in logistics, manufacturing, and facilities.' }),
          mk('net-iot-monnit',{ name:'Monnit Corporation', website:'https://www.monnit.com/', logoUrl:fav('https://www.monnit.com/'), tagline:'Wireless sensors and gateways for remote monitoring', fullDescription:'Monnit provides a wide catalog of wireless sensors with gateways and cloud software. Organizations monitor temperature, vibration, and more with alerts. Rapid to deploy for facilities, labs, and industrial sites.' }),
          mk('net-iot-bb',{ name:'B+B SmartWorx (Advantech B+B)', website:'https://www.advantech-bb.com/', logoUrl:fav('https://www.advantech-bb.com/'), tagline:'Industrial connectivity for serial, Ethernet, and cellular', fullDescription:'Advantech B+B delivers industrial gateways and converters spanning serial, Ethernet, and cellular. Legacy and modern equipment connect securely to apps and clouds. Proven in utilities, transportation, and manufacturing.' }),
          mk('net-iot-multitech',{ name:'MultiTech Systems', website:'https://www.multitech.com/', logoUrl:fav('https://www.multitech.com/'), tagline:'LoRa, cellular, and private LTE gateways', fullDescription:'MultiTech offers gateways and devices for LoRa, cellular, and private LTE. Builders create resilient networks for industrial IoT. Robust options fit harsh environments and long-term operation.' }),
        ]
      },
      {
        key:'sdn',
        title:'Software-Defined Networking (SDN) Equipment',
        vendors:[
          mk('net-sdn-pica8',{ name:'Pica8', website:'https://www.pica8.com/', logoUrl:fav('https://www.pica8.com/'), tagline:'Open networking OS and SDN for enterprises', fullDescription:'Pica8 provides an open network operating system and SDN controller for campus and data center. Customers avoid lock‑in while automating operations. Visibility and policy improve reliability and agility.' }),
          mk('net-sdn-ciena',{ name:'Ciena', website:'https://www.ciena.com/', logoUrl:fav('https://www.ciena.com/'), tagline:'Packet/optical, routing, and automation platforms', fullDescription:'Ciena delivers packet/optical and routing systems with Blue Planet automation. Service providers and enterprises scale bandwidth with intelligence. Solutions reduce complexity across multi‑layer networks.' }),
          mk('net-sdn-arista-bigswitch',{ name:'Big Switch Networks (Arista)', website:'https://www.arista.com/en/', logoUrl:fav('https://www.arista.com/'), tagline:'Cloud networking and fabric automation', fullDescription:'Big Switch technology is part of Arista, advancing cloud networking and fabric automation. Operators gain consistent architectures from leaf‑spine to multi‑cloud. APIs and telemetry support DevNetOps workflows.' }),
          mk('net-sdn-pluribus',{ name:'Pluribus Networks', website:'https://www.pluribusnetworks.com/', logoUrl:fav('https://www.pluribusnetworks.com/'), tagline:'Adaptive cloud fabric for distributed clouds', fullDescription:'Pluribus provides an adaptive cloud fabric enabling automated overlays across distributed data centers. Simpler operations and visibility improve uptime. Built for scale at the edge and core.' }),
          mk('net-sdn-apstra',{ name:'Apstra (Juniper Networks)', website:'https://www.juniper.net/us/en/products/network-automation/apstra.html', logoUrl:fav('https://www.juniper.net/'), tagline:'Intent-based data center automation', fullDescription:'Apstra, now part of Juniper, delivers intent-based design and operations for data centers. Day‑0 to Day‑2 automation reduces errors and speeds changes. Multi‑vendor support protects choice and investments.' }),
        ]
      },
      {
        key:'industrial',
        title:'Industrial Ethernet / Fiber Hardware',
        vendors:[
          mk('net-ind-comnet',{ name:'ComNet (Communication Networks)', website:'https://www.comnet.net/', logoUrl:fav('https://www.comnet.net/'), tagline:'Rugged Ethernet, fiber, and PoE for harsh sites', fullDescription:'ComNet builds rugged Ethernet and fiber gear for transportation, surveillance, and utilities. Products withstand temperature and vibration extremes. Field‑proven for long‑distance and high‑reliability links.' }),
          mk('net-ind-redlion',{ name:'Red Lion Controls', website:'https://www.redlion.net/', logoUrl:fav('https://www.redlion.net/'), tagline:'Industrial networking, HMIs, and automation', fullDescription:'Red Lion provides industrial Ethernet switches, HMIs, and automation solutions. Plants and remote assets connect securely and reliably. Visibility and management streamline operations across sites.' }),
          mk('net-ind-garrettcom',{ name:'GarrettCom (Belden Inc.)', website:'https://www.belden.com/products/garrettcom', logoUrl:fav('https://www.belden.com/'), tagline:'Hardened switches for mission‑critical networks', fullDescription:'GarrettCom, part of Belden, delivers hardened switches for power, transport, and security. Designs meet stringent certifications and uptime needs. Trusted for substations and other demanding environments.' }),
          mk('net-ind-corning',{ name:'Corning Optical Communications', website:'https://www.corning.com/worldwide/en/products/communication-networks.html', logoUrl:fav('https://www.corning.com/'), tagline:'Fiber infrastructure and connectivity solutions', fullDescription:'Corning supplies optical fiber, cable, and connectivity used globally. Solutions enable campus, data center, and access networks. Innovations improve density, ease of install, and long‑term performance.' }),
          mk('net-ind-siemon',{ name:'Siemon Company', website:'https://www.siemon.com/', logoUrl:fav('https://www.siemon.com/'), tagline:'Structured cabling for enterprise and data centers', fullDescription:'Siemon provides structured cabling and connectivity for enterprise and data centers. Standards‑based designs support high‑speed links and PoE. Engineering services help ensure compliant, scalable builds.' }),
        ]
      },
      {
        key:'private',
        title:'Private Network / Satellite / LoRaWAN Devices',
        vendors:[
          mk('net-priv-mavenir',{ name:'Mavenir Systems', website:'https://www.mavenir.com/', logoUrl:fav('https://www.mavenir.com/'), tagline:'End-to-end cloud-native mobile network software', fullDescription:'Mavenir offers cloud-native network software spanning core, RAN, and messaging. Enterprises and operators deploy private and public networks with agility. Open interfaces and automation reduce cost and risk.' }),
          mk('net-priv-kymeta',{ name:'Kymeta Corporation', website:'https://www.kymetacorp.com/', logoUrl:fav('https://www.kymetacorp.com/'), tagline:'Electronically steered satellite terminals', fullDescription:'Kymeta develops flat-panel, electronically steered satellite terminals. Mobility and remote operations gain broadband without bulky dishes. Integrates with LEO and GEO constellations for global coverage.' }),
          mk('net-priv-ubiquiti',{ name:'Ubiquiti Inc.', website:'https://www.ui.com/', logoUrl:fav('https://www.ui.com/'), tagline:'Wireless and wired networking for enterprises and ISPs', fullDescription:'Ubiquiti provides wireless and wired networking gear with a strong value profile. UISP and UniFi simplify deployment and monitoring. Popular for campus, hospitality, WISPs, and SMBs.' }),
          mk('net-priv-semtech',{ name:'Semtech (LoRa Division)', website:'https://www.semtech.com/lora', logoUrl:fav('https://www.semtech.com/'), tagline:'LoRa transceivers and LoRaWAN ecosystem', fullDescription:'Semtech’s LoRa technology underpins global LPWAN deployments. Devices achieve long range and low power for IoT. A rich ecosystem supports gateways, clouds, and applications.' }),
          mk('net-priv-federated',{ name:'Federated Wireless', website:'https://www.federatedwireless.com/', logoUrl:fav('https://www.federatedwireless.com/'), tagline:'CBRS spectrum sharing and private LTE/5G', fullDescription:'Federated Wireless provides CBRS spectrum access systems, APs, and services. Enterprises deploy private LTE/5G quickly and compliantly. Coverage and capacity improve for campuses and industrial sites.' }),
        ]
      }
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🌐</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4">Networking & Connectivity Vendors</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Wireless, wired, and private networks for IoT, enterprise, and edge.</div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View Vendors</a>
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
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
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
