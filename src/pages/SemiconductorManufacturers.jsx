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
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold">Request Live Demo</button>
          <button className="h-12 rounded-lg border-2 border-indigo-600 text-indigo-700 font-semibold bg-white">Get Custom Quote</button>
          <button className="h-12 rounded-lg border text-gray-700">Request Vetting Review</button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SemiconductorManufacturers(){
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

  async function toggleSaveVendor(vendorId){
    if (!currentUser){ router.push('/login?redirect=/discover/semiconductor-manufacturers'); return }
    const id = String(vendorId)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try { if (wasSaved) await fsRemoveSavedVendor(currentUser.uid, id); else await fsSaveVendor(currentUser.uid, id) } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/semiconductor-manufacturers'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(form){
    if (!currentUser || !demoVendor) return
    await createDemoRequest({ userId: currentUser.uid, vendorId: String(demoVendor.id), formData: form, status: 'pending' })
    setDemoOpen(false)
    setDemoVendor(null)
  }

  const vendors = useMemo(()=>{
    const mk = (i, data) => ({ id:`sm-${String(i).padStart(3,'0')}`, rating:4.7, reviewCount:70+i, successRate:92+(i%5), responseTime:i%3===0?'<2 hours':'<6 hours', ...data })
    return [
      mk(1,{ name:'TSMC', tagline:'World’s leading pure-play semiconductor foundry', industries:['Mobile','HPC','Automotive'], solutions:['Advanced Nodes (3nm/5nm)','Specialty Technologies','Packaging (CoWoS/InFO)'], services:['Foundry Services','Design Enablement','Advanced Packaging'], logoUrl:'https://www.google.com/s2/favicons?domain=tsmc.com&sz=128', website:'https://www.tsmc.com/', fullDescription:'Taiwan Semiconductor Manufacturing Company (TSMC) manufactures leading‑edge chips as a pure‑play foundry. Its advanced nodes (N3/N5) and packaging (CoWoS, InFO) power top mobile, HPC, and AI products for global fabless design leaders.' }),
      mk(2,{ name:'NVIDIA', tagline:'GPUs and accelerated computing platforms for AI and HPC', industries:['AI','Cloud','Automotive'], solutions:['GPUs','AI Accelerators','Networking'], services:['SDKs','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=nvidia.com&sz=128', website:'https://www.nvidia.com/', fullDescription:'NVIDIA designs GPUs and systems that accelerate AI training and inference, graphics, and HPC. Its platform spans silicon, networking, and software stacks such as CUDA, cuDNN, and enterprise AI frameworks.' }),
      mk(3,{ name:'Intel', tagline:'IDM building advanced CPUs, foundry services, and packaging', industries:['PC','Data Center','Automotive'], solutions:['CPUs','Foundry Services','Advanced Packaging'], services:['Manufacturing','Design Enablement','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=intel.com&sz=128', website:'https://www.intel.com/', fullDescription:'Intel is an integrated device manufacturer (IDM) investing in new fabs and advanced packaging. Beyond client and server CPUs, Intel Foundry offers external manufacturing and services to customers globally.' }),
      mk(4,{ name:'Broadcom', tagline:'Custom silicon, networking, and RF for infrastructure at scale', industries:['Cloud','Networking','Wireless'], solutions:['ASICs','Switch Silicon','RF Components'], services:['Design Engagement','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=broadcom.com&sz=128', website:'https://www.broadcom.com/', fullDescription:'Broadcom supplies high‑performance custom and standard silicon. Its portfolio spans Ethernet switch ICs, custom ASICs for hyperscalers, and RF components for wireless devices and infrastructure.' }),
      mk(5,{ name:'Qualcomm', tagline:'Snapdragon platforms for mobile, auto, and edge', industries:['Mobile','Automotive','Edge'], solutions:['SoCs','Modems','Connectivity'], services:['Design Kits','Ecosystem','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=qualcomm.com&sz=128', website:'https://www.qualcomm.com/', fullDescription:'Qualcomm’s Snapdragon platforms power smartphones and growing automotive and IoT markets. Leadership in modems, connectivity, and AI‑on‑device compute enables premium experiences across segments.' }),
      mk(6,{ name:'AMD', tagline:'High-performance CPUs and AI accelerators on a fabless model', industries:['PC','Data Center','AI','Gaming'], solutions:['Ryzen CPUs','EPYC CPUs','MI Series Accelerators'], services:['Partner Enablement','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=amd.com&sz=128', website:'https://www.amd.com/', fullDescription:'AMD designs high‑performance CPUs and AI accelerators, outsourcing manufacturing to foundry partners. EPYC servers and MI accelerators target cloud and AI workloads, while Ryzen powers client systems and gaming.' }),
      mk(7,{ name:'SK hynix', tagline:'DRAM and NAND leader enabling AI and data-centric apps', industries:['Memory','Data Center','Mobile'], solutions:['HBM','DRAM','NAND'], services:['Supply','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=skhynix.com&sz=128', website:'https://www.skhynix.com/', fullDescription:'SK hynix manufactures advanced memory including HBM for AI accelerators, server DRAM, and mobile NAND. Its products support bandwidth‑intensive AI and data center workloads.' }),
      mk(8,{ name:'ASE Technology', tagline:'World’s leading OSAT for packaging, test, and SiP', industries:['Mobile','Consumer','Automotive'], solutions:['Advanced Packaging','SiP','Test Services'], services:['Assembly','Test','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=aseglobal.com&sz=128', website:'https://www.aseglobal.com/', fullDescription:'ASE provides outsourced semiconductor assembly and test (OSAT), including advanced packages (Fan‑Out, 2.5D/3D) and system‑in‑package (SiP). Partners with fabless and IDMs to deliver turnkey solutions.' }),
      mk(9,{ name:'Texas Instruments', tagline:'Analog, embedded, and power solutions with U.S. fabs', industries:['Industrial','Automotive','Aerospace'], solutions:['Analog ICs','MCUs','Power Management'], services:['Samples','Design Tools','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ti.com&sz=128', website:'https://www.ti.com/', fullDescription:'TI designs analog and embedded semiconductors across 80k+ devices. Expanding U.S. 300mm manufacturing and providing extensive reference designs and tools for faster integration.' }),
      mk(10,{ name:'Infineon', tagline:'Power systems, automotive, and IoT security semiconductors', industries:['Automotive','Industrial','IoT'], solutions:['Power Semiconductors','Automotive ICs','Security ICs'], services:['Application Support','Design Tools','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=infineon.com&sz=128', website:'https://www.infineon.com/', fullDescription:'Infineon focuses on power electronics, automotive microcontrollers, and security solutions. Its portfolio enables efficient energy conversion, EV drivetrains, and secure IoT devices.' }),
      mk(11,{ name:'STMicroelectronics', tagline:'Mixed-signal, sensors, and power for industrial & automotive', industries:['Industrial','Automotive','Consumer'], solutions:['MCUs','Sensors','Power & Analog'], services:['Ecosystem','Design Tools','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=st.com&sz=128', website:'https://www.st.com/', fullDescription:'ST provides microcontrollers, sensors, and power devices used in industrial automation, automotive, and consumer electronics. Broad ecosystem and long‑life support help scale products to production.' }),
      mk(12,{ name:'Micron', tagline:'U.S. memory and storage for data center and automotive', industries:['Memory','Data Center','Automotive'], solutions:['DRAM','NAND','Storage'], services:['Supply','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=micron.com&sz=128', website:'https://www.micron.com/', fullDescription:'Micron manufactures DRAM and NAND with facilities in the U.S. and abroad. Products target data center, automotive, and embedded, including high‑performance memory for AI systems.' }),
      mk(13,{ name:'MediaTek', tagline:'Fabless SoCs for mobile, edge AI, and connectivity', industries:['Mobile','Edge','Connectivity'], solutions:['Dimensity SoCs','Wi‑Fi/BT','Edge AI'], services:['Reference Designs','Partner Support','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=mediatek.com&sz=128', website:'https://www.mediatek.com/', fullDescription:'MediaTek designs Dimensity mobile platforms and connectivity chipsets. Growing investment in on‑device AI, edge compute, and broadband helps power smartphones, routers, and consumer devices.' }),
      mk(14,{ name:'NXP Semiconductors', tagline:'Secure connected processing for auto and industrial', industries:['Automotive','Industrial','IoT'], solutions:['MCUs & MPUs','Automotive SoCs','Secure Connectivity'], services:['Enablement','Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=nxp.com&sz=128', website:'https://www.nxp.com/', fullDescription:'NXP delivers automotive processing platforms, secure connected MCUs/MPUs, and RF solutions. Strong in vehicle networking, radar, and industrial IoT with long‑term availability.' }),
      mk(15,{ name:'Analog Devices', tagline:'Signal processing, data converters, and power management', industries:['Industrial','Healthcare','Automotive'], solutions:['Analog & Mixed‑Signal','Data Conversion','Power'], services:['Design Tools','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=analog.com&sz=128', website:'https://www.analog.com/', fullDescription:'Analog Devices (ADI) provides precision analog, mixed‑signal, and power products with high reliability. Solutions span sensor interfaces, converters, and embedded platforms for mission‑critical applications.' }),
      mk(16,{ name:'Renesas', tagline:'MCUs, SoCs, and power devices for embedded systems', industries:['Automotive','Industrial','IoT'], solutions:['MCUs/MPUs','Power & Analog','Connectivity'], services:['Design Kits','Software','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=renesas.com&sz=128', website:'https://www.renesas.com/', fullDescription:'Renesas offers broad MCU/MPU portfolios, power management, and connectivity. Focus areas include automotive ECUs, industrial control, and IoT platforms with robust software support.' }),
      mk(17,{ name:'Microchip', tagline:'Reliable MCUs, analog, and connectivity with long-term supply', industries:['Industrial','Aerospace & Defense','IoT'], solutions:['MCUs/MPUs','Analog & Power','Connectivity'], services:['Long‑Life Supply','Tools','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=microchip.com&sz=128', website:'https://www.microchip.com/', fullDescription:'Microchip provides highly reliable microcontrollers, analog, and connectivity solutions with long product lifecycles. Extensive development tools and ecosystem speed time‑to‑market.' }),
      mk(18,{ name:'onsemi', tagline:'Power, sensing, and intelligent image solutions', industries:['Automotive','Industrial','Energy'], solutions:['Power SiC & IGBTs','Image Sensors','Sensing'], services:['Reference Designs','Support','Supply'], logoUrl:'https://www.google.com/s2/favicons?domain=onsemi.com&sz=128', website:'https://www.onsemi.com/', fullDescription:'onsemi focuses on intelligent power and sensing. Strengths include silicon carbide for EVs, industrial power solutions, and advanced image sensors for ADAS and vision.' }),
      mk(19,{ name:'UMC', tagline:'Global semiconductor foundry for mature and specialty nodes', industries:['Industrial','Consumer','Automotive'], solutions:['Foundry (22/28/40nm+)','Specialty (BCD/Embedded)'], services:['Manufacturing','Design Support','IP Ecosystem'], logoUrl:'https://www.google.com/s2/favicons?domain=umc.com&sz=128', website:'https://www.umc.com/', fullDescription:'United Microelectronics Corporation (UMC) provides foundry services across mature nodes and specialty processes like BCD and embedded solutions, serving diverse consumer and industrial markets.' }),
      mk(20,{ name:'GLOBALFOUNDRIES', tagline:'Foundry partner for feature-rich and RF technologies', industries:['Mobile','Auto','Industrial'], solutions:['RF SOI','FDX','Embedded NVM'], services:['Foundry Services','Design Enablement','Packaging'], logoUrl:'https://www.google.com/s2/favicons?domain=globalfoundries.com&sz=128', website:'https://www.globalfoundries.com/', fullDescription:'GLOBALFOUNDRIES delivers feature‑rich process technologies like RF SOI, FDX, and embedded NVM. Partner to automotive, mobile, and industrial customers seeking resilient supply.' }),
      mk(21,{ name:'SMIC', tagline:'Mainland China’s largest foundry for logic and specialty', industries:['Consumer','Industrial','IoT'], solutions:['Foundry Services','Mature Nodes','Specialty'], services:['Manufacturing','Design Enablement','Packaging'], logoUrl:'https://www.google.com/s2/favicons?domain=smics.com&sz=128', website:'https://www.smics.com/', fullDescription:'Semiconductor Manufacturing International Corporation (SMIC) provides foundry services primarily on mature nodes with growing specialty capabilities, serving domestic and global customers.' }),
      mk(22,{ name:'Marvell', tagline:'Data infrastructure silicon for cloud, carrier, and enterprise', industries:['Cloud','5G','Enterprise'], solutions:['DPUs & Storage','Networking','Carrier Infrastructure'], services:['Design Collaboration','Support','Software'], logoUrl:'https://www.google.com/s2/favicons?domain=marvell.com&sz=128', website:'https://www.marvell.com/', fullDescription:'Marvell designs data infrastructure silicon spanning networking, storage, DPUs, and carrier solutions. Collaborates closely with hyperscalers and carriers to optimize performance and power.' }),
      mk(23,{ name:'Skyworks', tagline:'High‑performance RF front‑end solutions', industries:['Mobile','Connectivity','Automotive'], solutions:['RF Front‑End','Filters','Amplifiers'], services:['Reference Designs','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=skyworksinc.com&sz=128', website:'https://www.skyworksinc.com/', fullDescription:'Skyworks provides RF front‑end modules and components enabling high‑efficiency, high‑linearity wireless communications across mobile, IoT, and automotive connectivity.' }),
      mk(24,{ name:'JCET', tagline:'Global OSAT offering advanced assembly and test', industries:['Consumer','Mobile','Industrial'], solutions:['Advanced Packaging','SiP','Test'], services:['Assembly','Test','Engineering'], logoUrl:'https://www.google.com/s2/favicons?domain=jcetglobal.com&sz=128', website:'https://www.jcetglobal.com/', fullDescription:'JCET Group is a global outsourced assembly and test (OSAT) provider delivering advanced packaging, SiP, and comprehensive test services for global semiconductor clients.' }),
      mk(25,{ name:'ams-OSRAM', tagline:'Optical sensing, illumination, and visualization', industries:['Automotive','Consumer','Industrial'], solutions:['LEDs & Emitters','Image & Optical Sensors','Laser Diodes'], services:['Application Support','Modules','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=ams-osram.com&sz=128', website:'https://ams-osram.com/', fullDescription:'ams‑OSRAM develops advanced optical solutions including LEDs, laser diodes, and image/optical sensors. Core markets include automotive lighting, consumer devices, and industrial sensing.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🏭</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Semiconductor Manufacturers</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">IDMs, foundries, fabless leaders, and OSATs</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore global manufacturers across logic, memory, RF, power, and advanced packaging.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 25 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"><GitCompare size={18}/> Compare Top 3</a>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><PhoneCall size={18}/> Get Expert Consultation</button>
          </div>
        </div>
      </section>
      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Semiconductor Manufacturers</h2>
              <div className="text-gray-600">25 curated companies across IDMs, foundries, fabless, memory, and OSAT</div>
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

