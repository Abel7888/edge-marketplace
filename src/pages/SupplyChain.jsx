import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'

function VendorCard({ v, saved, onToggleSave }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-lime-500/20">
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
              {v.industries.map(x => (
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => (
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-lime-50 text-lime-700 border border-lime-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => (
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 border-2 border-emerald-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button className="h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${saved? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-400'}`}>
            <Heart size={16} className={saved? 'text-emerald-500 fill-current' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SupplyChain(){
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [saved, setSaved] = useState(new Set())

  useEffect(()=>{
    if (!currentUser) return
    const unsub = fsSubscribeSaved(currentUser.uid, (list)=>{
      setSaved(new Set(list.map(x=> String(x.id))))
    })
    return ()=> unsub && unsub()
  }, [currentUser])

  async function toggleSaveVendor(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/supply-chain'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Supply Chain' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  const factory = useMemo(()=>{
    const mk = (i, data) => ({ id:`sf-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Rockwell Automation', tagline:'Industrial automation and digital transformation', industries:['Manufacturing','Automotive','Food & Bev'], solutions:['PLC/SCADA','MES','Industrial IoT'], services:['Consulting','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=rockwellautomation.com&sz=128', website:'https://www.rockwellautomation.com/', fullDescription:'Rockwell provides automation hardware, FactoryTalk software, and digital transformation services to unify control, information, and operations for smart factories.' }),
      mk(2,{ name:'Honeywell', tagline:'Automation, safety, and enterprise solutions', industries:['Manufacturing','Logistics','Energy'], solutions:['Sensors','Controls','WMS'], services:['Implementation','Managed Services'], logoUrl:'https://www.google.com/s2/favicons?domain=honeywell.com&sz=128', website:'https://www.honeywell.com/us/en', fullDescription:'Honeywell delivers industrial controls, safety, and warehouse solutions that improve productivity, quality, and sustainability across operations.' }),
      mk(3,{ name:'ABB', tagline:'Robotics and electrification for industry', industries:['Manufacturing','Automotive','Electronics'], solutions:['Robotics','Drives','Digital Twin'], services:['Integration','Maintenance'], logoUrl:'https://www.google.com/s2/favicons?domain=abb.com&sz=128', website:'https://new.abb.com/', fullDescription:'ABB combines robotics, electrification, and digital platforms to automate production with energy efficiency and high uptime.' }),
      mk(4,{ name:'RIOS', tagline:'AI-powered robotic workcells', industries:['Manufacturing','E-commerce'], solutions:['Robotic Cells','Vision AI'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=rios.ai&sz=128', website:'https://rios.ai/', fullDescription:'RIOS builds intelligent robotic stations that automate repetitive tasks on the factory floor with perception, motion planning, and QA.' }),
      mk(5,{ name:'Poka', tagline:'Connected worker platform for factories', industries:['Manufacturing'], solutions:['Knowledge','Skills','Collaboration'], services:['Rollout','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=poka.io&sz=128', website:'https://www.poka.io/', fullDescription:'Poka unifies work instructions, skills tracking, and collaboration to close workforce knowledge gaps and boost OEE.' }),
      mk(6,{ name:'Trio Mobil', tagline:'Real-time visibility and safety in industry', industries:['Manufacturing','Logistics'], solutions:['RTLS','Forklift Safety','Condition Monitoring'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=triomobil.com&sz=128', website:'https://triomobil.com/', fullDescription:'Trio Mobil provides AI and IoT to track assets, ensure safety, and predict maintenance in factories and warehouses.' }),
      mk(7,{ name:'Apptronik', tagline:'General-purpose humanoid robots', industries:['Manufacturing','Logistics'], solutions:['Robotics','Autonomy'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=apptronik.com&sz=128', website:'https://www.apptronik.com/', fullDescription:'Apptronik develops Apollo humanoid robots to automate physically demanding tasks alongside people in industrial environments.' }),
    ]
  }, [])

  const visibility = useMemo(()=>{
    const mk = (i, data) => ({ id:`sv-${String(i).padStart(3,'0')}`, ...data })
    const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    return [
      mk(1,{ name:'project44', tagline:'Real‑time multimodal transportation visibility', industries:['Logistics','Retail','Manufacturing'], solutions:['RTTVP','Carrier Network','Analytics'], services:['Implementation','Support'], logoUrl:fav('project44.com'), website:'https://project44.com', fullDescription:'project44 connects to a vast global carrier network to deliver real‑time visibility across parcel, LTL, ocean, rail, and truckload. Data is normalized and enriched to provide predictive ETAs, dwell insights, and exception alerts. Shippers and 3PLs improve on‑time performance, inventory accuracy, and customer experience with proactive workflows.' }),
      mk(2,{ name:'Tive', tagline:'Live shipment tracking with IoT sensors and cloud platform', industries:['Cold Chain','Pharma','Food & Bev','Electronics'], solutions:['Trackers','Platform','Alerts'], services:['Onboarding','Global Coverage'], logoUrl:fav('tive.com'), website:'https://tive.com', fullDescription:'Tive delivers end‑to‑end visibility via cellular trackers and a cloud platform providing live location, temperature, humidity, and shock. Real‑time alerts reduce spoilage, damage, and delays across lanes worldwide. Easy to deploy for shippers and logistics providers, with APIs, sharing links, and compliance‑ready reporting.' }),
      mk(3,{ name:'FourKites', tagline:'Predictive visibility for ocean, road, rail, and air', industries:['Logistics','CPG','Retail'], solutions:['ETAs','Yard Mgmt','Appointments'], services:['Integration','Optimization'], logoUrl:fav('fourkites.com'), website:'https://fourkites.com', fullDescription:'FourKites provides predictive ETAs and unified visibility spanning over‑the‑road, ocean, rail, and air. Yard and appointment management reduce detention and dwell, while analytics highlight bottlenecks and savings opportunities. Collaboration tools align carriers, shippers, and consignees for more reliable delivery performance.' }),
      mk(4,{ name:'Savi Technology', tagline:'IoT‑driven asset and cargo tracking with analytics', industries:['Defense','Aerospace','Logistics'], solutions:['Sensors','Analytics','In‑Transit Visibility'], services:['Deployment','Programs'], logoUrl:fav('savi.com'), website:'https://www.savi.com', fullDescription:'Savi Technology combines IoT sensors, RF/satellite connectivity, and advanced analytics to track assets and cargo globally. Built from military‑grade origins, the platform strengthens chain of custody and resilience. Organizations gain continuous in‑transit inventory visibility and alerting for route deviations and risk.' }),
      mk(5,{ name:'Blume Global', tagline:'Intermodal visibility and supply chain orchestration', industries:['Logistics','Intermodal','Rail'], solutions:['Planning','Execution','Exceptions'], services:['Managed Services','Support'], logoUrl:fav('blumeglobal.com'), website:'https://www.blumeglobal.com', fullDescription:'Blume Global offers supply chain orchestration and visibility across complex intermodal networks. Planning, execution, and exception management workflows optimize capacity, cost, and service. AI‑driven insights help logistics providers and BCOs coordinate partners and improve on‑time performance.' }),
    ]
  }, [])

  const planning = useMemo(()=>{
    const mk = (i, data) => ({ id:`sp-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Blue Yonder', tagline:'End-to-end supply chain planning & execution', industries:['Retail','Manufacturing','CPG'], solutions:['Demand','Inventory','WMS/TMS'], services:['Implementation','Optimization'], logoUrl:'https://www.google.com/s2/favicons?domain=blueyonder.com&sz=128', website:'https://blueyonder.com/', fullDescription:'Blue Yonder provides AI-driven planning and execution across demand, inventory, warehousing, and transportation to improve service and margins.' }),
      mk(2,{ name:'o9 Solutions', tagline:'Digital brain for enterprise planning', industries:['Manufacturing','Retail'], solutions:['IBP','Demand/Supply','S&OP'], services:['Design','Implementation'], logoUrl:'https://www.google.com/s2/favicons?domain=o9solutions.com&sz=128', website:'https://o9solutions.com/', fullDescription:'o9 delivers an AI-enabled platform for integrated business planning with scenario modeling and real-time signals.' }),
      mk(3,{ name:'Manhattan Associates', tagline:'Supply chain commerce software', industries:['Retail','Logistics'], solutions:['WMS','TMS','OMS'], services:['Implementation','Managed Services'], logoUrl:'https://www.google.com/s2/favicons?domain=manh.com&sz=128', website:'https://www.manh.com/', fullDescription:'Manhattan offers warehouse, transportation, and order management solutions to orchestrate omnichannel supply chains.' }),
      mk(4,{ name:'Flexport', tagline:'Global logistics and freight platform', industries:['Logistics','Trade'], solutions:['Freight','Customs','Visibility'], services:['Brokerage','Operations'], logoUrl:'https://www.google.com/s2/favicons?domain=flexport.com&sz=128', website:'https://www.flexport.com/', fullDescription:'Flexport unifies freight forwarding, customs, and visibility to simplify global logistics with data-driven decisions.' }),
      mk(5,{ name:'Altana AI', tagline:'Global supply chain intelligence graph', industries:['Enterprise','Government'], solutions:['Visibility','Risk','Compliance'], services:['Data Services','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=altana.ai&sz=128', website:'https://www.altana.ai/', fullDescription:'Altana builds a shared intelligence platform to map and manage global supply chains across risk, compliance, and resilience.' }),
      mk(6,{ name:'Ceres Technology', tagline:'Supply chain optimization', industries:['Manufacturing','Retail'], solutions:['Planning','Optimization'], services:['Consulting'], logoUrl:'', website:'', fullDescription:'Ceres Technology provides planning and optimization services to improve supply chain performance and responsiveness.' }),
      mk(7,{ name:'Onebeat', tagline:'Agile retail inventory and flow', industries:['Retail'], solutions:['Replenishment','Assortment','Allocation'], services:['Implementation','Advisory'], logoUrl:'https://www.google.com/s2/favicons?domain=onebeat.ai&sz=128', website:'https://onebeat.ai/', fullDescription:'Onebeat applies real-time analytics to align inventory with demand, reducing stockouts and excess across stores and DCs.' }),
    ]
  }, [])

  const sustainability = useMemo(()=>{
    const mk = (i, data) => ({ id:`so-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'nZero', tagline:'Real-time carbon accounting and insights', industries:['Enterprise','Cities'], solutions:['Carbon Accounting','Energy Insights'], services:['Implementation','Advisory'], logoUrl:'https://www.google.com/s2/favicons?domain=nzero.com&sz=128', website:'https://www.nzero.com/', fullDescription:'nZero provides 24/7 emissions measurement and analytics to help organizations track, reduce, and report climate impact.' }),
      mk(2,{ name:'Carbmee', tagline:'Enterprise carbon management platform', industries:['Manufacturing','Automotive'], solutions:['Scope 1-3','Supplier Data'], services:['Implementation','Consulting'], logoUrl:'https://www.google.com/s2/favicons?domain=carbmee.com&sz=128', website:'https://www.carbmee.com/', fullDescription:'Carbmee enables product and supply chain decarbonization with automated data collection and reduction planning.' }),
      mk(3,{ name:'Newlight Technologies', tagline:'Aircarbon-based sustainable materials', industries:['Materials','CPG'], solutions:['Biomaterials','Packaging'], services:['Partnerships'], logoUrl:'https://www.google.com/s2/favicons?domain=newlight.com&sz=128', website:'https://www.newlight.com/', fullDescription:'Newlight creates Aircarbon, a regenerative biomaterial that replaces plastics in packaging and products.' }),
      mk(4,{ name:'Graphyte', tagline:'Permanent carbon removal at scale', industries:['Energy','Enterprise'], solutions:['Carbon Removal'], services:['Projects','Certifications'], logoUrl:'https://www.google.com/s2/favicons?domain=graphyte.com&sz=128', website:'https://www.graphyte.com/', fullDescription:'Graphyte delivers durable, measurable carbon removal to help organizations meet sustainability commitments.' }),
      mk(5,{ name:'Assent', tagline:'Supply chain sustainability & compliance', industries:['Manufacturing'], solutions:['ESG','Compliance','Supplier Management'], services:['Advisory','Managed Services'], logoUrl:'https://www.google.com/s2/favicons?domain=assent.com&sz=128', website:'https://www.assent.com/', fullDescription:'Assent helps manufacturers manage ESG data, product compliance, and supplier engagement across complex supply chains.' }),
      mk(6,{ name:'EcoVadis', tagline:'Sustainability ratings for global supply chains', industries:['Enterprise','Procurement'], solutions:['Ratings','Scorecards','Supplier Engagement'], services:['Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=ecovadis.com&sz=128', website:'https://ecovadis.com/', fullDescription:'EcoVadis evaluates supplier sustainability performance and enables buyers to improve ESG across the value chain.' }),
      mk(7,{ name:'Schneider Electric', tagline:'Energy management and industrial automation', industries:['Manufacturing','Energy'], solutions:['Energy','Automation','Software'], services:['Consulting','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=se.com&sz=128', website:'https://www.se.com/', fullDescription:'Schneider provides energy, automation, and software solutions to optimize operations and sustainability.' }),
    ]
  }, [])

  const industrialCloud = useMemo(()=>{
    const mk = (i, data) => ({ id:`ic-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'SAP', tagline:'Enterprise applications for industry', industries:['Manufacturing','Supply Chain'], solutions:['ERP','IBP','PLM'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=sap.com&sz=128', website:'https://www.sap.com/', fullDescription:'SAP delivers ERP, supply chain planning, and product lifecycle solutions tailored for industrial enterprises.' }),
      mk(2,{ name:'Oracle', tagline:'Cloud applications and infrastructure', industries:['Manufacturing','Logistics'], solutions:['ERP','SCM Cloud','Database'], services:['Cloud','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=oracle.com&sz=128', website:'https://www.oracle.com/', fullDescription:'Oracle provides integrated cloud applications and infrastructure for finance, supply chain, and manufacturing.' }),
      mk(3,{ name:'Augmentir', tagline:'AI-powered connected worker platform', industries:['Manufacturing','Service'], solutions:['Guided Workflows','Skills'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=augmentir.com&sz=128', website:'https://www.augmentir.com/', fullDescription:'Augmentir improves frontline productivity and quality with AI-assisted guidance, skills, and analytics.' }),
      mk(4,{ name:'Workerbase', tagline:'No-code apps for frontline operations', industries:['Manufacturing'], solutions:['Workflows','Analytics','Wearables'], services:['Implementation','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=workerbase.com&sz=128', website:'https://www.workerbase.com/', fullDescription:'Workerbase enables rapid creation of frontline apps for production, maintenance, and logistics on wearables and mobiles.' }),
      mk(5,{ name:'Propel Software', tagline:'Cloud-native PLM and QMS', industries:['Manufacturing','MedTech','High Tech'], solutions:['PLM','QMS','Change Mgmt'], services:['Implementation','Advisory'], logoUrl:'https://www.google.com/s2/favicons?domain=propelsoftware.com&sz=128', website:'https://www.propelsoftware.com/', fullDescription:'Propel unifies product lifecycle and quality processes on Salesforce to speed launches and ensure compliance.' }),
      mk(6,{ name:'Carbon Manufacturing Systems', tagline:'Manufacturing execution and automation', industries:['Manufacturing'], solutions:['MES','Automation'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=carbonmfg.com&sz=128', website:'https://carbonmfg.com/', fullDescription:'Carbon Manufacturing Systems provides MES and automation to orchestrate production and improve throughput.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`startup-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Tobin Scientific', tagline:'Advanced laboratory and scientific solutions', industries:['Life Sciences','Research'], solutions:['Lab Equipment','Scientific Services'], services:['Consulting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tobinscientific.com&sz=128', website:'http://www.tobinscientific.com', fullDescription:'Tobin Scientific provides cutting-edge laboratory equipment and scientific solutions for research institutions and life sciences companies. Specializes in precision instruments, analytical tools, and custom scientific services. Helps organizations accelerate research and development with reliable equipment and expert technical support. Committed to advancing scientific discovery through innovative technology and exceptional service quality.' }),
      mk(2,{ name:'Tow4Tech', tagline:'Technology-driven towing and roadside solutions', industries:['Automotive','Logistics'], solutions:['Fleet Management','Dispatch'], services:['Operations','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tow4tech.com&sz=128', website:'http://www.tow4tech.com', fullDescription:'Tow4Tech modernizes towing and roadside assistance operations with smart dispatch, fleet tracking, and customer management technology. Platform connects service providers with customers efficiently while optimizing route planning and resource allocation. Improves response times and service quality through real-time coordination and data-driven insights. Helps towing companies scale operations and enhance customer satisfaction.' }),
      mk(3,{ name:'Port Jersey Logistics', tagline:'Strategic warehousing and distribution services', industries:['Logistics','E-commerce','Retail'], solutions:['Warehousing','Distribution','Fulfillment'], services:['3PL','Cross-Docking'], logoUrl:'https://www.google.com/s2/favicons?domain=portjersey.com&sz=128', website:'http://www.portjersey.com', fullDescription:'Port Jersey Logistics delivers comprehensive warehousing, distribution, and fulfillment services for retailers and e-commerce brands. Strategic location near major ports enables efficient import/export operations and last-mile delivery. Advanced WMS technology provides real-time inventory visibility and order accuracy. Flexible solutions scale with business growth while reducing logistics costs and improving delivery performance.' }),
      mk(4,{ name:'GoAugment', tagline:'AR-powered remote assistance and training', industries:['Manufacturing','Field Service'], solutions:['Remote Assistance','AR Training','Knowledge Transfer'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=goaugment.com&sz=128', website:'http://www.goaugment.com', fullDescription:'GoAugment provides augmented reality solutions for remote expert assistance and hands-free training in industrial environments. Platform enables technicians to receive real-time guidance from experts anywhere in the world through AR glasses or mobile devices. Reduces downtime, travel costs, and knowledge gaps while improving first-time fix rates. Accelerates workforce onboarding and captures institutional knowledge for continuous improvement.' }),
      mk(5,{ name:'Carpool Logistics', tagline:'Collaborative transportation and freight pooling', industries:['Logistics','Transportation'], solutions:['Freight Consolidation','Route Optimization'], services:['Brokerage','Operations'], logoUrl:'https://www.google.com/s2/favicons?domain=carpoollogistics.com&sz=128', website:'http://www.carpoollogistics.com', fullDescription:'Carpool Logistics optimizes freight transportation through collaborative shipping and load consolidation strategies. Platform matches complementary shipments to maximize truck utilization and reduce empty miles. Helps shippers lower transportation costs while improving sustainability through shared capacity. Network approach creates win-win scenarios for carriers and shippers across regional and national lanes.' }),
      mk(6,{ name:'Tusk Logistics', tagline:'Heavy haul and specialized transportation', industries:['Construction','Energy','Manufacturing'], solutions:['Heavy Haul','Project Cargo','Specialized Transport'], services:['Planning','Execution'], logoUrl:'https://www.google.com/s2/favicons?domain=tusklogistics.com&sz=128', website:'http://www.tusklogistics.com', fullDescription:'Tusk Logistics specializes in heavy haul and oversized cargo transportation for construction, energy, and industrial projects. Expert team handles complex logistics including permitting, route surveys, and specialized equipment coordination. Moves machinery, equipment, and materials safely and efficiently across challenging routes. Proven track record in project cargo management with focus on safety and on-time delivery.' }),
      mk(7,{ name:'Coast to Coast Logistics', tagline:'Nationwide freight and supply chain solutions', industries:['Logistics','Retail','Manufacturing'], solutions:['FTL','LTL','Intermodal'], services:['Brokerage','Managed Transport'], logoUrl:'https://www.google.com/s2/favicons?domain=coasttocoastlogistics.com&sz=128', website:'http://www.coasttocoastlogistics.com', fullDescription:'Coast to Coast Logistics provides comprehensive freight brokerage and transportation management across all modes. Extensive carrier network ensures capacity and competitive rates for full truckload, LTL, and intermodal shipments. Technology platform delivers real-time tracking, analytics, and exception management. Dedicated account teams optimize supply chain performance while reducing costs and improving service levels.' }),
      mk(8,{ name:'Bourque Logistics', tagline:'Specialized freight and warehousing solutions', industries:['Logistics','Distribution'], solutions:['Freight Management','Warehousing','Cross-Dock'], services:['3PL','Operations'], logoUrl:'https://www.google.com/s2/favicons?domain=bourquelogistics.com&sz=128', website:'http://www.bourquelogistics.com', fullDescription:'Bourque Logistics offers integrated freight management and warehousing services tailored to customer needs. Combines transportation expertise with strategic warehouse locations for efficient distribution. Technology-enabled operations provide visibility and control across the supply chain. Family-owned company delivers personalized service with enterprise-level capabilities and reliability.' }),
      mk(9,{ name:'Sotira', tagline:'AI-powered supply chain optimization', industries:['Manufacturing','Retail','Logistics'], solutions:['Demand Forecasting','Inventory Optimization','Planning'], services:['Implementation','Analytics'], logoUrl:'https://www.google.com/s2/favicons?domain=sotira.co&sz=128', website:'http://www.sotira.co', fullDescription:'Sotira leverages artificial intelligence to optimize supply chain planning and inventory management decisions. Machine learning models analyze demand patterns, lead times, and constraints to recommend optimal stocking levels and replenishment strategies. Reduces stockouts and excess inventory while improving service levels and working capital efficiency. Cloud-based platform integrates with existing ERP and supply chain systems for seamless deployment.' }),
      mk(10,{ name:'GenLogs', tagline:'Next-generation logistics management platform', industries:['Logistics','Transportation'], solutions:['TMS','Visibility','Analytics'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=genlogs.io&sz=128', website:'http://www.genlogs.io', fullDescription:'GenLogs delivers modern transportation management software designed for digital-native logistics operations. Cloud platform streamlines load planning, carrier selection, execution, and settlement with automated workflows. Real-time visibility and predictive analytics improve decision-making and customer service. API-first architecture enables easy integration with warehouse, e-commerce, and enterprise systems.' }),
      mk(11,{ name:'Over-Haul', tagline:'Real-time supply chain security and visibility', industries:['Logistics','Pharma','High-Value Cargo'], solutions:['Cargo Tracking','Security','Risk Management'], services:['Monitoring','Response'], logoUrl:'https://www.google.com/s2/favicons?domain=over-haul.com&sz=128', website:'http://www.over-haul.com', fullDescription:'Over-Haul provides real-time tracking and security solutions for high-value and sensitive cargo shipments. Platform combines IoT sensors, geofencing, and 24/7 monitoring to detect and respond to theft, delays, and route deviations. Protects pharmaceutical, electronics, and other valuable goods throughout the supply chain. Reduces cargo theft losses while ensuring compliance and chain of custody requirements.' }),
      mk(12,{ name:'Miles Ahead Brands', tagline:'Brand-building and supply chain for consumer goods', industries:['CPG','E-commerce','Retail'], solutions:['Brand Development','Supply Chain','Distribution'], services:['Operations','Marketing'], logoUrl:'https://www.google.com/s2/favicons?domain=milesaheadbrands.com&sz=128', website:'http://www.milesaheadbrands.com', fullDescription:'Miles Ahead Brands combines brand development expertise with end-to-end supply chain management for consumer products. Helps emerging brands scale from concept to retail distribution with manufacturing, logistics, and go-to-market support. Strategic partnerships and operational excellence accelerate growth while maintaining quality and margins. Full-service approach enables founders to focus on innovation and brand building.' }),
      mk(13,{ name:'Slip Robotics', tagline:'Autonomous loading dock robots', industries:['Logistics','Warehousing','Manufacturing'], solutions:['Autonomous Loading','Dock Automation'], services:['Deployment','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=sliprobotics.com&sz=128', website:'http://www.sliprobotics.com', fullDescription:'Slip Robotics develops autonomous robots that automate trailer loading and unloading at warehouse docks. SlipBot system moves pallets and cargo between trailers and facilities without human intervention, improving safety and throughput. Reduces dock labor requirements and trailer dwell time while increasing operational efficiency. Modular design works with existing infrastructure and scales across multiple dock doors.' }),
      mk(14,{ name:'RJW Group', tagline:'Logistics consulting and supply chain solutions', industries:['Logistics','Manufacturing','Retail'], solutions:['Consulting','Network Design','Optimization'], services:['Strategy','Implementation'], logoUrl:'https://www.google.com/s2/favicons?domain=rjwgroup.com&sz=128', website:'http://www.rjwgroup.com', fullDescription:'RJW Group provides strategic logistics consulting and supply chain optimization services for complex operations. Expert team analyzes networks, processes, and costs to identify improvement opportunities and design solutions. Specializes in warehouse operations, transportation management, and distribution strategy. Data-driven approach delivers measurable results in cost reduction, service improvement, and operational excellence.' }),
      mk(15,{ name:'The Provenance Chain', tagline:'Blockchain-based supply chain transparency', industries:['Luxury','Food & Bev','Pharma'], solutions:['Traceability','Authentication','Transparency'], services:['Implementation','Verification'], logoUrl:'https://www.google.com/s2/favicons?domain=theprovenancechain.com&sz=128', website:'http://www.theprovenancechain.com', fullDescription:'The Provenance Chain uses blockchain technology to create immutable records of product origin, journey, and authenticity throughout supply chains. Platform enables brands to prove sustainability claims, combat counterfeiting, and build consumer trust through verified transparency. Digital product passports capture data from source to consumer with tamper-proof verification. Helps luxury, food, and pharmaceutical brands differentiate through provenance and ethical sourcing.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🏭</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent mb-4">Supplychain & Manufacturing Tech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Smart factories, resilient supply chains, and sustainable operations</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore automation systems, planning platforms, sustainability solutions, and industrial cloud/workforce tech.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#factory" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-lime-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 1. Smart Factory & Automation Systems */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Smart Factory & Automation Systems</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="factory" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {factory.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Supply Chain Intelligence & Planning Platforms */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Supply Chain Intelligence & Planning Platforms</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="planning" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {planning.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2b. Visibility */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Visibility</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="visibility" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibility.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sustainable Operations & Resource Management */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Sustainable Operations & Resource Management</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="sustainability" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sustainability.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Industrial Cloud, Software & Workforce Tech */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Industrial Cloud, Software & Workforce Tech</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="industrial" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {industrialCloud.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
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
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
