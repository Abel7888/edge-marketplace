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

export default function AutomationRobotics(){
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
    if (!currentUser){ router.push('/login?redirect=/discover/automation-robotics'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Automation & Robotics' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/automation-robotics'); return }
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
        key:'industrial',
        title:'Industrial Robots',
        vendors:[
          mk('auto-ind-wolf',{ name:'Wolf Robotics', website:'https://www.wolfrobotics.com/', logoUrl:fav('https://www.wolfrobotics.com/'), tagline:'Welding and fabrication cells for heavy industry', fullDescription:'Wolf Robotics designs and integrates industrial robotic cells for welding and fabrication. Solutions address repeatability, quality, and operator safety at scale. Services span design, commissioning, and lifecycle support for demanding environments.' }),
          mk('auto-ind-berkshire',{ name:'Berkshire Grey', website:'https://www.berkshiregrey.com/', logoUrl:fav('https://www.berkshiregrey.com/'), tagline:'Robotic automation for eCommerce and logistics', fullDescription:'Berkshire Grey builds robotic picking, sortation, and fulfillment systems. AI-driven perception and motion improve throughput and accuracy. Retail and logistics operators reduce labor bottlenecks with scalable automation.' }),
          mk('auto-ind-omron',{ name:'Omron Adept Technologies', website:'https://www.omron.com/global/en/', logoUrl:fav('https://www.omron.com/'), tagline:'Industrial automation portfolio with robotics', fullDescription:'Omron’s automation portfolio includes robots, safety, and control systems. Integrated solutions coordinate motion, vision, and PLCs for efficient lines. Enterprises improve quality and uptime with proven components and software.' }),
          mk('auto-ind-yaskawa',{ name:'Yaskawa Motoman', website:'https://www.motoman.com/', logoUrl:fav('https://www.motoman.com/'), tagline:'Robots and motion solutions for production', fullDescription:'Yaskawa Motoman delivers a broad lineup of industrial robots and motion products. Applications span welding, handling, and assembly. Global support helps manufacturers deploy and maintain high-availability cells.' }),
          mk('auto-ind-fanuc',{ name:'Fanuc America Corp.', website:'https://www.fanucamerica.com/', logoUrl:fav('https://www.fanucamerica.com/'), tagline:'High-reliability robots and controllers', fullDescription:'Fanuc provides industrial robots, CNCs, and controllers known for reliability. Solutions serve automotive, electronics, and general industry. Extensive ecosystem and support shorten deployment and reduce downtime.' }),
        ]
      },
      {
        key:'cobots',
        title:'Collaborative Robots (Cobots)',
        vendors:[
          mk('auto-cb-productive',{ name:'Productive Robotics', website:'https://www.productiverobotics.com/', logoUrl:fav('https://www.productiverobotics.com/'), tagline:'User-friendly cobots for small and mid-size manufacturers', fullDescription:'Productive Robotics offers cobots designed for fast setup and operation. Intuitive interfaces and accessories accelerate common tasks. Teams automate without extensive programming or systems engineering.' }),
          mk('auto-cb-ready',{ name:'READY Robotics', website:'https://ready-robotics.com/', logoUrl:fav('https://ready-robotics.com/'), tagline:'No-code/low-code robotics with ForgeOS', fullDescription:'READY Robotics provides ForgeOS to unify robot programming across brands. Drag-and-drop flows reduce integration time. Manufacturers standardize automation while empowering a broader workforce.' }),
          mk('auto-cb-robocell',{ name:'RoboCell Systems', website:'https://robocellsystems.com/', logoUrl:fav('https://robocellsystems.com/'), tagline:'Turnkey robotic cells and integration', fullDescription:'RoboCell Systems designs and integrates turnkey robotic cells for production. Services cover design, build, and onsite deployment. Customers speed automation projects with a single accountable partner.' }),
          mk('auto-cb-doosan',{ name:'Doosan Robotics America', website:'https://www.doosanrobotics.com/en/us', logoUrl:fav('https://www.doosanrobotics.com/'), tagline:'High-performance cobots with force sensitivity', fullDescription:'Doosan’s cobot range combines payload, reach, and force sensitivity. Applications include machine tending, assembly, and quality. Tooling and software streamline setup and operation.' }),
          mk('auto-cb-rapid',{ name:'Rapid Robotics', website:'https://www.rapidrobotics.com/', logoUrl:fav('https://www.rapidrobotics.com/'), tagline:'Robotics-as-a-service for fast ROI', fullDescription:'Rapid Robotics delivers pre-configured, subscription-based automation. Customers reduce upfront costs and accelerate payback. Remote monitoring and support help maintain consistent performance.' }),
        ]
      },
      {
        key:'drones',
        title:'Drones & UAVs',
        vendors:[
          mk('auto-dr-skydio',{ name:'Skydio', website:'https://www.skydio.com/', logoUrl:fav('https://www.skydio.com/'), tagline:'Autonomy-first drones for inspection and security', fullDescription:'Skydio builds autonomous drones used for inspection, public safety, and defense. Onboard AI assists operators and improves outcomes. Data pipelines and integrations drive end-to-end workflows.' }),
          mk('auto-dr-av',{ name:'AeroVironment', website:'https://www.avinc.com/', logoUrl:fav('https://www.avinc.com/'), tagline:'Small UAS and loitering systems', fullDescription:'AeroVironment provides small UAS platforms with a track record in defense and commercial missions. Systems emphasize reliability, endurance, and portability. End-user training and support are core to deployments.' }),
          mk('auto-dr-brinc',{ name:'Brinc Drones', website:'https://www.brincdrones.com/', logoUrl:fav('https://www.brincdrones.com/'), tagline:'Resilient drones for first responders', fullDescription:'Brinc builds rugged drones tailored to first responders and critical incidents. Features aim at indoor flight, comms, and situational awareness. Agencies adopt for safer, faster operations.' }),
          mk('auto-dr-teal',{ name:'Teal Drones', website:'https://tealdrones.com/', logoUrl:fav('https://tealdrones.com/'), tagline:'Modular small UAS built in the USA', fullDescription:'Teal develops modular small UAS with domestic manufacturing. Payload flexibility and secure comms support diverse missions. Tooling and APIs integrate into enterprise and government workflows.' }),
          mk('auto-dr-american',{ name:'American Robotics', website:'https://www.american-robotics.com/', logoUrl:fav('https://www.american-robotics.com/'), tagline:'Automated drone-in-a-box for industrial monitoring', fullDescription:'American Robotics provides autonomous, dock-based drone systems. Sites gain regular, repeatable data without pilots on site. Used in energy, rail, and agriculture to reduce inspection costs.' }),
        ]
      },
      {
        key:'amr',
        title:'AGVs / AMRs (Autonomous Mobile Robots)',
        vendors:[
          mk('auto-amr-symbotic',{ name:'Symbotic', website:'https://www.symbotic.com/', logoUrl:fav('https://www.symbotic.com/'), tagline:'High-density warehouse automation systems', fullDescription:'Symbotic deploys high-density storage and retrieval with mobile robots and shuttles. Software orchestrates inventory flows to increase throughput. Large retailers and grocers modernize DC operations at scale.' }),
          mk('auto-amr-vecna',{ name:'Vecna Robotics', website:'https://www.vecnarobotics.com/', logoUrl:fav('https://www.vecnarobotics.com/'), tagline:'Autonomous tuggers and pallet movers', fullDescription:'Vecna provides AMRs for tugging and pallet movement with dynamic obstacle handling. Fleets coordinate with WMS and human workflows. Facilities improve safety, predictability, and labor allocation.' }),
          mk('auto-amr-locus',{ name:'Locus Robotics', website:'https://locusrobotics.com/', logoUrl:fav('https://locusrobotics.com/'), tagline:'Collaborative picking robots for fulfillment', fullDescription:'Locus delivers collaborative robots that assist pickers in fulfillment centers. Guided workflows boost productivity with minimal reconfiguration. Analytics help optimize labor and routing.' }),
          mk('auto-amr-seegrid',{ name:'Seegrid', website:'https://www.seegrid.com/', logoUrl:fav('https://www.seegrid.com/'), tagline:'Vision-guided AMRs for material flow', fullDescription:'Seegrid’s vision-guided AMRs automate material movement in manufacturing and warehousing. Solutions emphasize safety, reliability, and fast deployment. Tools manage routes, traffic, and performance.' }),
          mk('auto-amr-otto',{ name:'Otto Motors', website:'https://ottomotors.com/', logoUrl:fav('https://ottomotors.com/'), tagline:'Heavy-duty AMRs for industrial operations', fullDescription:'Otto Motors builds AMRs to move pallets and large loads safely. Fleet management optimizes traffic and missions. Customers scale from pilots to fleets with integration and support services.' }),
        ]
      },
      {
        key:'arms',
        title:'Robotic Arms & Manipulators',
        vendors:[
          mk('auto-arms-revolver',{ name:'Revolve Robotics', website:'https://www.revolverobotics.com/', logoUrl:fav('https://www.revolverobotics.com/'), tagline:'Portable telepresence and positioning robotics', fullDescription:'Revolve Robotics focuses on portable robotic positioning and telepresence solutions. Systems are simple to deploy and integrate with common tools. Teams use them for collaboration, training, and content capture.' }),
          mk('auto-arms-mecademic',{ name:'Mecademic Robotics USA', website:'https://www.mecademic.com/', logoUrl:fav('https://www.mecademic.com/'), tagline:'Ultra-compact, precise industrial robot arms', fullDescription:'Mecademic builds small, precise robot arms suited for benchtop and compact cells. Simple programming and rigid mechanics enable high repeatability. Used in electronics, labs, and precision assembly.' }),
          mk('auto-arms-dexai',{ name:'Dexai Robotics', website:'https://dexai.com/', logoUrl:fav('https://dexai.com/'), tagline:'AI-driven manipulation for food service', fullDescription:'Dexai applies AI-driven manipulation to automate kitchen tasks. Systems interact with existing tools and containers. Operators improve consistency and staffing flexibility in food prep workflows.' }),
          mk('auto-arms-automata',{ name:'Automata Labs', website:'https://automata.tech/', logoUrl:fav('https://automata.tech/'), tagline:'Robotic workcells for lab automation', fullDescription:'Automata provides robotic workcells to automate lab workflows from prep to analysis. Software coordinates instruments and tasks with traceability. Labs increase throughput while maintaining quality.' }),
          mk('auto-arms-forterra',{ name:'Robotic Research (Forterra)', website:'https://forterra.ai/', logoUrl:fav('https://forterra.ai/'), tagline:'Autonomy and robotic systems for defense & industry', fullDescription:'Forterra (formerly Robotic Research) develops autonomy and robotic systems across domains. Solutions span manipulation, mobility, and perception. Partnerships bring advanced capabilities to real operations.' }),
        ]
      },
      {
        key:'construction',
        title:'Construction Automation Systems',
        vendors:[
          mk('auto-con-acr',{ name:'Advanced Construction Robotics (ACR)', website:'https://www.advancedconstructionrobotics.com/', logoUrl:fav('https://www.advancedconstructionrobotics.com/'), tagline:'Task-focused robots for construction sites', fullDescription:'ACR builds task-focused robots that automate repetitive, strenuous site work. Systems improve safety and schedule certainty. Contractors adopt for rebar tying and similar workflows with measurable ROI.' }),
          mk('auto-con-built',{ name:'Built Robotics', website:'https://www.builtrobotics.com/', logoUrl:fav('https://www.builtrobotics.com/'), tagline:'Autonomous heavy equipment for excavation', fullDescription:'Built Robotics retrofits heavy equipment for autonomous operation in excavation and earthmoving. Sensors and software handle trenching and more. Contractors scale productivity while addressing labor gaps.' }),
          mk('auto-con-dusty',{ name:'Dusty Robotics', website:'https://www.dustyrobotics.com/', logoUrl:fav('https://www.dustyrobotics.com/'), tagline:'Field printers for accurate layout at scale', fullDescription:'Dusty Robotics provides robotic field printers that transfer BIM plans to floors. Layout becomes faster and more accurate with fewer errors. Trades coordinate better and reduce rework on complex projects.' }),
          mk('auto-con-canvas',{ name:'Canvas Construction', website:'https://www.canvas.build/', logoUrl:fav('https://www.canvas.build/'), tagline:'Robotic drywall finishing systems', fullDescription:'Canvas automates drywall finishing with robotic systems and process controls. Crews improve consistency, speed, and safety. Builders gain schedule predictability and quality outcomes.' }),
          mk('auto-con-toggle',{ name:'Toggle Robotics', website:'https://www.toggle.is/', logoUrl:fav('https://www.toggle.is/'), tagline:'Robotic rebar fabrication and assembly', fullDescription:'Toggle automates rebar fabrication and assembly with robotics and software. Offsite and onsite solutions reduce manual strain and waste. Projects benefit from throughput and traceability.' }),
        ]
      },
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🦾</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">Automation & Robotics</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Industrial robots, cobots, drones, AMRs, manipulators, and construction automation</div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {sections.map(sec => (
            <div key={sec.key} className="mb-12">
              <div className="relative my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-semibold tracking-wide">{sec.title}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
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

