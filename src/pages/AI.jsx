import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo}){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
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
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AI(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/ai'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'AI' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ navigate('/login?redirect=/discover/ai'); return }
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
    const mk = (i, d)=> ({ id:`ai-infra-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Cohere', tagline:'Enterprise LLMs and RAG enablement', industries:['Enterprise','Developer Tools'], solutions:['LLMs','RAG','Embeddings'], services:['API','Fine-tuning','Support'], website:'https://cohere.com/', logoUrl:'https://www.google.com/s2/favicons?domain=cohere.com&sz=128', fullDescription:'Cohere provides enterprise-grade language models, embeddings, and RAG tooling to power search, chat, and knowledge applications with data privacy and control.' }),
      mk(2,{ name:'Mistral AI', tagline:'Open, efficient frontier models', industries:['Enterprise','Developers'], solutions:['LLMs','Inference','Finetuning'], services:['API','On‑prem','Support'], website:'https://mistral.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=mistral.ai&sz=128', fullDescription:'Mistral builds compact, high‑performance open models and APIs for cost‑effective inference and customization across use cases.' }),
      mk(3,{ name:'Together AI', tagline:'AI acceleration cloud for OSS models', industries:['SaaS','Developer Tools'], solutions:['Training','Fine‑tuning','Inference'], services:['Serverless API','Dedicated Clusters'], website:'https://www.together.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=together.ai&sz=128', fullDescription:'Together offers an AI cloud to run, fine‑tune, and serve open models with strong price‑performance and tooling for production workloads.' }),
      mk(4,{ name:'Weights & Biases', tagline:'MLOps for experiment tracking and evals', industries:['Technology','Data Science'], solutions:['Experiment Tracking','Model Registry','Evals'], services:['Integrations','Support'], website:'https://wandb.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=wandb.ai&sz=128', fullDescription:'W&B provides experiment tracking, model registry, and evaluation workflows to manage ML development end‑to‑end.' }),
      mk(5,{ name:'OctoML', tagline:'Optimized model deployment, anywhere', industries:['Enterprise','Cloud'], solutions:['Optimization','Inference','Deployment'], services:['Advisory','Support'], website:'https://octoml.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=octoml.ai&sz=128', fullDescription:'OctoML automates model optimization and packaging to deploy across clouds and hardware with improved latency and cost.' }),
      mk(6,{ name:'Run.ai', tagline:'GPU orchestration for AI workloads', industries:['Enterprise','Cloud'], solutions:['GPU Virtualization','Scheduling','Cost Control'], services:['Integration','Support'], website:'https://www.run.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=run.ai&sz=128', fullDescription:'Run.ai virtualizes and orchestrates GPUs to maximize utilization for training and inference across teams and clusters.' }),
      mk(7,{ name:'Pinecone', tagline:'Vector database for AI search', industries:['Enterprise','SaaS'], solutions:['Vector DB','RAG','Hybrid Search'], services:['Serverless','Support'], website:'https://www.pinecone.io/', logoUrl:'https://www.google.com/s2/favicons?domain=pinecone.io&sz=128', fullDescription:'Pinecone is a fully managed vector database to build RAG and semantic search with reliability and scale.' }),
    ]
  }, [])

  const productivityVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ai-prod-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Adept AI', tagline:'Agentic workflow automation for software', industries:['Enterprise','SaaS'], solutions:['Agents','Automation','Integrations'], services:['Implementation','Support'], website:'https://www.adept.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=adept.ai&sz=128', fullDescription:'Adept builds agents that operate software to automate complex workflows, connecting LLMs to real tools and data.' }),
      mk(2,{ name:'Humata AI', tagline:'Ask questions over documents instantly', industries:['Enterprise','Legal','Research'], solutions:['Doc QA','Summarization','Search'], services:['Integration','Support'], website:'https://www.humata.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=humata.ai&sz=128', fullDescription:'Humata enables chat and answers over large document sets to accelerate reviews, research, and support.' }),
      mk(3,{ name:'Rewind AI', tagline:'Personal knowledge, searchable and private', industries:['Productivity'], solutions:['Personal RAG','Search','Recall'], services:['Apps','Support'], website:'https://www.rewind.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=rewind.ai&sz=128', fullDescription:'Rewind captures on‑device history and makes everything searchable with privacy controls for personal productivity.' }),
      mk(4,{ name:'Mem AI', tagline:'AI workspace for notes and knowledge', industries:['Productivity','SaaS'], solutions:['Knowledge Base','Search','Automation'], services:['Apps','Integrations'], website:'https://get.mem.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=get.mem.ai&sz=128', fullDescription:'Mem organizes notes and knowledge with AI, enabling fast retrieval and automated workflows across tools.' }),
      mk(5,{ name:'Tavus', tagline:'Personalized AI video at scale', industries:['Marketing','Sales'], solutions:['Video Generation','Personalization','Campaigns'], services:['Integration','Support'], website:'https://www.tavus.io/', logoUrl:'https://www.google.com/s2/favicons?domain=tavus.io&sz=128', fullDescription:'Tavus generates personalized videos for outreach and lifecycle campaigns to boost engagement and conversion.' }),
      mk(6,{ name:'Typewise', tagline:'AI text automation for customer service', industries:['Customer Support','Enterprise'], solutions:['Text Automation','Agent Assist'], services:['Implementation','Support'], website:'https://www.typewise.app/', logoUrl:'https://www.google.com/s2/favicons?domain=typewise.app&sz=128', fullDescription:'Typewise accelerates customer communications with AI suggestions and automation tailored to enterprise workflows.' }),
      mk(7,{ name:'Mindflow', tagline:'No‑code security and IT automations', industries:['Security','IT'], solutions:['SOAR','Workflows','Integrations'], services:['Implementation','Support'], website:'https://www.mindflow.io/', logoUrl:'https://www.google.com/s2/favicons?domain=mindflow.io&sz=128', fullDescription:'Mindflow offers a no‑code platform to orchestrate security and IT workflows with hundreds of integrations.' }),
    ]
  }, [])

  const appliedVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ai-applied-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'PathAI', tagline:'AI‑powered pathology and diagnostics', industries:['Healthcare','Life Sciences'], solutions:['Diagnostics','Clinical AI'], services:['Partnerships','Support'], website:'https://www.pathai.com/', logoUrl:'https://www.google.com/s2/favicons?domain=pathai.com&sz=128', fullDescription:'PathAI develops AI for pathology to improve diagnosis and treatment decisions across research and clinical workflows.' }),
      mk(2,{ name:'Veo Robotics', tagline:'3D vision and safety for industrial robots', industries:['Manufacturing'], solutions:['Vision','Safety'], services:['Integration','Support'], website:'https://www.veobot.com/', logoUrl:'https://www.google.com/s2/favicons?domain=veobot.com&sz=128', fullDescription:'Veo enables safe human‑robot collaboration using 3D sensing and intelligent perception for industrial automation.' }),
      mk(3,{ name:'Taktile', tagline:'Decisioning platform for underwriting and risk', industries:['FinTech','Insurance'], solutions:['Decisioning','Policy','Testing'], services:['Integration','Support'], website:'https://www.taktile.com/', logoUrl:'https://www.google.com/s2/favicons?domain=taktile.com&sz=128', fullDescription:'Taktile lets teams build, test, and deploy decision flows for underwriting, pricing, and risk with transparency.' }),
      mk(4,{ name:'Standard AI', tagline:'Computer vision checkout for retail', industries:['Retail'], solutions:['Autonomous Checkout','Analytics'], services:['Deployment','Support'], website:'https://standard.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=standard.ai&sz=128', fullDescription:'Standard AI powers cashierless checkout and in‑store analytics with computer vision.' }),
      mk(5,{ name:'Fathom Radiant', tagline:'Optical interconnects for AI compute', industries:['Semiconductors','Cloud'], solutions:['Optical Systems'], services:['Partnerships'], website:'https://fathomradiant.com/', logoUrl:'https://www.google.com/s2/favicons?domain=fathomradiant.com&sz=128', fullDescription:'Fathom Radiant designs optical interconnect systems to scale AI compute and reduce energy per training run.' }),
      mk(6,{ name:'Cresta AI', tagline:'Real‑time agent assist for contact centers', industries:['Customer Support'], solutions:['Agent Assist','Coaching','Analytics'], services:['Implementation','Support'], website:'https://cresta.com/', logoUrl:'https://www.google.com/s2/favicons?domain=cresta.com&sz=128', fullDescription:'Cresta provides AI assistance and coaching to improve contact center productivity and outcomes.' }),
      mk(7,{ name:'Invisible AI', tagline:'Edge vision for factory operations', industries:['Manufacturing'], solutions:['Vision','Quality','Safety'], services:['Deployment','Support'], website:'https://invisible.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=invisible.ai&sz=128', fullDescription:'Invisible AI delivers edge camera systems and analytics to monitor assembly lines and improve quality and safety.' }),
    ]
  }, [])

  const safetyVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ai-safety-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Credo AI', tagline:'AI governance, risk, and compliance', industries:['Enterprise'], solutions:['Governance','Risk','Compliance'], services:['Advisory','Integration'], website:'https://www.credo.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=credo.ai&sz=128', fullDescription:'Credo AI provides a platform to manage AI governance and risk with policy controls, assessments, and reporting.' }),
      mk(2,{ name:'Arthur AI', tagline:'Model monitoring and observability', industries:['Enterprise'], solutions:['Monitoring','Bias','Drift'], services:['Integration','Support'], website:'https://www.arthur.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=arthur.ai&sz=128', fullDescription:'Arthur monitors models in production for performance, bias, and drift with actionable alerts and dashboards.' }),
      mk(3,{ name:'Lakera', tagline:'AI safety and red‑teaming tools', industries:['Enterprise','Developers'], solutions:['Prompt Safety','Guardrails','Eval'], services:['Integration','Support'], website:'https://www.lakera.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=lakera.ai&sz=128', fullDescription:'Lakera offers safety tooling and guardrails to protect LLM applications from prompt injection and data leakage.' }),
      mk(4,{ name:'CalypsoAI', tagline:'Secure AI adoption and governance', industries:['Enterprise','Public Sector'], solutions:['Security','Validation'], services:['Integration','Support'], website:'https://www.calypsoai.com/', logoUrl:'https://www.google.com/s2/favicons?domain=calypsoai.com&sz=128', fullDescription:'CalypsoAI secures AI usage with validation, controls, and monitoring across enterprise environments.' }),
      mk(5,{ name:'Protect AI', tagline:'ML security and supply chain protection', industries:['Enterprise'], solutions:['SBOM','Threat Detection','Governance'], services:['Advisory','Support'], website:'https://www.protectai.com/', logoUrl:'https://www.google.com/s2/favicons?domain=protectai.com&sz=128', fullDescription:'Protect AI provides ML security products for model supply chain, threat detection, and governance.' }),
      mk(6,{ name:'Verta', tagline:'Model management and governance', industries:['Enterprise'], solutions:['Model Registry','MLOps','Governance'], services:['Integration','Support'], website:'https://www.verta.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=verta.ai&sz=128', fullDescription:'Verta unifies model registry, deployment, and governance to ship AI reliably and compliantly.' }),
      mk(7,{ name:'Fiddler AI', tagline:'Responsible AI with explainability', industries:['Enterprise'], solutions:['Monitoring','Explainability','Bias'], services:['Integration','Support'], website:'https://www.fiddler.ai/', logoUrl:'https://www.google.com/s2/favicons?domain=fiddler.ai&sz=128', fullDescription:'Fiddler delivers monitoring and explainability to build and operate responsible AI with transparency.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, d)=> ({ id:`ai-startup-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Character.AI', tagline:'Conversational AI companions and chatbots', industries:['Consumer','Entertainment'], solutions:['Chatbots','Roleplay','Companions'], services:['Platform','API'], website:'https://character.ai', logoUrl:'https://www.google.com/s2/favicons?domain=character.ai&sz=128', fullDescription:'Character.AI enables users to create and interact with AI-powered characters for entertainment, learning, and companionship. Platform uses advanced language models to generate natural, engaging conversations with distinct personalities. Users can chat with historical figures, fictional characters, or create custom AI personas. Combines entertainment value with practical applications in education, creative writing, and language practice.' }),
      mk(2,{ name:'Weights & Biases', tagline:'MLOps platform for experiment tracking', industries:['ML Engineering','Data Science'], solutions:['Experiment Tracking','Model Registry','Collaboration'], services:['Platform','Support'], website:'https://wandb.ai', logoUrl:'https://www.google.com/s2/favicons?domain=wandb.ai&sz=128', fullDescription:'Weights & Biases provides comprehensive MLOps tools for tracking experiments, versioning models, and collaborating across ML teams. Platform automatically logs metrics, hyperparameters, and artifacts during training runs for easy comparison and reproducibility. Visualization dashboards help teams understand model performance and make data-driven decisions. Integrates seamlessly with popular ML frameworks and scales from individual researchers to enterprise teams.' }),
      mk(3,{ name:'Reka AI', tagline:'Multimodal AI models and research', industries:['AI Research','Enterprise'], solutions:['Multimodal Models','Vision-Language','API'], services:['Research','Platform'], website:'https://www.reka.ai', logoUrl:'https://www.google.com/s2/favicons?domain=reka.ai&sz=128', fullDescription:'Reka AI develops cutting-edge multimodal foundation models that understand and generate text, images, and video together. Research-driven approach pushes boundaries of AI capabilities while building practical products for enterprises. Models excel at complex reasoning tasks that require understanding multiple modalities simultaneously. Focuses on efficiency and performance to make advanced AI accessible and deployable at scale.' }),
      mk(4,{ name:'Harvey', tagline:'AI copilot for legal professionals', industries:['Legal','Enterprise'], solutions:['Legal Research','Document Review','Drafting'], services:['Platform','Integration'], website:'https://www.harvey.ai', logoUrl:'https://www.google.com/s2/favicons?domain=harvey.ai&sz=128', fullDescription:'Harvey provides AI-powered assistance for legal research, document analysis, and drafting tailored to law firms and legal departments. Platform understands legal context and jurisdiction-specific nuances to deliver accurate, relevant results. Helps lawyers work more efficiently by automating routine tasks while maintaining high quality standards. Built with security and confidentiality requirements of legal practice in mind, with audit trails and compliance features.' }),
      mk(5,{ name:'Hebbia', tagline:'AI-powered knowledge work and research', industries:['Enterprise','Financial Services'], solutions:['Document Analysis','Research','Knowledge Extraction'], services:['Platform','API'], website:'https://www.hebbia.ai', logoUrl:'https://www.google.com/s2/favicons?domain=hebbia.ai&sz=128', fullDescription:'Hebbia transforms how knowledge workers interact with documents and data through AI-powered search and analysis. Platform can process massive document sets to extract insights, answer complex questions, and synthesize information across sources. Particularly valuable for financial analysis, due diligence, and research-intensive workflows. Neural search capabilities go beyond keyword matching to understand intent and context for more relevant results.' }),
      mk(6,{ name:'Reflection AI', tagline:'AI-powered self-improvement and coaching', industries:['Personal Development','HR'], solutions:['Coaching','Feedback','Development'], services:['Platform','Programs'], website:'https://www.reflection.ai', logoUrl:'https://www.google.com/s2/favicons?domain=reflection.ai&sz=128', fullDescription:'Reflection AI uses artificial intelligence to provide personalized coaching and development feedback for individuals and teams. Platform analyzes communication patterns, behaviors, and goals to deliver actionable insights for improvement. Helps users build self-awareness and develop skills through AI-guided reflection exercises and feedback loops. Combines behavioral science with machine learning to create effective development experiences at scale.' }),
      mk(7,{ name:'Luma Labs', tagline:'AI for 3D content creation and video', industries:['Media','Gaming','E-commerce'], solutions:['3D Generation','Video AI','NeRF'], services:['API','Platform'], website:'https://lumalabs.ai', logoUrl:'https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128', fullDescription:'Luma Labs develops AI technology for creating and manipulating 3D content and video with unprecedented ease and quality. Platform enables users to capture 3D scenes from photos or generate 3D assets from text descriptions. Neural rendering techniques produce photorealistic results suitable for games, films, and product visualization. Makes professional-quality 3D content creation accessible to creators without specialized technical skills or equipment.' }),
      mk(8,{ name:'Pika', tagline:'AI video generation and editing platform', industries:['Media','Marketing','Content Creation'], solutions:['Video Generation','Editing','Animation'], services:['Platform','API'], website:'https://www.pika.art', logoUrl:'https://www.google.com/s2/favicons?domain=pika.art&sz=128', fullDescription:'Pika enables anyone to create and edit videos using AI, from text prompts or existing footage. Platform generates high-quality video content with natural motion and coherent scenes. Users can modify videos by describing desired changes in natural language, making editing intuitive and accessible. Empowers creators, marketers, and businesses to produce engaging video content quickly without traditional video production expertise or resources.' }),
      mk(9,{ name:'Greylock', tagline:'Venture capital investing in AI and technology', industries:['Venture Capital','Technology'], solutions:['Funding','Advisory','Network'], services:['Investment','Support'], website:'https://www.greylock.com', logoUrl:'https://www.google.com/s2/favicons?domain=greylock.com&sz=128', fullDescription:'Greylock Partners is a leading venture capital firm investing in transformative technology companies, with strong focus on AI and enterprise software. Portfolio includes many successful AI startups and provides extensive network and expertise to portfolio companies. Partners work closely with founders on strategy, hiring, and scaling challenges. Long track record of backing category-defining companies from early stages through IPO and beyond.' }),
      mk(10,{ name:'Replicate', tagline:'Run AI models with simple API', industries:['Developer Tools','AI Infrastructure'], solutions:['Model Hosting','API','Deployment'], services:['Platform','Support'], website:'https://replicate.com', logoUrl:'https://www.google.com/s2/favicons?domain=replicate.com&sz=128', fullDescription:'Replicate makes it easy to run machine learning models in the cloud with a simple API, without managing infrastructure. Platform hosts thousands of open-source models for image generation, language processing, audio, and more. Developers can deploy custom models or use existing ones with just a few lines of code. Handles scaling, versioning, and optimization automatically so teams can focus on building applications rather than ML operations.' }),
      mk(11,{ name:'Twelve Labs', tagline:'Multimodal AI for video understanding', industries:['Media','Enterprise','Security'], solutions:['Video Search','Analysis','Classification'], services:['API','Platform'], website:'https://twelvelabs.io', logoUrl:'https://www.google.com/s2/favicons?domain=twelvelabs.io&sz=128', fullDescription:'Twelve Labs provides multimodal foundation models specifically designed for video understanding and search. Platform can analyze video content across visual, audio, and text dimensions to enable semantic search and insights. Helps organizations unlock value from massive video libraries by making content searchable and analyzable at scale. Applications span media asset management, content moderation, security surveillance, and video analytics across industries.' }),
      mk(12,{ name:'Copy.ai', tagline:'AI-powered copywriting and content creation', industries:['Marketing','Content','E-commerce'], solutions:['Copywriting','Content Generation','SEO'], services:['Platform','Templates'], website:'https://www.copy.ai', logoUrl:'https://www.google.com/s2/favicons?domain=copy.ai&sz=128', fullDescription:'Copy.ai helps marketers and businesses create high-quality written content using AI, from ads and emails to blog posts and product descriptions. Platform offers templates and workflows optimized for different content types and marketing channels. AI understands brand voice and target audience to generate on-brand copy that converts. Accelerates content creation process while maintaining quality, helping teams scale their content marketing efforts efficiently.' }),
      mk(13,{ name:'Tome', tagline:'AI-powered storytelling and presentations', industries:['Business','Education','Marketing'], solutions:['Presentations','Storytelling','Design'], services:['Platform','Templates'], website:'https://tome.app', logoUrl:'https://www.google.com/s2/favicons?domain=tome.app&sz=128', fullDescription:'Tome uses AI to help users create compelling presentations and narratives with beautiful design automatically. Platform generates slide layouts, suggests content structure, and finds relevant images based on your story. Natural language interface makes it easy to refine and iterate on presentations quickly. Combines AI generation with intuitive editing tools to produce professional presentations in minutes rather than hours.' }),
      mk(14,{ name:'Modal', tagline:'Serverless platform for AI and data workloads', industries:['Developer Tools','AI Infrastructure'], solutions:['Serverless Compute','GPU Access','Scheduling'], services:['Platform','Support'], website:'https://modal.com', logoUrl:'https://www.google.com/s2/favicons?domain=modal.com&sz=128', fullDescription:'Modal provides serverless infrastructure specifically designed for running AI models and data processing workloads. Platform makes it simple to run Python code in the cloud with access to GPUs and scale automatically. Developers define compute requirements in code and Modal handles provisioning, scaling, and optimization. Eliminates infrastructure management overhead so data scientists and ML engineers can focus on their models and applications.' }),
      mk(15,{ name:'Obviously AI', tagline:'No-code machine learning platform', industries:['Business Analytics','Enterprise'], solutions:['AutoML','Predictions','Analytics'], services:['Platform','Support'], website:'https://www.obviously.ai', logoUrl:'https://www.google.com/s2/favicons?domain=obviously.ai&sz=128', fullDescription:'Obviously AI enables business users to build and deploy machine learning models without coding or data science expertise. Platform automates the entire ML workflow from data preparation through model training and deployment. Users can make predictions, identify patterns, and generate insights from their data through an intuitive interface. Democratizes access to machine learning for business analysts, marketers, and operations teams to make data-driven decisions.' }),
      mk(16,{ name:'Gamma', tagline:'AI-powered docs, decks, and webpages', industries:['Productivity','Business','Education'], solutions:['Documents','Presentations','Websites'], services:['Platform','Templates'], website:'https://gamma.app', logoUrl:'https://www.google.com/s2/favicons?domain=gamma.app&sz=128', fullDescription:'Gamma transforms how people create and share ideas through AI-powered documents, presentations, and web pages. Platform generates beautiful, interactive content from simple prompts or outlines with smart formatting and design. Users can easily refine and customize AI-generated content while maintaining professional polish. Combines flexibility of documents with visual impact of presentations in a modern, collaborative format that works across devices.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx_auto px-6 text-center">
          <div className="text-6xl">🤖</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">Artificial Intelligence</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Infra & enablement, productivity, applied AI, and governance</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore AI infrastructure platforms, workflow automation, vertical solutions, and safety & governance tools.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#infra" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 1. AI Infrastructure & Enablement Platforms */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-blue-700 font-semibold tracking-wide">AI Infrastructure & Enablement Platforms</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
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

      {/* 2. AI Productivity & Workflow Automation */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-blue-700 font-semibold tracking-wide">AI Productivity & Workflow Automation</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="productivity" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productivityVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Applied AI for Industry & Vertical Solutions */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-blue-700 font-semibold tracking-wide">Applied AI for Industry & Vertical Solutions</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
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

      {/* 4. AI Safety, Governance & Compliance Tools */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-blue-700 font-semibold tracking-wide">AI Safety, Governance & Compliance Tools</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="safety" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {safetyVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
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
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}
