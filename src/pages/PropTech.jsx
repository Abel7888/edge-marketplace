'use client'


import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

import { useRouter } from 'next/navigation'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function StatCard({ num, label, icon, badge, sub }){
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border">
      <div className="text-3xl font-extrabold text-slate-900">{num}</div>
      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
        <span>{label}</span>
        {badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{badge}</span>}
      </div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      <div className="mt-2">{icon}</div>
    </div>
  )
}

function ValueCard({ bg, icon, title, sub, badge }){
  return (
    <div className={`${bg} rounded-xl p-6 border`}> 
      <div className="text-5xl">{icon}</div>
      <div className="mt-3 font-bold text-slate-900 text-lg">{title}</div>
      <div className="text-sm text-gray-700">{sub}</div>
      {badge && <div className="inline-flex mt-3 text-[10px] px-2 py-0.5 rounded-full bg-white/70 border">{badge}</div>}
    </div>
  )
}

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{x}</span>)}
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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PropTech(){
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
    if (!currentUser){ router.push('/login?redirect=/discover/proptech'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'PropTech' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/proptech'); return }
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

  const mgmt = useMemo(()=>{
    const mk = (i, data) => ({ id:`pm-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'AppFolio', tagline:'Modern property management platform for growth', industries:['Residential','Commercial'], solutions:['PMS','Leasing','Payments'], services:['Onboarding','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=appfolio.com&sz=128', website:'https://www.appfolio.com/', fullDescription:'AppFolio streamlines leasing, accounting, maintenance, and resident experiences in one platform. Automations, AI, and mobile apps help teams scale operations and improve NOI.' }),
      mk(2,{ name:'Yardi', tagline:'Enterprise-grade property and asset management suite', industries:['Residential','Commercial'], solutions:['PMS','Accounting','Asset Mgmt'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=yardi.com&sz=128', website:'https://www.yardi.com/', fullDescription:'Yardi provides a comprehensive suite across leasing, accounting, facilities, and asset management. Trusted by large portfolios to standardize workflows and reporting.' }),
      mk(3,{ name:'RealPage', tagline:'Performance-driven property operations and analytics', industries:['Residential'], solutions:['PMS','Revenue Mgmt','Marketing'], services:['Data Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=realpage.com&sz=128', website:'https://www.realpage.com/', fullDescription:'RealPage integrates property operations with revenue management, marketing, and resident tools. Data-driven insights help boost occupancy and optimize pricing.' }),
      mk(4,{ name:'Buildium', tagline:'Property management software for SMB operators', industries:['Residential'], solutions:['PMS','Leasing','Payments'], services:['Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=buildium.com&sz=128', website:'https://www.buildium.com/', fullDescription:'Buildium simplifies leasing, rent collection, and maintenance for small to mid-sized portfolios. Owners portals and resident tools reduce manual admin and phone calls.' }),
      mk(5,{ name:'Entrata', tagline:'Unified platform for multifamily operations', industries:['Residential'], solutions:['PMS','Marketing','Payments'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=entrata.com&sz=128', website:'https://www.entrata.com/', fullDescription:'Entrata offers an open, unified platform spanning marketing sites, leasing, payments, and operations. Integrations and modern UX power efficient multifamily teams.' }),
      mk(6,{ name:'DoorLoop', tagline:'All-in-one property management software', industries:['Residential','Commercial'], solutions:['PMS','Accounting','Leasing','Maintenance'], services:['Support','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=doorloop.com&sz=128', website:'https://www.doorloop.com/', fullDescription:'DoorLoop streamlines property management with comprehensive tools for rent collection, lease tracking, maintenance requests, and accounting. Designed for landlords and property managers to automate workflows, reduce manual tasks, and improve tenant communication. Features include online payments, financial reporting, tenant portals, and mobile access for managing properties from anywhere.' }),
      mk(7,{ name:'TurboTenant', tagline:'Free tools for independent landlords', industries:['Residential'], solutions:['Listings','Screening','Rent'], services:['Support'], logoUrl:'https://www.google.com/s2/favicons?domain=turbotenant.com&sz=128', website:'https://www.turbotenant.com/', fullDescription:'TurboTenant helps landlords list units, screen applicants, and collect rent online. Simple workflows and messaging reduce vacancy time and paperwork.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`st-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'ServiceTitan', tagline:'All-in-one software for home service businesses', industries:['Residential','Commercial'], solutions:['Field Service','Scheduling','Payments'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=servicetitan.com&sz=128', website:'https://www.servicetitan.com/', fullDescription:'ServiceTitan powers HVAC, plumbing, and electrical contractors with tools for dispatching, invoicing, and customer management. Mobile apps keep field teams connected while office staff track performance. Integrations with accounting and marketing platforms streamline operations. Built for scaling service businesses with real-time insights and automated workflows.' }),
      mk(2,{ name:'Bilt Rewards', tagline:'Loyalty program for renters paying rent', industries:['Residential'], solutions:['Payments','Rewards','Engagement'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=biltrewards.com&sz=128', website:'https://www.biltrewards.com/', fullDescription:'Bilt Rewards lets renters earn points on rent payments without fees, redeemable for travel, fitness, and home goods. Partners with major property managers to boost resident retention and satisfaction. Seamless integration with existing payment systems. Transforms rent from a cost into an opportunity for rewards and loyalty.' }),
      mk(3,{ name:'Pacaso', tagline:'Co-ownership platform for second homes', industries:['Residential'], solutions:['Fractional Ownership','Property Mgmt'], services:['Concierge','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=pacaso.com&sz=128', website:'https://www.pacaso.com/', fullDescription:'Pacaso enables co-ownership of luxury second homes with professional management and smart scheduling. Buyers own a fraction, enjoy hassle-free access, and benefit from appreciation. Platform handles maintenance, utilities, and coordination. Makes premium vacation properties accessible and affordable through shared ownership.' }),
      mk(4,{ name:'Hostaway', tagline:'All-in-one vacation rental management platform', industries:['Residential','Hospitality'], solutions:['PMS','Channel Mgmt','Automation'], services:['Onboarding','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=hostaway.com&sz=128', website:'https://www.hostaway.com/', fullDescription:'Hostaway centralizes bookings, guest communication, and operations for vacation rental hosts. Syncs with Airbnb, Vrbo, and Booking.com to prevent double bookings. Automated messaging, cleaning schedules, and financial reporting save time. Scales from single units to large portfolios with unified control and analytics.' }),
      mk(5,{ name:'JobNimbus', tagline:'CRM and project management for contractors', industries:['Residential','Commercial'], solutions:['CRM','Project Mgmt','Estimating'], services:['Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=jobnimbus.com&sz=128', website:'https://www.jobnimbus.com/', fullDescription:'JobNimbus helps roofing, siding, and restoration contractors manage leads, jobs, and teams in one platform. Track estimates, schedules, and customer interactions with mobile access. Integrations with accounting and marketing tools streamline workflows. Built for field service teams to close more deals and deliver projects on time.' }),
      mk(6,{ name:'Infogrid', tagline:'Smart building sensors and analytics platform', industries:['Commercial'], solutions:['IoT Sensors','Facilities Mgmt','Analytics'], services:['Installation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=infogrid.io&sz=128', website:'https://www.infogrid.io/', fullDescription:'Infogrid deploys wireless sensors to monitor air quality, occupancy, and equipment health in commercial buildings. Real-time alerts and dashboards help facility teams prevent issues and optimize operations. Reduces energy costs and improves tenant comfort with data-driven insights. Easy deployment without complex wiring or infrastructure changes.' }),
      mk(7,{ name:'EliseAI', tagline:'AI assistant for property management communication', industries:['Residential','Commercial'], solutions:['AI Chatbot','Leasing','Maintenance'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=eliseai.com&sz=128', website:'https://www.eliseai.com/', fullDescription:'EliseAI automates resident and prospect communication via text, email, and voice. Handles leasing inquiries, maintenance requests, and renewals 24/7 with natural language AI. Integrates with major property management systems to access real-time data. Frees onsite teams to focus on high-value interactions while improving response times.' }),
      mk(8,{ name:'OpenSpace', tagline:'AI-powered construction progress tracking', industries:['Commercial','Residential'], solutions:['Photo Documentation','Progress Tracking','AI Analytics'], services:['Onboarding','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=openspace.ai&sz=128', website:'https://www.openspace.ai/', fullDescription:'OpenSpace captures 360° photos during construction walkthroughs and uses AI to track progress against plans. Automatically organizes images by date and location for easy review. Helps project managers identify delays, verify work, and resolve disputes. Reduces site visits and documentation time while improving accountability and transparency.' }),
    ]
  }, [])

  const intelligence = useMemo(()=>{
    const mk = (i, data) => ({ id:`bi-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Matterport', tagline:'Digital twins of buildings and spaces', industries:['Commercial','Residential'], solutions:['3D Capture','Digital Twin'], services:['Capture','Platform'], logoUrl:'https://www.google.com/s2/favicons?domain=matterport.com&sz=128', website:'https://matterport.com/', fullDescription:'Matterport creates immersive 3D twins of buildings for marketing, facilities, and documentation. Capture devices and a cloud platform simplify scanning and sharing.' }),
      mk(2,{ name:'BrainBox AI', tagline:'Autonomous AI for HVAC optimization', industries:['Commercial'], solutions:['Energy Optimization','HVAC AI'], services:['Monitoring','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=brainboxai.com&sz=128', website:'https://brainboxai.com/', fullDescription:'BrainBox AI applies reinforcement learning to reduce HVAC energy costs and emissions. Autonomous controls improve comfort while cutting consumption in commercial buildings.' }),
      mk(3,{ name:'Switch Automation', tagline:'Portfolio-wide building performance platform', industries:['Commercial'], solutions:['IoT Integration','Analytics','Automation'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=switchautomation.com&sz=128', website:'https://switchautomation.com/', fullDescription:'Switch connects building systems and IoT data to a unified platform for analytics and automation. Operators detect faults, optimize performance, and standardize KPIs.' }),
      mk(4,{ name:'Enlighted (Siemens)', tagline:'IoT sensors and smart building applications', industries:['Commercial'], solutions:['Smart Sensors','Space & Energy Apps'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=siemens.com&sz=128', website:'https://www.siemens.com/enlighted', fullDescription:'Enlighted provides dense IoT sensor networks and apps for space utilization, energy, and indoor positioning—enabling data‑driven building intelligence at scale.' }),
      mk(5,{ name:'Honeywell Building Solutions', tagline:'Integrated building management and safety', industries:['Commercial','Industrial'], solutions:['BMS','Life Safety','Energy'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=buildings.honeywell.com&sz=128', website:'https://buildings.honeywell.com/us/en', fullDescription:'Honeywell integrates BMS, safety, and energy optimization for complex facilities. Solutions span building controls, fire systems, and occupant experience apps.' }),
      mk(6,{ name:'Johnson Controls', tagline:'OpenBlue platform for smart, healthy buildings', industries:['Commercial','Industrial'], solutions:['BMS','Security','Energy'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=johnsoncontrols.com&sz=128', website:'https://www.johnsoncontrols.com/', fullDescription:'Johnson Controls’ OpenBlue platform connects building systems for safer, efficient operations. Solutions include HVAC, security, and sustainability services.' }),
      mk(7,{ name:'Verdigris', tagline:'AI energy monitoring and anomaly detection', industries:['Commercial'], solutions:['Energy Analytics','Submetering'], services:['Monitoring','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=verdigris.co&sz=128', website:'https://www.verdigris.co/', fullDescription:'Verdigris uses high‑frequency sensing and AI to monitor equipment and detect anomalies, reducing downtime and energy spend across portfolios.' }),
      mk(8,{ name:'Distech Controls', tagline:'Open building automation and controls', industries:['Commercial'], solutions:['BAS','IoT Controls'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=distech-controls.com&sz=128', website:'https://www.distech-controls.com/', fullDescription:'Distech delivers open building automation solutions with IoT‑ready controllers and modern UIs, enabling flexible integration and energy‑efficient operations.' }),
    ]
  }, [])

  const facilities = useMemo(()=>{
    const mk = (i, data) => ({ id:`sf-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'ButterflyMX', tagline:'Mobile access control and visitor management', industries:['Multifamily','Commercial'], solutions:['Access Control','Intercom'], services:['Installation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=butterflymx.com&sz=128', website:'https://www.butterflymx.com/', fullDescription:'ButterflyMX replaces key fobs with smartphone access and video intercoms. Integrates with PMS and directory systems to streamline visitor and delivery management.' }),
      mk(2,{ name:'Kisi', tagline:'Cloud-based access control for modern buildings', industries:['Commercial'], solutions:['Access Control','Integrations'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=kisi.io&sz=128', website:'https://www.kisi.io/', fullDescription:'Kisi offers cloud‑managed access control with easy provisioning, audit trails, and integrations. Scales from single sites to enterprise portfolios.' }),
      mk(3,{ name:'Awair', tagline:'Indoor air quality monitoring and insights', industries:['Commercial','Education'], solutions:['IAQ Sensors','Analytics'], services:['Monitoring','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=getawair.com&sz=128', website:'https://www.getawair.com/', fullDescription:'Awair monitors indoor air quality (CO₂, VOCs, PM2.5, etc.) and provides insights to improve health, comfort, and compliance in offices and classrooms.' }),
      mk(4,{ name:'Samsara', tagline:'Connected operations for physical assets', industries:['Industrial','Commercial'], solutions:['Telematics','IoT Sensors'], services:['Monitoring','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=samsara.com&sz=128', website:'https://www.samsara.com/', fullDescription:'Samsara unifies data from fleets, equipment, and facilities to improve safety and efficiency. Dashboards and APIs connect operations across the enterprise.' }),
      mk(5,{ name:'Enertiv', tagline:'Data-driven facilities performance and maintenance', industries:['Commercial'], solutions:['Energy','Asset Intelligence'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=enertiv.com&sz=128', website:'https://www.enertiv.com/', fullDescription:'Enertiv captures equipment‑level data and turns it into actionable insights for energy savings, predictive maintenance, and capex planning.' }),
      mk(6,{ name:'POINT', tagline:'Clean energy and building decarbonization', industries:['Commercial','Industrial'], solutions:['Energy Optimization','Retrofits'], services:['Advisory','Implementation'], logoUrl:'https://www.google.com/s2/favicons?domain=point.energy&sz=128', website:'https://www.point.energy/', fullDescription:'POINT partners with building owners to plan and execute decarbonization—combining energy analytics, retrofit programs, and financing pathways.' }),
    ]
  }, [])

  const finance = useMemo(()=>{
    const mk = (i, data) => ({ id:`re-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Fundrise', tagline:'Online real estate investing for individuals', industries:['Investment'], solutions:['REITs','Private Real Estate'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=fundrise.com&sz=128', website:'https://fundrise.com/', fullDescription:'Fundrise provides diversified real estate portfolios via online REITs and private offerings. Long‑term strategies focus on income and growth with low minimums.' }),
      mk(2,{ name:'Roofstock', tagline:'SFR investing and portfolio services', industries:['Investment'], solutions:['Marketplace','Property Mgmt'], services:['Acquisitions','Management'], logoUrl:'https://www.google.com/s2/favicons?domain=roofstock.com&sz=128', website:'https://www.roofstock.com/', fullDescription:'Roofstock enables single‑family rental investing through a vetted marketplace, data analytics, and property management services for passive ownership.' }),
      mk(3,{ name:'Cadre', tagline:'Institutional-quality commercial real estate access', industries:['Investment'], solutions:['Direct Deals','Secondary'], services:['Advisory','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=cadre.com&sz=128', website:'https://cadre.com/', fullDescription:'Cadre offers access to institutional real estate deals with transparency, data‑driven underwriting, and liquidity options via a secondary marketplace.' }),
      mk(4,{ name:'Opendoor', tagline:'iBuying platform for instant home sales', industries:['Residential'], solutions:['iBuying','Pricing'], services:['Selling Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=opendoor.com&sz=128', website:'https://www.opendoor.com/', fullDescription:'Opendoor provides near‑instant cash offers and flexible close timelines for home sellers, using data‑driven pricing and streamlined buyer experiences.' }),
      mk(5,{ name:'Blend', tagline:'Digital lending platform for mortgages and banking', industries:['Lending'], solutions:['Mortgage','Consumer Banking'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=blend.com&sz=128', website:'https://blend.com/', fullDescription:'Blend powers digital mortgage and banking experiences for lenders, simplifying applications, verification, and closing across products.' }),
      mk(6,{ name:'Yieldstreet', tagline:'Alternative investments including real estate', industries:['Investment'], solutions:['Alternative Assets'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=yieldstreet.com&sz=128', website:'https://www.yieldstreet.com/', fullDescription:'Yieldstreet offers alternative investments with access to real estate, credit, and art. Platform tools help diversify portfolios beyond public markets.' }),
      mk(7,{ name:'PeerStreet', tagline:'Real estate debt investing marketplace', industries:['Investment'], solutions:['Real Estate Notes'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=peerstreet.com&sz=128', website:'https://www.peerstreet.com/', fullDescription:'PeerStreet provides access to diversified real‑estate debt investments, connecting accredited investors to short‑term property loans with transparent data.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🏢</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">PropTech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Smart buildings, operations, and real estate platforms</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore property & asset management, building intelligence, facilities, and real estate finance technology.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#pm" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* Divider (first section) */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-green-700 font-semibold tracking-wide">Property & Asset Management</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* 🏢 Property & Asset Management */}
      <section id="pm" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mgmt.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-green-700 font-semibold tracking-wide">Building Intelligence & Automation</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* 🧠 Building Intelligence & Automation */}
      <section id="bi" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {intelligence.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Smart Facilities & Infrastructure</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* 🏭 Smart Facilities & Infrastructure */}
      <section id="sf" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {facilities.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-cyan-700 font-semibold tracking-wide">Real Estate Finance & Investment Tech</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* 💰 Real Estate Finance & Investment Tech */}
      <section id="re" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {finance.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v.id)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-purple-700 font-semibold tracking-wide">Fast Growing Startups</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* 🚀 Fast Growing Startups */}
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

