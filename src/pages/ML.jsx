import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
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
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-lime-50 text-lime-700 border border-lime-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-100 to-lime-100 border-2 border-emerald-500">
          <div className="text-sm text-gray-800 leading-6" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '7.5rem' }}>{v.fullDescription || v.about || v.shortDescription || v.tagline}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ML(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/ml'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'ML' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/ml'); return }
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

  const mlopsVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ml-ops-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Domino Data Lab', tagline:'Enterprise MLOps workbench', industries:['Enterprise','Data Science'], solutions:['MLOps','Model Registry','Governance'], services:['Implementation','Support'], website:'https://www.dominodatalab.com/', logoUrl:'https://www.google.com/s2/favicons?domain=dominiondatalab.com&sz=128'.replace('dominion','domino') , fullDescription:'Domino centralizes data science with reproducible environments, model registry, and governance to ship ML to production at scale.' }),
      mk(2,{ name:'DataRobot', tagline:'End-to-end AI lifecycle platform', industries:['Enterprise'], solutions:['AutoML','MLOps','Monitoring'], services:['Implementation','Support'], website:'https://www.datarobot.com/', logoUrl:'https://www.google.com/s2/favicons?domain=datarobot.com&sz=128', fullDescription:'DataRobot delivers automated model development, deployment, and monitoring with governance for enterprise AI.' }),
      mk(3,{ name:'Microsoft Azure Machine Learning', tagline:'Build, train, deploy at scale', industries:['Enterprise','Developers'], solutions:['MLOps','Studio','Governance'], services:['Azure Integration','Support'], website:'https://azure.microsoft.com/en-us/products/machine-learning', logoUrl:'https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=128', fullDescription:'Azure ML provides MLOps, managed compute, and responsible AI tooling integrated with the Microsoft cloud.' }),
      mk(4,{ name:'Google Cloud Vertex AI', tagline:'Unified ML platform on Google Cloud', industries:['Enterprise','Developers'], solutions:['Training','Prediction','MLOps'], services:['GCP Integration','Support'], website:'https://cloud.google.com/vertex-ai', logoUrl:'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128', fullDescription:'Vertex AI unifies data, training, and deployment with MLOps to accelerate ML delivery on Google Cloud.' }),
      mk(5,{ name:'Tecton', tagline:'Enterprise feature platform', industries:['FinTech','Ecommerce','SaaS'], solutions:['Feature Store','Real-time Features'], services:['Implementation','Support'], website:'https://www.tecton.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=tecton.ai&sz=128', fullDescription:'Tecton manages feature pipelines for real-time ML use cases with governance and reliability.' }),
      mk(6,{ name:'Hopsworks', tagline:'Feature store and data-centric AI', industries:['Enterprise'], solutions:['Feature Store','Lakehouse'], services:['Integration','Support'], website:'https://www.hopsworks.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=hopsworks.ai&sz=128', fullDescription:'Hopsworks provides a feature store and data platform for ML with strong data lineage and governance.' }),
      mk(7,{ name:'Feast', tagline:'Open source feature store', industries:['Developers'], solutions:['Feature Store','Batch/Realtime'], services:['Community'], website:'https://feast.dev/', logoUrl:'https://www.google.com/s2/favicons?domain=feast.dev&sz=128', fullDescription:'Feast is an open-source feature store to serve and manage ML features in production.' }),
      mk(8,{ name:'Snowflake', tagline:'Data cloud with ML workloads', industries:['Enterprise'], solutions:['Data Cloud','Feature Tables','ML'], services:['Integration','Support'], website:'https://www.snowflake.com/', logoUrl:'https://www.google.com/s2/favicons?domain=snowflake.com&sz=128', fullDescription:'Snowflake powers ML data pipelines and features with secure data sharing and performance.' }),
      mk(9,{ name:'Redis', tagline:'Real-time data platform for ML', industries:['Enterprise','SaaS'], solutions:['Vector/Key-Value','Feature Store'], services:['Managed','Support'], website:'https://redis.com/', logoUrl:'https://www.google.com/s2/favicons?domain=redis.com&sz=128', fullDescription:'Redis enables low-latency feature serving, vector search, and caching for ML applications.' }),
      mk(10,{ name:'YData', tagline:'Data-centric AI and synthetic data', industries:['Enterprise'], solutions:['Data Quality','Synthetic Data'], services:['Advisory','Support'], website:'https://ydata.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=ydata.ai&sz=128', fullDescription:'YData focuses on data quality and synthetic data generation to improve ML development.' }),
    ]
  }, [])

  const appliedVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ml-applied-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Xemelgo', tagline:'Real-time manufacturing intelligence', industries:['Manufacturing'], solutions:['Visibility','Analytics'], services:['Implementation','Support'], website:'https://www.xemelgo.com/', logoUrl:'https://www.google.com/s2/favicons?domain=xemelgo.com&sz=128', fullDescription:'Xemelgo provides ML-powered visibility and analytics to optimize factory operations.' }),
      mk(2,{ name:'Intel RealSense', tagline:'Depth cameras and perception', industries:['Robotics','Vision','Edge AI'], solutions:['Depth Sensing','SLAM'], services:['SDK','Support'], website:'https://www.intelrealsense.com/', logoUrl:'https://www.google.com/s2/favicons?domain=intelrealsense.com&sz=128', fullDescription:'Intel RealSense delivers depth cameras and SDKs for perception in robotics and edge applications.' }),
      mk(3,{ name:'Appen', tagline:'Training data for AI', industries:['Enterprise'], solutions:['Data Labeling','Collection'], services:['Managed Workforce'], website:'https://appen.com/', logoUrl:'https://www.google.com/s2/favicons?domain=appen.com&sz=128', fullDescription:'Appen supplies high-quality labeled data and collection services for ML.' }),
      mk(4,{ name:'TELUS International (AI Data Solutions)', tagline:'Global AI data solutions', industries:['Enterprise'], solutions:['Annotation','Collection'], services:['Managed Workforce'], website:'https://www.telusinternational.com/solutions/ai-data-solutions', logoUrl:'https://www.google.com/s2/favicons?domain=telusinternational.com&sz=128', fullDescription:'TELUS International provides global annotation and data services for AI initiatives.' }),
      mk(5,{ name:'SuperAnnotate', tagline:'End-to-end data annotation platform', industries:['Vision','NLP'], solutions:['Annotation','QA','Automation'], services:['Labeling Services'], website:'https://www.superannotate.com/', logoUrl:'https://www.google.com/s2/favicons?domain=superannotate.com&sz=128', fullDescription:'SuperAnnotate offers a collaborative platform and services for high-quality training data.' }),
      mk(6,{ name:'Surge AI', tagline:'RLHF and high-quality evaluations', industries:['AI Safety','Enterprise'], solutions:['RLHF','Evaluation'], services:['Managed Workforce'], website:'https://www.surgehq.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=surgehq.ai&sz=128', fullDescription:'Surge AI provides expert feedback and RLHF services to align models safely.' }),
      mk(7,{ name:'Cogito Tech', tagline:'Annotation and AI services', industries:['Enterprise'], solutions:['Annotation','Transcription'], services:['Managed Workforce'], website:'https://www.cogitotech.com/', logoUrl:'https://www.google.com/s2/favicons?domain=cogitotech.com&sz=128', fullDescription:'Cogito delivers data annotation and AI services across modalities.' }),
      mk(8,{ name:'4Paradigm', tagline:'Enterprise AI platform', industries:['Finance','Retail'], solutions:['AutoML','MLOps'], services:['Implementation','Support'], website:'https://www.4paradigm.com/', logoUrl:'https://www.google.com/s2/favicons?domain=4paradigm.com&sz=128', fullDescription:'4Paradigm offers an enterprise AI platform spanning AutoML to MLOps.' }),
    ]
  }, [])

  const intelligenceVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ml-intel-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Toloka', tagline:'Data labeling and evaluations', industries:['Enterprise'], solutions:['Labeling','Eval'], services:['Managed Workforce'], website:'https://toloka.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=toloka.ai&sz=128', fullDescription:'Toloka provides scalable data labeling and evaluation services for ML.' }),
      mk(2,{ name:'Gretel', tagline:'Synthetic data for privacy and scale', industries:['Enterprise'], solutions:['Synthetic Data','Privacy'], services:['Support'], website:'https://gretel.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=gretel.ai&sz=128', fullDescription:'Gretel generates privacy-preserving synthetic data to accelerate ML.' }),
      mk(3,{ name:'CloudFactory', tagline:'Human-in-the-loop workforce', industries:['Enterprise'], solutions:['Annotation','QA'], services:['Managed Workforce'], website:'https://www.cloudfactory.com/', logoUrl:'https://www.google.com/s2/favicons?domain=cloudfactory.com&sz=128', fullDescription:'CloudFactory provides trained teams for annotation and quality assurance.' }),
      mk(4,{ name:'Seldon', tagline:'Open source model serving and monitoring', industries:['Enterprise'], solutions:['Serving','Monitoring'], services:['Support'], website:'https://www.seldon.io/', logoUrl:'https://www.google.com/s2/favicons?domain=seldon.io&sz=128', fullDescription:'Seldon offers open-source and enterprise products for deploying and monitoring ML models.' }),
      mk(5,{ name:'Aporia', tagline:'ML observability platform', industries:['Enterprise'], solutions:['Monitoring','Drift','Bias'], services:['Support'], website:'https://www.aporia.com/', logoUrl:'https://www.google.com/s2/favicons?domain=aporia.com&sz=128', fullDescription:'Aporia monitors models in production for drift, bias, and performance.' }),
      mk(6,{ name:'Interpretable AI', tagline:'Explainable AI and modeling', industries:['Enterprise'], solutions:['Explainability','Modeling'], services:['Support'], website:'https://www.interpretable.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=interpretable.ai&sz=128', fullDescription:'Interpretable AI focuses on explainable models and tools for transparency.' }),
      mk(7,{ name:'Securiti AI', tagline:'Data privacy and governance for AI', industries:['Enterprise'], solutions:['Privacy','Governance'], services:['Support'], website:'https://securiti.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=securiti.ai&sz=128', fullDescription:'Securiti provides privacy, security, and governance solutions for AI data.' }),
      mk(8,{ name:'Credo AI', tagline:'AI governance and risk management', industries:['Enterprise'], solutions:['Governance','Risk','Compliance'], services:['Advisory'], website:'https://www.credo.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=credo.ai&sz=128', fullDescription:'Credo AI manages AI governance, risk, and compliance programs.' }),
      mk(9,{ name:'Fiddler AI', tagline:'Responsible AI with monitoring and XAI', industries:['Enterprise'], solutions:['Monitoring','Explainability'], services:['Support'], website:'https://www.fiddler.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=fiddler.ai&sz=128', fullDescription:'Fiddler provides monitoring and explainability to operate responsible AI.' }),
      mk(10,{ name:'OneTrust', tagline:'Privacy, trust, and data governance', industries:['Enterprise'], solutions:['Privacy','Governance'], services:['Support'], website:'https://www.onetrust.com/', logoUrl:'https://www.google.com/s2/favicons?domain=onetrust.com&sz=128', fullDescription:'OneTrust offers privacy and data governance solutions relevant to AI compliance.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">📊</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent mb-4">Machine Learning</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">AutoML, model training, ML ops</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Platforms and tools for building, training, deploying, and governing ML models at scale.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vendors" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-lime-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> View 20 Vendors</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      {/* 1. ML Infrastructure & Operations (MLOps) */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">ML Infrastructure & Operations (MLOps)</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="infra" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mlopsVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Applied Machine Learning Solutions */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Applied Machine Learning Solutions</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="applied" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {appliedVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Data & Model Intelligence */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Data & Model Intelligence</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="intelligence" className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {intelligenceVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
