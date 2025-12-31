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

export default function IoT(){
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
    if (!currentUser){ router.push('/login?redirect=/discover/iot'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'IoT' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/iot'); return }
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

  const platformVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`iot-plat-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'AWS IoT', tagline:'Managed IoT services on AWS', industries:['All'], solutions:['Device Mgmt','IoT Core','Analytics'], services:['Managed','Support'], website:'https://aws.amazon.com/iot/', logoUrl:'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128', fullDescription:'AWS IoT provides secure device connectivity, device management, digital twins, rules engine, and analytics integrated with the AWS cloud.' }),
      mk(2,{ name:'Microsoft Azure IoT', tagline:'Secure IoT on Azure cloud', industries:['All'], solutions:['IoT Hub','Device Mgmt','Digital Twins'], services:['Managed','Support'], website:'https://azure.microsoft.com/en-us/solutions/iot/', logoUrl:'https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=128', fullDescription:'Azure IoT offers IoT Hub, Device Update, and Azure Digital Twins for building scalable, secure IoT solutions integrated with Azure services.' }),
      mk(3,{ name:'Google Cloud IoT', tagline:'Device connectivity and data on GCP', industries:['All'], solutions:['Device Mgmt','Data','Analytics'], services:['Managed','Support'], website:'https://cloud.google.com/solutions/iot', logoUrl:'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128', fullDescription:'Google Cloud IoT enables device connectivity, data ingestion, and analytics with integration to Pub/Sub, BigQuery, and Vertex AI.' }),
      mk(4,{ name:'PTC ThingWorx', tagline:'Industrial IoT platform', industries:['Industrial','Manufacturing'], solutions:['IIoT','Digital Twins','Apps'], services:['Implementation','Support'], website:'https://www.ptc.com/en/products/thingworx', logoUrl:'https://www.google.com/s2/favicons?domain=ptc.com&sz=128', fullDescription:'ThingWorx accelerates IIoT apps, digital twins, and analytics for industrial enterprises with model-driven development.' }),
      mk(5,{ name:'Losant', tagline:'Enterprise IoT application platform', industries:['Industrial','Smart Buildings'], solutions:['Workflows','Dashboards','Devices'], services:['Implementation','Support'], website:'https://www.losant.com/', logoUrl:'https://www.google.com/s2/favicons?domain=losant.com&sz=128', fullDescription:'Losant provides a low-code platform to build IoT applications with device management, workflows, and dashboards.' }),
      mk(6,{ name:'Particle', tagline:'IoT connectivity and device cloud', industries:['Industrial','Consumer'], solutions:['Device OS','Connectivity','Cloud'], services:['Hardware','Support'], website:'https://www.particle.io/', logoUrl:'https://www.google.com/s2/favicons?domain=particle.io&sz=128', fullDescription:'Particle combines hardware modules, connectivity, and a device cloud to build connected products quickly.' }),
      mk(7,{ name:'Blynk', tagline:'No-code mobile apps for IoT', industries:['Makers','SMB'], solutions:['Mobile Apps','Device Mgmt'], services:['Cloud','Support'], website:'https://blynk.io/', logoUrl:'https://www.google.com/s2/favicons?domain=blynk.io&sz=128', fullDescription:'Blynk lets teams create branded mobile apps and manage devices without heavy custom development.' }),
      mk(8,{ name:'akenza', tagline:'Low-code IoT platform', industries:['Industrial','Smart Cities'], solutions:['Device Mgmt','Data','Rules'], services:['Implementation','Support'], website:'https://www.akenza.io/', logoUrl:'https://www.google.com/s2/favicons?domain=akenza.io&sz=128', fullDescription:'akenza connects devices, manages data flows, and builds IoT solutions using a low-code environment.' }),
      mk(9,{ name:'KaaIoT', tagline:'Open-source-based IoT platform', industries:['Industrial','Energy'], solutions:['Device Mgmt','Data','Dashboards'], services:['Implementation','Support'], website:'https://www.kaaiot.com/', logoUrl:'https://www.google.com/s2/favicons?domain=kaaiot.com&sz=128', fullDescription:'KaaIoT offers device management, data collection, and visualization with a modular, extensible architecture.' }),
      mk(10,{ name:'Radix IoT', tagline:'Mango OS for remote monitoring', industries:['Industrial','Buildings'], solutions:['Monitoring','Dashboards'], services:['Implementation','Support'], website:'https://www.radixiot.com/', logoUrl:'https://www.google.com/s2/favicons?domain=radixiot.com&sz=128', fullDescription:'Radix IoT’s Mango OS powers remote monitoring, control, and dashboards for distributed assets and facilities.' }),
      mk(11,{ name:'1NCE', tagline:'IoT connectivity platform', industries:['All'], solutions:['Global SIM','Connectivity Mgmt'], services:['Managed','Support'], website:'https://1nce.com/', logoUrl:'https://www.google.com/s2/favicons?domain=1nce.com&sz=128', fullDescription:'1NCE provides global IoT connectivity with simple pricing and lifecycle management for devices.' }),
      mk(12,{ name:'Gurtam (Wialon)', tagline:'Telematics & fleet IoT platform', industries:['Fleet','Logistics'], solutions:['Telematics','Tracking'], services:['Implementation','Support'], website:'https://gurtam.com/', logoUrl:'https://www.google.com/s2/favicons?domain=gurtam.com&sz=128', fullDescription:'Gurtam’s Wialon is a telematics platform for fleet tracking and IoT with a large device ecosystem.' }),
    ]
  }, [])

  const hardwareVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`iot-hw-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Quectel', tagline:'IoT modules and antennas', industries:['All'], solutions:['Cellular Modules','GNSS','Antennas'], services:['Hardware','Support'], website:'https://www.quectel.com/', logoUrl:'https://www.google.com/s2/favicons?domain=quectel.com&sz=128', fullDescription:'Quectel provides a broad portfolio of cellular, GNSS, and short-range modules and antennas for IoT devices.' }),
      mk(2,{ name:'Telit Cinterion', tagline:'Modules, connectivity, and platforms', industries:['All'], solutions:['Cellular Modules','Connectivity'], services:['Hardware','Managed'], website:'https://www.telit.com/', logoUrl:'https://www.google.com/s2/favicons?domain=telit.com&sz=128', fullDescription:'Telit Cinterion offers IoT modules, connectivity services, and device management for end-to-end solutions.' }),
      mk(3,{ name:'u-blox', tagline:'GNSS and short-range modules', industries:['All'], solutions:['GNSS','Wi‑Fi/BLE'], services:['Hardware','Support'], website:'https://www.u-blox.com/', logoUrl:'https://www.google.com/s2/favicons?domain=u-blox.com&sz=128', fullDescription:'u-blox supplies positioning and wireless communication modules for precise, reliable IoT devices.' }),
      mk(4,{ name:'Nordic Semiconductor', tagline:'Low-power wireless SoCs', industries:['All'], solutions:['BLE','Thread','Cellular IoT'], services:['Silicon','SDK'], website:'https://www.nordicsemi.com/', logoUrl:'https://www.google.com/s2/favicons?domain=nordicsemi.com&sz=128', fullDescription:'Nordic builds ultra-low-power wireless SoCs and dev kits used in BLE, Thread, Matter, and cellular IoT products.' }),
      mk(5,{ name:'Sierra Wireless', tagline:'Routers, modules, and connectivity', industries:['All'], solutions:['Gateways','Modules','Connectivity'], services:['Managed','Support'], website:'https://www.sierrawireless.com/', logoUrl:'https://www.google.com/s2/favicons?domain=sierrawireless.com&sz=128', fullDescription:'Sierra Wireless provides cellular routers, modules, and connectivity for enterprise and industrial IoT.' }),
      mk(6,{ name:'Advantech', tagline:'Industrial PCs and gateways', industries:['Industrial'], solutions:['Edge Gateways','IPC','Sensors'], services:['Hardware','Support'], website:'https://www.advantech.com/', logoUrl:'https://www.google.com/s2/favicons?domain=advantech.com&sz=128', fullDescription:'Advantech offers rugged industrial PCs, gateways, and sensors for edge data acquisition and control.' }),
      mk(7,{ name:'Fibocom', tagline:'Cellular modules and solutions', industries:['All'], solutions:['5G/LTE Modules','CPE'], services:['Hardware','Support'], website:'https://www.fibocom.com/', logoUrl:'https://www.google.com/s2/favicons?domain=fibocom.com&sz=128', fullDescription:'Fibocom delivers 5G/LTE modules and reference designs for IoT and CPE applications.' }),
      mk(8,{ name:'Espressif Systems', tagline:'Wi‑Fi/BLE SoCs (ESP32/ESP8266)', industries:['Consumer','Industrial'], solutions:['Wi‑Fi','BLE'], services:['Silicon','SDK'], website:'https://www.espressif.com/', logoUrl:'https://www.google.com/s2/favicons?domain=espressif.com&sz=128', fullDescription:'Espressif makes ESP32/ESP8266 SoCs widely used for connected devices with Wi‑Fi and BLE.' }),
      mk(9,{ name:'Kontron', tagline:'Embedded computing and edge', industries:['Industrial'], solutions:['Embedded','Gateways'], services:['Hardware','Support'], website:'https://www.kontron.com/', logoUrl:'https://www.google.com/s2/favicons?domain=kontron.com&sz=128', fullDescription:'Kontron builds embedded boards, systems, and gateways for industrial IoT and edge computing.' }),
    ]
  }, [])

  const appVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`iot-app-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Uptake', tagline:'Industrial analytics and AI', industries:['Industrial'], solutions:['Predictive Maintenance','Optimization'], services:['Implementation','Support'], website:'https://www.uptake.com/', logoUrl:'https://www.google.com/s2/favicons?domain=uptake.com&sz=128', fullDescription:'Uptake delivers analytics and AI for industrial assets to boost reliability and performance.' }),
      mk(2,{ name:'Everactive', tagline:'Batteryless industrial sensing', industries:['Industrial'], solutions:['Condition Monitoring'], services:['Hardware','Support'], website:'https://everactive.com/', logoUrl:'https://www.google.com/s2/favicons?domain=everactive.com&sz=128', fullDescription:'Everactive provides batteryless sensors and analytics for continuous condition monitoring.' }),
      mk(3,{ name:'GAO Tek', tagline:'RFID and IoT solutions', industries:['Industrial','Retail'], solutions:['RFID','Tracking'], services:['Hardware','Support'], website:'https://gaotek.com/', logoUrl:'https://www.google.com/s2/favicons?domain=gaotek.com&sz=128', fullDescription:'GAO Tek offers RFID hardware and solutions for tracking, inventory, and automation.' }),
      mk(4,{ name:'Senseye', tagline:'Predictive maintenance for industry', industries:['Industrial'], solutions:['PdM','Analytics'], services:['Implementation','Support'], website:'https://www.senseye.io/', logoUrl:'https://www.google.com/s2/favicons?domain=senseye.io&sz=128', fullDescription:'Senseye provides predictive maintenance analytics to reduce downtime and improve OEE.' }),
      mk(5,{ name:'ioX-Connect', tagline:'IoT solutions and platforms', industries:['Industrial','Logistics'], solutions:['Tracking','Monitoring'], services:['Implementation','Support'], website:'https://www.iox-connect.com/', logoUrl:'https://www.google.com/s2/favicons?domain=iox-connect.com&sz=128', fullDescription:'ioX-Connect delivers IoT platforms and solutions for tracking and monitoring assets and operations.' }),
      mk(6,{ name:'Smartia', tagline:'Industrial AI and analytics', industries:['Industrial'], solutions:['Analytics','Optimization'], services:['Implementation','Support'], website:'https://www.smartia.tech/', logoUrl:'https://www.google.com/s2/favicons?domain=smartia.tech&sz=128', fullDescription:'Smartia helps manufacturers deploy AI and analytics to optimize processes and quality.' }),
      mk(7,{ name:'Augury', tagline:'Machine health and diagnostics', industries:['Industrial'], solutions:['Machine Health','Vibration'], services:['Implementation','Support'], website:'https://www.augury.com/', logoUrl:'https://www.google.com/s2/favicons?domain=augury.com&sz=128', fullDescription:'Augury uses vibration and AI to monitor machine health and prevent failures.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🌐</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent mb-4">Internet of Things</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Sensors, connectivity, edge devices</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Connect devices to insights—from sensors and connectivity to edge compute and digital twins.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 25 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      {/* 1. IoT Platform Vendors (Cloud & Data Management) */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-cyan-700 font-semibold tracking-wide">IoT Platform Vendors (Cloud & Data Management)</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="platforms" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {platformVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. IoT Hardware & Connectivity */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-cyan-700 font-semibold tracking-wide">IoT Hardware & Connectivity</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="hardware" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hardwareVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. IoT Application & Analytics Vendors */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-cyan-700 font-semibold tracking-wide">IoT Application & Analytics Vendors</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="applications" className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {appVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}

