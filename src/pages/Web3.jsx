import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-violet-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20">
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">{x}</span>)}
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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-fuchsia-100 border-2 border-violet-500">
          <div className="text-sm text-gray-800 leading-6" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '7.5rem' }}>{v.fullDescription || v.about || v.shortDescription || v.tagline}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-violet-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Web3(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/web3'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'Web3' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/web3'); return }
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

  const infraVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`bc-infra-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Chainstack', tagline:'Managed multi-cloud blockchain nodes', industries:['Developers','Enterprises'], solutions:['Nodes','APIs','Data'], services:['Managed','Support'], website:'https://chainstack.com/', logoUrl:'https://www.google.com/s2/favicons?domain=chainstack.com&sz=128', fullDescription:'Chainstack deploys and operates blockchain nodes across clouds with robust APIs and data services, reducing ops overhead for teams building on multiple networks.' }),
      mk(2,{ name:'Tenderly', tagline:'Developer platform for smart contracts', industries:['Developers','DeFi'], solutions:['Debugging','Simulations','Monitoring'], services:['API','Support'], website:'https://tenderly.co/', logoUrl:'https://www.google.com/s2/favicons?domain=tenderly.co&sz=128', fullDescription:'Tenderly provides debugging, simulations, and observability for smart contracts with real-time alerts and powerful dev tools to ship dApps faster.' }),
      mk(3,{ name:'Fastnode', tagline:'High-performance node infrastructure', industries:['Developers'], solutions:['Nodes','RPC'], services:['Managed'], website:'https://fastnode.io/', logoUrl:'https://www.google.com/s2/favicons?domain=fastnode.io&sz=128', fullDescription:'Fastnode delivers low-latency RPC and reliable node endpoints for popular chains, optimized for performance and scale.' }),
      mk(4,{ name:'Instanodes', tagline:'Instant blockchain nodes', industries:['Developers','Startups'], solutions:['Nodes','RPC'], services:['Managed'], website:'https://instanodes.com/', logoUrl:'https://www.google.com/s2/favicons?domain=instanodes.com&sz=128', fullDescription:'Instanodes spins up production-ready nodes and RPC endpoints quickly, simplifying provisioning for prototypes and production.' }),
      mk(5,{ name:'Neuron World', tagline:'Web3 infrastructure and tooling', industries:['Enterprises','Developers'], solutions:['Infra','APIs'], services:['Consulting','Support'], website:'https://neuron.world/', logoUrl:'https://www.google.com/s2/favicons?domain=neuron.world&sz=128', fullDescription:'Neuron World supports Web3 initiatives with infrastructure, APIs, and services to accelerate blockchain adoption.' }),
      mk(6,{ name:'Zeeve', tagline:'Enterprise blockchain DevOps platform', industries:['Enterprises','Consortia'], solutions:['DevOps','Nodes','Consortium'], services:['Managed','Support'], website:'https://www.zeeve.io/', logoUrl:'https://www.google.com/s2/favicons?domain=zeeve.io&sz=128', fullDescription:'Zeeve automates deployment and management of blockchain networks and nodes for enterprises and consortia with governance and monitoring.' }),
      mk(7,{ name:'TEKHQS', tagline:'Blockchain development & infrastructure', industries:['Enterprises'], solutions:['Development','Integration'], services:['Consulting','Support'], website:'https://www.tekhqs.com/', logoUrl:'https://www.google.com/s2/favicons?domain=tekhqs.com&sz=128', fullDescription:'TEKHQS delivers blockchain development, integration, and infrastructure services tailored to enterprise needs.' }),
    ]
  }, [])

  const tokenizationVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`bc-token-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Brickken', tagline:'Tokenization of real-world assets', industries:['Capital Markets','Real Estate'], solutions:['Tokenization','Compliance'], services:['Platform','Support'], website:'https://www.brickken.com/', logoUrl:'https://www.google.com/s2/favicons?domain=brickken.com&sz=128', fullDescription:'Brickken tokenizes real-world assets with compliance workflows, investor management, and secondary market integrations.' }),
      mk(2,{ name:'Antier Solutions', tagline:'End-to-end blockchain & tokenization', industries:['Enterprises','Financial'], solutions:['Tokenization','Exchange','Wallets'], services:['Development','Consulting'], website:'https://www.antiersolutions.com/', logoUrl:'https://www.google.com/s2/favicons?domain=antiersolutions.com&sz=128', fullDescription:'Antier builds tokenization platforms, exchanges, and wallets for enterprises adopting digital assets.' }),
      mk(3,{ name:'Tokeny Solutions', tagline:'Institutional tokenization platform', industries:['Capital Markets'], solutions:['Compliance','Tokenization'], services:['Platform','Support'], website:'https://tokeny.com/', logoUrl:'https://www.google.com/s2/favicons?domain=tokeny.com&sz=128', fullDescription:'Tokeny enables compliant issuance and lifecycle management of digital assets for institutions and issuers.' }),
      mk(4,{ name:'Securitize', tagline:'Digital securities issuance & transfer', industries:['Capital Markets'], solutions:['Issuance','ATS','Compliance'], services:['Platform','Support'], website:'https://www.securitize.io/', logoUrl:'https://www.google.com/s2/favicons?domain=securitize.io&sz=128', fullDescription:'Securitize provides issuance, transfer agent, and trading infrastructure for regulated digital securities.' }),
      mk(5,{ name:'DigiDevo', tagline:'Blockchain products & token utilities', industries:['Enterprises','Startups'], solutions:['Token Utilities','dApps'], services:['Development','Consulting'], website:'https://www.digidevo.com/', logoUrl:'https://www.google.com/s2/favicons?domain=digidevo.com&sz=128', fullDescription:'DigiDevo develops blockchain products, token utilities, and dApps for businesses.' }),
      mk(6,{ name:'Comet Platform', tagline:'Digital asset & tokenization suite', industries:['Enterprises'], solutions:['Tokenization','Wallets'], services:['Platform','Support'], website:'https://cometplatform.com/', logoUrl:'https://www.google.com/s2/favicons?domain=cometplatform.com&sz=128', fullDescription:'Comet Platform offers tooling to issue and manage digital assets with integrated wallets and compliance.' }),
      mk(7,{ name:'Tokelia', tagline:'Tokenization & blockchain solutions', industries:['Enterprises'], solutions:['Tokenization','Automation'], services:['Consulting','Development'], website:'https://www.tokelia.com/', logoUrl:'https://www.google.com/s2/favicons?domain=tokelia.com&sz=128', fullDescription:'Tokelia provides tokenization and blockchain solution delivery for enterprises.' }),
    ]
  }, [])

  const dappVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`bc-dapp-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Kaleido', tagline:'Enterprise Web3 platform & automation', industries:['Enterprises','Consortia'], solutions:['Smart Contracts','Tokenization','Compliance'], services:['Platform','Support'], website:'https://kaleido.io/', logoUrl:'https://www.google.com/s2/favicons?domain=kaleido.io&sz=128', fullDescription:'Kaleido provides an enterprise Web3 platform to build smart contract apps, tokenization, and integrations with compliance at scale.' }),
      mk(2,{ name:'Labrys', tagline:'Blockchain product development', industries:['Enterprises','Startups'], solutions:['dApps','Smart Contracts'], services:['Development','Consulting'], website:'https://labrys.io/', logoUrl:'https://www.google.com/s2/favicons?domain=labrys.io&sz=128', fullDescription:'Labrys designs and builds dApps and smart contracts end-to-end with product strategy and engineering.' }),
      mk(3,{ name:'QSS Technosoft Inc', tagline:'Enterprise blockchain engineering', industries:['Enterprises'], solutions:['dApps','Integration'], services:['Development','Consulting'], website:'https://www.qsstechnosoft.com/', logoUrl:'https://www.google.com/s2/favicons?domain=qsstechnosoft.com&sz=128', fullDescription:'QSS delivers blockchain apps and integrations tailored to enterprise workflows and systems.' }),
      mk(4,{ name:'Exobloc', tagline:'Web3 engineering and auditing', industries:['Startups','Enterprises'], solutions:['Smart Contracts','dApps'], services:['Development','Audit'], website:'https://exobloc.com/', logoUrl:'https://www.google.com/s2/favicons?domain=exobloc.com&sz=128', fullDescription:'Exobloc builds and audits smart contracts and dApps with an emphasis on quality and security.' }),
      mk(5,{ name:'DALPS Global', tagline:'Distributed apps & protocol services', industries:['Enterprises'], solutions:['dApps','Automation'], services:['Consulting','Development'], website:'https://dalps.io/', logoUrl:'https://www.google.com/s2/favicons?domain=dalps.io&sz=128', fullDescription:'DALPS Global delivers distributed applications and automation on blockchain for enterprise use cases.' }),
      mk(6,{ name:'Alpharive', tagline:'Web3 solutions & automation', industries:['Startups','Enterprises'], solutions:['Smart Contracts','Automation'], services:['Development','Consulting'], website:'https://alpharive.com/', logoUrl:'https://www.google.com/s2/favicons?domain=alpharive.com&sz=128', fullDescription:'Alpharive develops smart contracts, automation, and Web3 apps with a focus on delivery speed.' }),
      mk(7,{ name:'Inbuco', tagline:'Product engineering for Web3', industries:['Startups','Enterprises'], solutions:['dApps','Integrations'], services:['Development','Consulting'], website:'https://inbuco.com/', logoUrl:'https://www.google.com/s2/favicons?domain=inbuco.com&sz=128', fullDescription:'Inbuco provides product and engineering services to build Web3 applications and integrations.' }),
    ]
  }, [])

  const enterpriseVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`bc-enter-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Tradle', tagline:'KYC on blockchain for institutions', industries:['Financial Services'], solutions:['KYC','Compliance'], services:['Platform','Support'], website:'https://tradle.io/', logoUrl:'https://www.google.com/s2/favicons?domain=tradle.io&sz=128', fullDescription:'Tradle provides KYC and compliance workflows powered by blockchain for financial institutions.' }),
      mk(2,{ name:'ESGit', tagline:'Enterprise blockchain & compliance', industries:['Enterprises'], solutions:['Compliance','Governance'], services:['Consulting','Development'], website:'https://www.esgit.com/', logoUrl:'https://www.google.com/s2/favicons?domain=esgit.com&sz=128', fullDescription:'ESGit offers enterprise blockchain solutions with a focus on compliance and governance.' }),
      mk(3,{ name:'Taceo', tagline:'Privacy-preserving data sharing', industries:['Enterprises'], solutions:['Confidential Computing','Zero-Knowledge'], services:['Platform','Support'], website:'https://www.taceo.com/', logoUrl:'https://www.google.com/s2/favicons?domain=taceo.com&sz=128', fullDescription:'Taceo enables privacy-preserving data sharing using cryptographic techniques and confidential computing.' }),
      mk(4,{ name:'Witness', tagline:'Proof and attestation platform', industries:['Enterprises'], solutions:['Attestations','Audit'], services:['Platform','Support'], website:'https://www.witness.co/', logoUrl:'https://www.google.com/s2/favicons?domain=witness.co&sz=128', fullDescription:'Witness provides proof, attestation, and audit mechanisms leveraging blockchain for enterprise trust.' }),
      mk(5,{ name:'Arcisphere Technologies', tagline:'Enterprise integration and governance', industries:['Enterprises'], solutions:['Integration','Governance'], services:['Consulting','Implementation'], website:'https://arcisphere.tech/', logoUrl:'https://www.google.com/s2/favicons?domain=arcisphere.tech&sz=128', fullDescription:'Arcisphere helps enterprises integrate blockchain into systems with governance and best practices.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">⛓️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">Blockchain / Web3</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Smart contracts, DeFi, NFTs</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Infrastructure, wallets, security, and data services to build production-grade Web3 apps.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#infra" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      {/* 1. Blockchain Infrastructure & Network Foundations */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-violet-700 font-semibold tracking-wide">Blockchain Infrastructure & Network Foundations</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="infra" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {infraVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Tokenization, Digital Assets & RWA Platforms */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-violet-700 font-semibold tracking-wide">Tokenization, Digital Assets & Real-World Asset Platforms</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="tokenization" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tokenizationVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Smart Contracts, dApps & Automation Frameworks */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-violet-700 font-semibold tracking-wide">Smart Contracts, dApps & Automation Frameworks</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="dapps" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dappVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Enterprise, Compliance & Trust Solutions */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-violet-700 font-semibold tracking-wide">Enterprise, Compliance & Trust Solutions</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="enterprise" className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enterpriseVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
