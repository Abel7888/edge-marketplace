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
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
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

export default function Semiconductors(){
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
    if (!currentUser){ router.push('/login?redirect=/discover/semiconductors'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Semiconductors' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/semiconductors'); return }
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
        key:'hpc',
        title:'High-Performance Computing (HPC) Systems',
        vendors:[
          mk('comp-hpc-eviden',{ name:'Atos / Eviden', website:'https://eviden.com/solutions/high-performance-computing/', logoUrl:fav('https://eviden.com/'), tagline:'Exascale-class systems and supercomputing services', fullDescription:'Eviden (Atos) designs and integrates HPC systems for research and industry. Offerings span exascale-class architectures, interconnects, and energy‑efficient cooling. Customers accelerate simulation, AI, and data analytics with turnkey delivery and managed services.' }),
          mk('comp-hpc-fujitsu',{ name:'Fujitsu Limited', website:'https://www.fujitsu.com/global/solutions/business-technology/hpc/', logoUrl:fav('https://www.fujitsu.com/'), tagline:'Arm-based and hybrid platforms proven at national scale', fullDescription:'Fujitsu builds Arm-based and hybrid HPC platforms known from flagship systems like Fugaku. Solutions emphasize parallel performance and power efficiency. Enterprises and labs run complex models faster, from climate and materials to healthcare and manufacturing.' }),
          mk('comp-hpc-penguin',{ name:'Penguin Computing', website:'https://www.penguinsolutions.com/', logoUrl:fav('https://www.penguinsolutions.com/'), tagline:'Cluster design, integration, and managed HPC', fullDescription:'Penguin delivers end-to-end HPC clusters, storage, and management. Teams get architecture design, integration, and ongoing operations support. The approach speeds time‑to‑science for AI training, CAE, and data pipelines with predictable lifecycle services.' }),
          mk('comp-hpc-supermicro',{ name:'Supermicro', website:'https://www.supermicro.com/en/applications/high-performance-computing', logoUrl:fav('https://www.supermicro.com/'), tagline:'Building blocks for GPU/CPU accelerated clusters', fullDescription:'Supermicro provides flexible building blocks for CPU/GPU accelerated HPC and AI. Broad server portfolio supports liquid cooling, dense storage, and fast interconnects. Customers tailor clusters to workload and budget without vendor lock‑in.' }),
          mk('comp-hpc-inspur',{ name:'Inspur Information', website:'https://www.inspur.com/en/us/solutions/HPC/', logoUrl:fav('https://www.inspur.com/'), tagline:'High-density designs for simulation and AI', fullDescription:'Inspur offers high-density servers and accelerators for HPC and AI workloads. Reference architectures and integration services reduce deployment risk. Operators balance cost, performance, and power at scale for enterprise and research use cases.' }),
        ]
      },
      {
        key:'ai',
        title:'AI Accelerators & Chips',
        vendors:[
          mk('comp-ai-sambanova',{ name:'SambaNova Systems', website:'https://sambanova.ai/', logoUrl:fav('https://sambanova.ai/'), tagline:'Reconfigurable dataflow systems for AI', fullDescription:'SambaNova delivers reconfigurable dataflow systems for training and inference. The platform targets efficiency and throughput on state‑of‑the‑art models. Enterprises adopt for faster time‑to‑value and simplified operations versus piecing together components.' }),
          mk('comp-ai-tenstorrent',{ name:'Tenstorrent', website:'https://www.tenstorrent.com/', logoUrl:fav('https://www.tenstorrent.com/'), tagline:'Scalable AI accelerators and RISC‑V IP', fullDescription:'Tenstorrent builds AI accelerators and RISC‑V IP designed for scalability. Toolchains help map modern workloads across chips and clusters. Customers target datacenter and edge inference with strong performance‑per‑watt.' }),
          mk('comp-ai-cerebras',{ name:'Cerebras Systems', website:'https://www.cerebras.net/', logoUrl:fav('https://www.cerebras.net/'), tagline:'Wafer-scale AI compute for large models', fullDescription:'Cerebras pioneers wafer‑scale compute that eliminates packaging bottlenecks. The architecture runs massive models with simpler parallelism. Customers see training speedups and reduced cluster complexity for frontier workloads.' }),
          mk('comp-ai-mythic',{ name:'Mythic AI', website:'https://www.mythic-ai.com/', logoUrl:fav('https://www.mythic-ai.com/'), tagline:'Analog compute‑in‑memory for edge vision', fullDescription:'Mythic develops analog compute‑in‑memory chips targeting edge vision. By fusing compute and storage, devices hit low power and latency targets. Ideal for cameras, wearables, and smart devices needing local intelligence.' }),
          mk('comp-ai-hailo',{ name:'Hailo Technologies', website:'https://hailo.ai/', logoUrl:fav('https://hailo.ai/'), tagline:'Edge AI accelerators for real‑time perception', fullDescription:'Hailo offers compact accelerators optimized for computer vision at the edge. Kits and software simplify deployment into cameras, robotics, and automation. Teams achieve high FPS and low power even on constrained footprints.' }),
        ]
      },
      {
        key:'inmem',
        title:'In-Memory Computing & Analog Logic Startups',
        vendors:[
          mk('comp-inmem-gyrfalcon',{ name:'Gyrfalcon Technology', website:'https://www.gyrfalcontech.ai/', logoUrl:fav('https://www.gyrfalcontech.ai/'), tagline:'Ultra-low-power AI accelerators for devices', fullDescription:'Gyrfalcon Technology offers compact neural network accelerators optimized for very low power and cost. Their chips and modules slot into consumer, mobile, and industrial devices without heavy cooling. Developers can run modern CNNs locally, cutting latency and bandwidth usage. A fit for edge OEMs who need efficient inference in tight form factors.' }),
          mk('comp-inmem-memryx',{ name:'MemryX', website:'https://memryx.com/', logoUrl:fav('https://memryx.com/'), tagline:'Memory-centric AI accelerators for edge systems', fullDescription:'MemryX designs memory‑centric AI accelerators built around a dataflow architecture. The hardware aims for predictable latency and easy scaling from modules to systems. Tooling and reference boards help teams integrate into PCs, edge servers, and embedded platforms. Suited for industrial, retail, and smart city deployments looking to standardize on a flexible AI engine.' }),
          mk('comp-inmem-rain',{ name:'Rain Neuromorphics', website:'https://rain.ai/', logoUrl:fav('https://rain.ai/'), tagline:'Neuromorphic in-memory compute for next-gen AI', fullDescription:'Rain Neuromorphics works on neuromorphic, in‑memory compute architectures inspired by the brain. Their approach focuses on dramatically improving energy efficiency for AI workloads. Early systems target training and inference in compact, power‑constrained environments. Teams exploring frontier AI silicon and novel architectures keep a close eye on Rain’s roadmap.' }),
          mk('comp-inmem-synsense',{ name:'SynSense', website:'https://www.synsense.ai/', logoUrl:fav('https://www.synsense.ai/'), tagline:'Event-driven neuromorphic chips for sensing', fullDescription:'SynSense builds event‑driven neuromorphic processors that pair naturally with event cameras and low‑power sensors. The chips process sparse, spiking data streams instead of dense video frames. This enables always‑on perception with tiny power budgets for wearables, IoT, and robotics. A strong option where battery life and latency are both critical.' }),
          mk('comp-inmem-untether',{ name:'Untether AI', website:'https://www.untether.ai/', logoUrl:fav('https://www.untether.ai/'), tagline:'At-memory compute for high-throughput inference', fullDescription:'Untether AI provides at‑memory compute architectures that move processing close to data. Their chips aim to deliver high throughput and energy efficiency for inference in datacenters and edge racks. Systems integrators can build dense AI appliances without extreme cooling. Useful for customers consolidating many small inference workloads onto a compact footprint.' }),
          mk('comp-inmem-syntiant',{ name:'Syntiant', website:'https://www.syntiant.com/', logoUrl:fav('https://www.syntiant.com/'), tagline:'Always-on tinyML for voice and sensor AI', fullDescription:'Syntiant offers ultra‑low‑power neural decision processors for always‑on audio, voice, and sensor tasks. Devices run wake words, sound events, and simple classifiers on microwatts of power. Reference designs support earbuds, wearables, and battery‑powered IoT endpoints. A go‑to for teams adding intelligent listening or sensing without draining batteries.' }),
          mk('comp-inmem-analoginf',{ name:'Analog Inference', website:'https://www.analoginference.com/', logoUrl:fav('https://www.analoginference.com/'), tagline:'Analog AI inference for efficient datacenter and edge', fullDescription:'Analog Inference is developing analog AI inference platforms aimed at high efficiency and density. By leveraging analog compute techniques, they seek to reduce energy per inference versus traditional digital accelerators. Target use cases include datacenter inference, content understanding, and edge services. Early adopters explore the technology for both cost and sustainability gains.' }),
        ]
      },
      {
        key:'quantum',
        title:'Quantum Computing Hardware',
        vendors:[
          mk('comp-q-psiquantum',{ name:'PsiQuantum', website:'https://www.psiquantum.com/', logoUrl:fav('https://www.psiquantum.com/'), tagline:'Photonic quantum architectures pursuing error correction', fullDescription:'PsiQuantum develops photonic quantum systems designed for large‑scale, error‑corrected computing. The roadmap focuses on manufacturability and fault tolerance. Partnerships aim to accelerate delivery of practical quantum advantage.' }),
          mk('comp-q-oqc',{ name:'Oxford Quantum Circuits (OQC)', website:'https://oxfordquantumcircuits.com/', logoUrl:fav('https://oxfordquantumcircuits.com/'), tagline:'Superconducting qubits via Coaxmon technology', fullDescription:'OQC builds superconducting quantum processors using Coaxmon technology. Cloud access simplifies experimentation and integration. Customers explore algorithms for optimization, chemistry, and finance on evolving hardware.' }),
          mk('comp-q-quera',{ name:'QuEra Computing', website:'https://www.quera.com/', logoUrl:fav('https://www.quera.com/'), tagline:'Neutral‑atom platforms for scalable quantum', fullDescription:'QuEra advances neutral‑atom quantum computers emphasizing scalability and coherence. Programmable arrays enable novel algorithm research. Teams experiment with analog and digital modes for science and industry problems.' }),
          mk('comp-q-pasqal',{ name:'Pasqal', website:'https://www.pasqal.com/', logoUrl:fav('https://www.pasqal.com/'), tagline:'Neutral‑atom quantum systems and applications', fullDescription:'Pasqal develops neutral‑atom quantum hardware with a growing applications ecosystem. Collaborations target materials, mobility, and energy. Tooling and services guide teams from proofs‑of‑concept to production pilots.' }),
          mk('comp-q-qunasys',{ name:'QunaSys & Fujitsu Quantum Unit', website:'https://qunasys.com/', logoUrl:fav('https://qunasys.com/'), tagline:'Algorithms and hardware collaboration for applied quantum', fullDescription:'QunaSys and Fujitsu collaborate to advance practical quantum computing. QunaSys brings algorithm and software expertise; Fujitsu provides hardware innovation. Together they explore real‑world workloads and integration paths.' }),
        ]
      },
      {
        key:'embedded',
        title:'Embedded Systems & Boards',
        vendors:[
          mk('comp-emb-toradex',{ name:'Toradex AG', website:'https://www.toradex.com/', logoUrl:fav('https://www.toradex.com/'), tagline:'System-on-modules and developer tooling', fullDescription:'Toradex delivers system‑on‑modules and software to speed embedded product development. Robust boards and long‑term support fit industrial and medical devices. Developers benefit from reference designs and reliable ecosystems.' }),
          mk('comp-emb-advantech',{ name:'Advantech Co., Ltd.', website:'https://www.advantech.com/', logoUrl:fav('https://www.advantech.com/'), tagline:'Industrial PCs, gateways, and edge platforms', fullDescription:'Advantech offers industrial PCs, gateways, and edge platforms for harsh environments. Broad catalog covers form factors, connectivity, and ruggedization. Used across factories, transport, and energy for dependable operations.' }),
          mk('comp-emb-compulab',{ name:'CompuLab Ltd.', website:'https://www.compulab.com/', logoUrl:fav('https://www.compulab.com/'), tagline:'Fanless mini‑PCs and embedded modules', fullDescription:'CompuLab designs fanless mini‑PCs and embedded modules with efficient thermals. Options balance performance, size, and I/O flexibility. Common in kiosks, signage, and industrial automation with long lifecycle options.' }),
          mk('comp-emb-arbor',{ name:'Arbor Technology Corp.', website:'https://www.arbor-technology.com/', logoUrl:fav('https://www.arbor-technology.com/'), tagline:'Rugged embedded boards and panel PCs', fullDescription:'Arbor provides rugged boards, panel PCs, and edge devices tailored for industrial use. Solutions emphasize reliability, I/O breadth, and serviceability. Suited for factory HMI, transportation, and healthcare settings.' }),
          mk('comp-emb-digi',{ name:'Digi International', website:'https://www.digi.com/', logoUrl:fav('https://www.digi.com/'), tagline:'Embedded connectivity and device networking', fullDescription:'Digi delivers embedded modules, routers, and device networking for connected products. Developers integrate secure connectivity and management at scale. Used in utilities, retail, logistics, and smart cities.' }),
        ]
      }
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">💾</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">Computing & Processing</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Vendors that design, manufacture, or integrate the core processing and compute infrastructure.</div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 20 Vendors</a>
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

