import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-teal-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">{x}</span>)}
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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-400">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuantumComputing(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/quantum'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Quantum Computing' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/quantum'); return }
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
    const mk = (i, data) => ({ id:`qc-${String(i).padStart(3,'0')}`, rating:4.7, reviewCount:60+i, successRate:92+(i%5), responseTime:i%3===0?'<2 hours':'<6 hours', ...data })
    return [
      mk(1,{ name:'AWS Braket', tagline:'Fully managed quantum service on AWS', industries:['Research','Enterprise','Cloud'], solutions:['Quantum Access','Hybrid Workflows','Simulators'], services:['Managed Service','SDKs (PennyLane/Amazon Braket SDK)','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128', website:'https://aws.amazon.com/braket/', fullDescription:'Amazon Braket provides managed access to multiple quantum hardware providers and high‑performance simulators. Support for hybrid quantum‑classical workflows, notebooks, and integrations with AWS services accelerates R&D.' }),
      mk(2,{ name:'D-Wave Systems', tagline:'Quantum annealing systems and hybrid solvers', industries:['Optimization','Manufacturing','Logistics'], solutions:['Quantum Annealers','Hybrid Solvers','Ocean SDK'], services:['Hardware Access','Professional Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=dwavesys.com&sz=128', website:'https://www.dwavesys.com/', fullDescription:'D‑Wave specializes in quantum annealing for combinatorial optimization. Access systems via cloud and use hybrid solvers with the Ocean SDK to tackle scheduling, routing, and portfolio problems.' }),
      mk(3,{ name:'Google Quantum AI', tagline:'Superconducting qubits, error correction, and research', industries:['Research','Cloud','Materials'], solutions:['Superconducting Qubits','QEC','Open‑Source Tools'], services:['Research Access','Papers & Tools','Ecosystem'], logoUrl:'https://www.google.com/s2/favicons?domain=quantumai.google&sz=128', website:'https://quantumai.google/', fullDescription:'Google’s Quantum AI program advances superconducting qubits, error correction, and quantum supremacy experiments. Provides open tools and research artifacts for the broader community.' }),
      mk(4,{ name:'IBM Quantum', tagline:'Quantum systems and Qiskit with IBM Cloud access', industries:['Research','Finance','Chemistry'], solutions:['IBM Quantum Systems','Qiskit','Runtime'], services:['Cloud Access','Consulting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ibm.com&sz=128', website:'https://www.ibm.com/quantum', fullDescription:'IBM Quantum offers cloud access to a large fleet of superconducting devices and advanced runtimes. Qiskit open‑source SDK and services support education, prototyping, and early‑stage applications.' }),
      mk(5,{ name:'Intel Labs (Quantum)', tagline:'Spin qubits and cryo‑CMOS control research', industries:['Research','Semiconductors'], solutions:['Spin Qubits','Cryo‑CMOS','Packaging'], services:['Research Collaboration','Foundry Integration','Publications'], logoUrl:'https://www.google.com/s2/favicons?domain=intel.com&sz=128', website:'https://www.intel.com/content/www/us/en/research/quantum-computing.html', fullDescription:'Intel explores silicon spin qubits and cryogenic control electronics leveraging semiconductor manufacturing expertise. Research targets scalable, manufacturable quantum computing architectures.' }),
      mk(6,{ name:'IonQ', tagline:'Trapped‑ion quantum systems available in major clouds', industries:['Enterprise','Research','Cloud'], solutions:['Trapped‑Ion Systems','AQ Performance Metrics','SDKs'], services:['Cloud Access','Professional Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ionq.com&sz=128', website:'https://ionq.com/', fullDescription:'IonQ builds trapped‑ion quantum computers with high‑fidelity gates, accessible via AWS, Azure, and Google Cloud. Offers performance metrics (AQ) and tools for algorithm development.' }),
      mk(7,{ name:'Azure Quantum', tagline:'Microsoft’s unified quantum platform and ecosystem', industries:['Enterprise','Research','Cloud'], solutions:['Azure Quantum Elements','Quantum HPC','Resource Estimation'], services:['Cloud Platform','SDKs (Q#)','Ecosystem'], logoUrl:'https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=128', website:'https://azure.microsoft.com/en-us/solutions/quantum/', fullDescription:'Azure Quantum unifies access to quantum hardware, HPC, and chemistry tools. Provides resource estimation, Q# and Python SDKs, and an ecosystem of providers through the Azure cloud.' }),
      mk(8,{ name:'Quantum Computing Inc. (QCI)', tagline:'Quantum optimization and sensing solutions', industries:['Defense','Industrial','Research'], solutions:['Optimization','Sensing','Photonic Platforms'], services:['Professional Services','Support','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=quantumcomputinginc.com&sz=128', website:'https://quantumcomputinginc.com/', fullDescription:'QCI develops quantum optimization software and emerging sensing technologies, focusing on real‑world problem solving and photonic approaches for performance and resilience.' }),
      mk(9,{ name:'Quantinuum', tagline:'Trapped‑ion quantum systems and software stack', industries:['Chemistry','Finance','Research'], solutions:['H‑Series Systems','InQuanto','TKET'], services:['Cloud Access','Consulting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=quantinuum.com&sz=128', website:'https://www.quantinuum.com/', fullDescription:'Quantinuum combines Honeywell Quantum Solutions and Cambridge Quantum. Offers H‑Series trapped‑ion hardware, InQuanto for chemistry, and TKET compiler for algorithm efficiency.' }),
      mk(10,{ name:'Rigetti', tagline:'Full‑stack superconducting quantum company', industries:['Research','Finance','Government'], solutions:['QPU Access','Quantum Cloud Services','Developer Tools'], services:['Cloud Access','Partnerships','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=rigetti.com&sz=128', website:'https://www.rigetti.com/', fullDescription:'Rigetti builds superconducting quantum processors and provides Quantum Cloud Services (QCS). Focus on tight integration between hardware, software, and developer tooling.' }),
      mk(11,{ name:'Xanadu', tagline:'Photonic quantum computing and PennyLane', industries:['Research','Chemistry','ML'], solutions:['Photonic Hardware','PennyLane','Cloud Access'], services:['SDKs','Education','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=xanadu.ai&sz=128', website:'https://www.xanadu.ai/', fullDescription:'Xanadu advances photonic quantum computing and develops PennyLane, a leading open‑source library for differentiable programming of quantum circuits.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`qcs-${String(i).padStart(3,'0')}`, rating:4.6, reviewCount:30+i, successRate:90+(i%5), responseTime:i%3===0?'<4 hours':'<8 hours', ...data })
    return [
      mk(1,{ name:'IonQ', tagline:'Trapped‑ion quantum systems in the cloud', industries:['Enterprise','Research'], solutions:['Trapped‑Ion Systems','Hybrid Workflows'], services:['Cloud Access','Professional Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=ionq.com&sz=128', website:'https://ionq.com/', fullDescription:'IonQ provides trapped‑ion quantum computers with high‑fidelity operations, available via AWS, Azure, and Google Cloud. Tooling and services help teams prototype algorithms and benchmark performance.' }),
      mk(2,{ name:'Infleqtion', tagline:'Neutral‑atom quantum and sensing platforms', industries:['Research','Aerospace','Defense'], solutions:['Neutral‑Atom Qubits','Quantum Sensing'], services:['Partnerships','Engineering','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=infleqtion.com&sz=128', website:'https://www.infleqtion.com/', fullDescription:'Infleqtion (formerly ColdQuanta) develops neutral‑atom quantum computing and quantum sensing systems. Focused on scalable architectures, precision sensing, and strategic collaborations.' }),
      mk(3,{ name:'1QBit', tagline:'Quantum‑inspired optimization and software', industries:['Finance','Logistics','Healthcare'], solutions:['Optimization','ML Tooling'], services:['Advisory','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=1qbit.com&sz=128', website:'https://1qbit.com/', fullDescription:'1QBit builds quantum‑inspired and quantum‑ready software for optimization and machine learning. Works with enterprises to explore practical problem formulations and pipelines.' }),
      mk(4,{ name:'AQT (Alpine Quantum Tech.)', tagline:'Trapped‑ion quantum systems from Europe', industries:['Research','Government'], solutions:['Trapped‑Ion Systems','Control Software'], services:['Systems','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=aqt.eu&sz=128', website:'https://www.aqt.eu/', fullDescription:'Alpine Quantum Technologies (AQT) develops trapped‑ion quantum computers and control stacks in Europe, supporting research labs and public initiatives with integrated systems.' }),
      mk(5,{ name:'Q-CTRL', tagline:'Quantum control and error suppression software', industries:['Research','Cloud'], solutions:['Error Suppression','Fire Opal','Boulder Opal'], services:['Education','Developer Tools','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=q-ctrl.com&sz=128', website:'https://q-ctrl.com/', fullDescription:'Q‑CTRL delivers quantum control software that boosts algorithm performance and hardware reliability. Products include Fire Opal for application‑level users and Boulder Opal for researchers.' }),
      mk(6,{ name:'QC Ware', tagline:'Algorithms and services for near‑term advantage', industries:['Finance','Chemistry','Aerospace'], solutions:['Forge Platform','Custom Algorithms'], services:['Advisory','Implementation','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=qcware.com&sz=128', website:'https://www.qcware.com/', fullDescription:'QC Ware provides quantum algorithms, platforms, and services focused on near‑term value. Areas include finance, chemistry, and machine learning with hardware‑agnostic tooling.' }),
      mk(7,{ name:'Riverlane', tagline:'Quantum error correction stack and Deltaflow', industries:['Research','Semiconductors'], solutions:['QEC Stack','Deltaflow.OS'], services:['Partnerships','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=riverlane.com&sz=128', website:'https://www.riverlane.com/', fullDescription:'Riverlane develops the quantum error‑correction stack and Deltaflow.OS to control and scale heterogeneous quantum devices, partnering with leading hardware companies.' }),
      mk(8,{ name:'Multiverse Computing', tagline:'Quantum and quantum‑inspired finance/industry apps', industries:['Finance','Manufacturing','Energy'], solutions:['Singularity Platform','Optimization','ML'], services:['Consulting','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=multiversecomputing.com&sz=128', website:'https://www.multiversecomputing.com/', fullDescription:'Multiverse builds quantum and quantum‑inspired software for finance and industry. Use cases include portfolio optimization, fraud detection, and complex scheduling.' }),
      mk(9,{ name:'Strangeworks', tagline:'Quantum developer platform and community', industries:['Developers','Research'], solutions:['Strangeworks Platform','Integrations'], services:['Education','Ecosystem','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=strangeworks.com&sz=128', website:'https://strangeworks.com/', fullDescription:'Strangeworks provides a developer‑centric platform aggregating tools and hardware access, helping teams explore quantum computing with shared workspaces and integrations.' }),
      mk(10,{ name:'Universal Quantum', tagline:'Modular trapped‑ion architecture for scale', industries:['Research','Government'], solutions:['Modular Trapped‑Ion','Powerful QEC'], services:['Partnerships','Engineering','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=universalquantum.com&sz=128', website:'https://www.universalquantum.com/', fullDescription:'Universal Quantum proposes a modular trapped‑ion architecture with integrated control for scalable quantum computing, pursuing error‑corrected systems through engineering innovations.' }),
      mk(11,{ name:'Zapata Computing', tagline:'Orquestra platform for quantum‑classical workflows', industries:['Chemistry','ML','Manufacturing'], solutions:['Orquestra','ML & Optimization'], services:['Consulting','Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=zapatacomputing.com&sz=128', website:'https://www.zapatacomputing.com/', fullDescription:'Zapata’s Orquestra platform orchestrates quantum‑classical workflows and manages experimentation at scale, supporting optimization, chemistry, and machine learning use cases.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">⚛️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">Quantum Computing</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Hardware, cloud access, SDKs, and hybrid workflows</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore trapped‑ion, superconducting, photonic platforms, annealers, and managed cloud services.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 11 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      <section id="vendors" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Quantum Computing Vendors</h2>
              <div className="text-gray-600">11 curated vendors across superconducting, trapped‑ion, photonics, annealing, and cloud platforms</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendors.map(v => (
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
      </section>

      {/* Divider and Startups Section */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-teal-700 font-semibold tracking-wide">Quantum Computing Start ups</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Quantum Computing Start ups</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {startups.map(v => (
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
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
