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
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-rose-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-rose-500/20 to-red-500/20">
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
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => (
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => (
                <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{x}</span>
              ))}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-rose-100 to-red-100 border-2 border-rose-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.about || v.fullDescription || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold">Request Live Demo</button>
          <a href={`/compare?v1=${encodeURIComponent(v.name)}`} className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {v.website && (
              <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-rose-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>
            )}
            {v.contactUrl && (
              <a href={v.contactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-rose-700 font-semibold"><ExternalLink size={14}/> Contact</a>
            )}
          </div>
          <button onClick={onToggleSave} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${saved? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400'}`}>
            <Heart size={16} className={saved? 'text-red-500 fill-current' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MedTech(){
  const { currentUser } = useAuth()
  const router = useRouter()
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
    if (!currentUser){ router.push('/login?redirect=/discover/medtech'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'MedTech' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }
  const devices = useMemo(()=>{
    const mk = (i, data) => ({ id:`md-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Medtronic', tagline:'Smart devices and therapies across care areas', industries:['Hospitals','Clinics','Surgery'], solutions:['Implantables','Surgical Robotics','Monitoring'], services:['Clinical Support','Training','Maintenance'], logoUrl:'https://www.google.com/s2/favicons?domain=medtronic.com&sz=128', website:'https://www.medtronic.com/', about:'Medtronic develops implantable devices, surgical robotics, and monitoring technologies to improve outcomes across cardiology, diabetes, and more.' }),
      mk(2,{ name:'Abbott Laboratories', tagline:'Diagnostics, devices, and continuous monitoring', industries:['Hospitals','Labs','Primary Care'], solutions:['CGM','Lab Diagnostics','Cardiovascular'], services:['Implementation','Clinical Support'], logoUrl:'https://www.google.com/s2/favicons?domain=abbott.com&sz=128', website:'https://www.abbott.com/', about:'Abbott delivers diagnostics, cardiovascular devices, and glucose monitoring systems that enable earlier detection and better disease management.' }),
      mk(3,{ name:'Siemens Healthineers', tagline:'Imaging, diagnostics, and advanced therapies', industries:['Hospitals','Imaging Centers','Cancer Centers'], solutions:['MRI','CT','Lab Automation'], services:['Managed Service','Cloud Apps','Field Service'], logoUrl:'https://www.google.com/s2/favicons?domain=siemens-healthineers.com&sz=128', website:'https://www.siemens-healthineers.com/', about:'Siemens Healthineers provides imaging and diagnostics with AI‑enabled workflows, connecting data across the care continuum.' }),
      mk(4,{ name:'Philips Healthcare', tagline:'Connected care and imaging solutions', industries:['Hospitals','ICU','Home Care'], solutions:['Patient Monitoring','CT/MR','Connected Care'], services:['Remote Monitoring','Service'], logoUrl:'https://www.google.com/s2/favicons?domain=philips.com&sz=128', website:'https://www.philips.com/healthcare', about:'Philips builds imaging, patient monitoring, and connected care platforms that improve productivity and patient outcomes.' }),
      mk(5,{ name:'Dexcom', tagline:'Continuous glucose monitoring systems', industries:['Endocrinology','Primary Care','Consumers'], solutions:['CGM'], services:['Patient Support','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=dexcom.com&sz=128', website:'https://www.dexcom.com/', about:'Dexcom provides real‑time glucose monitoring to help people with diabetes make informed decisions and reduce complications.' }),
      mk(6,{ name:'Boston Scientific', tagline:'Minimally invasive devices and therapies', industries:['Hospitals','Cath Labs','Surgery'], solutions:['Cardiology','Urology','Implantables'], services:['Clinical Support','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=bostonscientific.com&sz=128', website:'https://www.bostonscientific.com/', about:'Boston Scientific advances minimally invasive devices for cardiovascular and other specialties, enhancing safety and recovery.' }),
      mk(7,{ name:'Omron Healthcare', tagline:'Personal health monitoring and devices', industries:['Consumers','Pharmacies','Clinics'], solutions:['BP Monitors','Wearables'], services:['Customer Support'], logoUrl:'https://www.google.com/s2/favicons?domain=omron-healthcare.com&sz=128', website:'https://www.omron-healthcare.com/', about:'Omron delivers accessible home monitoring devices and connected solutions for proactive wellness and hypertension management.' }),
      mk(8,{ name:'Eko Health', tagline:'AI-powered digital stethoscopes and cardiac screening', industries:['Primary Care','Cardiology','Telehealth'], solutions:['Digital Stethoscope','AI Screening','Remote Monitoring'], services:['Clinical Support','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=ekohealth.com&sz=128', website:'https://www.ekohealth.com/', about:'Eko Health combines FDA-cleared digital stethoscopes with AI algorithms to detect heart disease earlier. Their platform enables clinicians to capture, visualize, and analyze heart sounds and ECG data at the point of care, improving cardiac screening and remote patient monitoring capabilities.' }),
      mk(9,{ name:'BioIntelliSense', tagline:'Continuous multi-parameter remote monitoring', industries:['Hospitals','Home Health','Clinical Trials'], solutions:['Wearable Sensors','Remote Monitoring','Data Analytics'], services:['Clinical Programs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=biointellisense.com&sz=128', website:'https://www.biointellisense.com/', about:'BioIntelliSense provides medical-grade wearable sensors that continuously monitor vital signs including temperature, heart rate, respiratory rate, and activity. Their BioSticker and BioButton devices enable early detection of clinical deterioration in hospital-at-home programs, post-acute care, and clinical research settings.' }),
      mk(10,{ name:'Butterfly Network', tagline:'Handheld whole-body ultrasound imaging', industries:['Primary Care','Emergency Medicine','Global Health'], solutions:['Portable Ultrasound','AI Imaging','Cloud Platform'], services:['Training','Clinical Support'], logoUrl:'https://www.google.com/s2/favicons?domain=butterflynetwork.com&sz=128', website:'https://www.butterflynetwork.com/', about:'Butterfly Network revolutionizes medical imaging with Butterfly iQ, a handheld whole-body ultrasound device powered by semiconductor technology. AI-guided workflows help clinicians capture quality images, while cloud connectivity enables remote collaboration and education, making ultrasound accessible at the point of care worldwide.' }),
      mk(11,{ name:'Sempulse', tagline:'Non-invasive blood pressure monitoring technology', industries:['Cardiology','Primary Care','Remote Monitoring'], solutions:['Continuous BP Monitoring','Wearable Sensors'], services:['Clinical Validation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=sempulse.com&sz=128', website:'https://www.sempulse.com/', about:'Sempulse develops innovative non-invasive blood pressure monitoring solutions using advanced sensor technology. Their continuous monitoring platform provides real-time cardiovascular insights without traditional cuff-based measurements, enabling better hypertension management and early detection of cardiovascular events in both clinical and home settings.' }),
      mk(12,{ name:'Biodesix', tagline:'Diagnostic solutions for lung disease and cancer', industries:['Oncology','Pulmonology','Labs'], solutions:['Lung Cancer Testing','Immune Profiling','Diagnostic Services'], services:['Lab Services','Clinical Support'], logoUrl:'https://www.google.com/s2/favicons?domain=biodesix.com&sz=128', website:'https://www.biodesix.com/', about:'Biodesix provides advanced diagnostic solutions for lung disease, offering blood-based tests that help clinicians make personalized treatment decisions. Their portfolio includes tests for lung cancer diagnosis, treatment selection, and immune response profiling, combining proteomic and genomic technologies to improve patient outcomes and reduce unnecessary procedures.' }),
    ]
  }, [])

  const virtualCare = useMemo(()=>{
    const mk = (i, data) => ({ id:`vc-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Epic Systems', tagline:'EHR platform for large health systems', industries:['Hospitals','Integrated Delivery Networks'], solutions:['EHR','Patient Access','Analytics'], services:['Implementation','Managed Services','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=epic.com&sz=128', website:'https://www.epic.com/', about:'Epic is a leading EHR and analytics platform with deep interoperability and extensibility for large health systems.' }),
      mk(2,{ name:'MEDITECH', tagline:'Cloud EHR across care settings', industries:['Hospitals','Clinics','Home Health'], solutions:['EHR','Interoperability'], services:['Cloud Hosting','Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=meditech.com&sz=128', website:'https://www.meditech.com/', about:'MEDITECH Expanse delivers cloud‑based EHR capabilities for acute, ambulatory, and home care with modern UX.' }),
      mk(3,{ name:'athenahealth', tagline:'Network‑enabled EHR and revenue cycle', industries:['Ambulatory','ASCs','Specialty Clinics'], solutions:['EHR','RCM','Patient Engagement'], services:['Implementation','Revenue Services'], logoUrl:'https://www.google.com/s2/favicons?domain=athenahealth.com&sz=128', website:'https://www.athenahealth.com/', about:'athenahealth offers connected EHR and RCM for ambulatory groups with payer rules engine and benchmark insights.' }),
      mk(4,{ name:'Oracle Health (Cerner)', tagline:'EHR and population health at scale', industries:['Hospitals','Government','International'], solutions:['EHR','Population Health','Interoperability'], services:['Cloud','Consulting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=oracle.com&sz=128', website:'https://www.oracle.com/health/', about:'Oracle Health extends Cerner EHR with cloud services and population health, advancing interoperability and analytics.' }),
      mk(5,{ name:'Teladoc Health', tagline:'Virtual care and chronic condition management', industries:['Payers','Employers','Health Systems'], solutions:['Telehealth','Chronic Care','Programs'], services:['Coaching','Clinical Services'], logoUrl:'https://www.google.com/s2/favicons?domain=teladoc.com&sz=128', website:'https://www.teladoc.com/', about:'Teladoc provides virtual care programs spanning primary care and chronic conditions with integrated devices and coaching.' }),
      mk(6,{ name:'Amwell', tagline:'Hybrid care enablement platform', industries:['Health Systems','Payers'], solutions:['Telehealth','Automation','Care Programs'], services:['Implementation','Operations'], logoUrl:'https://www.google.com/s2/favicons?domain=amwell.com&sz=128', website:'https://business.amwell.com/', about:'Amwell enables virtual and hybrid care with scalable workflows, automation, and integrations for payers and providers.' }),
      mk(7,{ name:'Veradigm (Allscripts)', tagline:'Healthcare technology and analytics', industries:['Ambulatory','Life Sciences'], solutions:['EHR','Analytics','Data Networks'], services:['Cloud','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=veradigm.com&sz=128', website:'https://www.veradigm.com/', about:'Veradigm (formerly Allscripts) provides EHR, analytics, and data networks supporting providers and life sciences.' }),
    ]
  }, [])

  const bioeng = useMemo(()=>{
    const mk = (i, data) => ({ id:`bio-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Intellia Therapeutics', tagline:'In vivo CRISPR gene editing', industries:['Biotech','Rare Disease'], solutions:['Gene Editing','In Vivo Delivery'], services:['R&D','Clinical'], logoUrl:'https://www.google.com/s2/favicons?domain=intelliatx.com&sz=128', website:'https://www.intelliatx.com/', about:'Intellia develops CRISPR therapies for genetic diseases with in vivo delivery platforms and advancing clinical programs.' }),
      mk(2,{ name:'BioNTech', tagline:'mRNA immunotherapies and vaccines', industries:['Biotech','Oncology','Infectious Disease'], solutions:['mRNA','Cell Therapy'], services:['R&D','Manufacturing'], logoUrl:'https://www.google.com/s2/favicons?domain=biontech.de&sz=128', website:'https://biontech.de/', about:'BioNTech pioneers mRNA and cell‑based immunotherapies, expanding oncology and infectious disease pipelines.' }),
      mk(3,{ name:'Owkin', tagline:'AI for precision medicine and biomarker discovery', industries:['AI','Biopharma'], solutions:['Federated Learning','Biomarkers'], services:['Research Collaboration'], logoUrl:'https://www.google.com/s2/favicons?domain=owkin.com&sz=128', website:'https://owkin.com/', about:'Owkin applies federated learning and AI to multi‑omics and pathology data to identify biomarkers and accelerate trials.' }),
      mk(4,{ name:'Recursion', tagline:'Tech‑enabled drug discovery at scale', industries:['AI','Biopharma'], solutions:['Phenomics','ML Platforms'], services:['Partnerships'], logoUrl:'https://www.google.com/s2/favicons?domain=recursion.com&sz=128', website:'https://www.recursion.com/', about:'Recursion combines high‑throughput biology with ML to map cellular phenotypes and discover therapeutic candidates.' }),
      mk(5,{ name:'Insilico Medicine', tagline:'Generative AI for drug discovery', industries:['AI','Biopharma'], solutions:['Target ID','Generative Design'], services:['R&D'], logoUrl:'https://www.google.com/s2/favicons?domain=insilico.com&sz=128', website:'https://insilico.com/', about:'Insilico uses generative AI for target discovery and molecule design, shortening timelines from discovery to preclinical.' }),
      mk(6,{ name:'Anima Biotech', tagline:'mRNA biology for small molecule drugs', industries:['Biotech'], solutions:['mRNA Translation'], services:['R&D'], logoUrl:'https://www.google.com/s2/favicons?domain=animabiotech.com&sz=128', website:'https://www.animabiotech.com/', about:'Anima Biotech targets mRNA translation control to develop small‑molecule therapeutics across multiple diseases.' }),
      mk(7,{ name:'Exscientia', tagline:'Precision AI design for new medicines', industries:['AI','Biopharma'], solutions:['AI Design','Biomarkers'], services:['R&D'], logoUrl:'https://www.google.com/s2/favicons?domain=exscientia.ai&sz=128', website:'https://www.exscientia.ai/', about:'Exscientia integrates AI design, translational research, and patient tissue models to create more precise medicines.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`startup-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Andromeda Surgical', tagline:'AI-powered surgical robotics platform', industries:['Surgery','Robotics'], solutions:['Surgical Robots','AI Vision'], services:['Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=andromedasurgical.com&sz=128', website:'http://www.andromedasurgical.com', about:'Andromeda Surgical develops advanced robotic surgical systems with AI-powered vision and precision control. Platform enables minimally invasive procedures with enhanced dexterity and real-time guidance. Modular design allows customization for different surgical specialties while reducing costs compared to traditional systems.' }),
      mk(2,{ name:'Perceptive', tagline:'AI-driven dental robotics and automation', industries:['Dentistry','Robotics'], solutions:['Dental Robotics','AI Imaging'], services:['Clinical Support','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=perceptive.io&sz=128', website:'https://www.perceptive.io/', about:'Perceptive combines AI imaging with robotic automation to transform dental procedures. System performs 3D scanning, treatment planning, and automated procedures with precision. Reduces procedure time while improving outcomes and patient comfort through minimally invasive techniques powered by computer vision and robotics.' }),
      mk(3,{ name:'Grey Matter Neurosciences', tagline:'Neurotechnology for brain health monitoring', industries:['Neurology','Diagnostics'], solutions:['Brain Monitoring','Wearable Sensors'], services:['Clinical Programs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=greymatterneurosciences.com&sz=128', website:'https://greymatterneurosciences.com/', about:'Grey Matter Neurosciences develops non-invasive neurotechnology for continuous brain health monitoring. Wearable sensors track neurological biomarkers to detect early signs of cognitive decline and neurological conditions. Platform enables proactive intervention and personalized treatment optimization for conditions like dementia, epilepsy, and traumatic brain injury.' }),
      mk(4,{ name:'NovoCuff', tagline:'Smart blood pressure monitoring device', industries:['Cardiology','Remote Monitoring'], solutions:['BP Monitoring','Connected Devices'], services:['Patient Support','Clinical'], logoUrl:'https://www.google.com/s2/favicons?domain=novocuff.com&sz=128', website:'https://www.novocuff.com/', about:'NovoCuff provides advanced blood pressure monitoring with smart cuff technology and continuous tracking capabilities. Device offers clinical-grade accuracy in a portable form factor with automated measurements and trend analysis. Cloud connectivity enables remote patient monitoring and early detection of hypertension-related complications for better cardiovascular care.' }),
      mk(5,{ name:'Altavo', tagline:'Wearable ultrasound for continuous monitoring', industries:['Imaging','Remote Monitoring'], solutions:['Wearable Ultrasound','Continuous Monitoring'], services:['Clinical Support','Research'], logoUrl:'https://www.google.com/s2/favicons?domain=altavo.eu&sz=128', website:'https://www.altavo.eu/', about:'Altavo develops wearable ultrasound patches for continuous organ monitoring without traditional imaging equipment. Flexible sensors provide real-time imaging of internal organs, enabling early detection of fluid buildup, organ function changes, and other critical conditions. Ideal for heart failure monitoring, kidney function assessment, and post-surgical care in both hospital and home settings.' }),
      mk(6,{ name:'Stroke Diagnostics', tagline:'Rapid stroke detection and triage', industries:['Emergency Medicine','Neurology'], solutions:['Stroke Detection','Point-of-Care'], services:['Clinical Support','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=stroke-dx.com&sz=128', website:'https://www.stroke-dx.com/', about:'Stroke Diagnostics provides rapid point-of-care testing for stroke detection and classification. Portable device enables paramedics and emergency physicians to quickly identify stroke type and severity, accelerating treatment decisions. Blood-based biomarker analysis combined with AI algorithms improves triage accuracy and reduces time to appropriate intervention, critical for stroke outcomes.' }),
      mk(7,{ name:'3Aware', tagline:'AI-powered surgical workflow intelligence', industries:['Surgery','AI'], solutions:['Surgical Analytics','Workflow Optimization'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=3aware.ai&sz=128', website:'https://3aware.ai/', about:'3Aware uses computer vision and AI to analyze surgical workflows and improve operating room efficiency. Platform automatically tracks instruments, procedures, and team activities to provide real-time insights and post-operative analytics. Helps hospitals optimize OR utilization, reduce delays, improve safety compliance, and enhance surgical training through objective performance data and workflow recommendations.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-amber-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🏥</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">MedTech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Devices, digital health, and therapeutic innovation</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore smart devices and diagnostics, virtual care systems, and bioengineering platforms.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#devices" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-red-600 text-red-700 hover:bg-red-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 1. Smart Devices & Precision Diagnostics */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-rose-700 font-semibold tracking-wide">Smart Devices & Precision Diagnostics</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="devices" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {devices.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=>{
                if (!currentUser){ router.push('/login?redirect=/discover/medtech'); return }
                setDemoVendor(v); setDemoOpen(true)
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Digital Health Systems & Virtual Care */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-rose-700 font-semibold tracking-wide">Digital Health Systems & Virtual Care</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="virtual" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {virtualCare.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=>{
                if (!currentUser){ router.push('/login?redirect=/discover/medtech'); return }
                setDemoVendor(v); setDemoOpen(true)
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bioengineering & Therapeutic Innovation */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-rose-700 font-semibold tracking-wide">Bioengineering & Therapeutic Innovation</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="bio" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bioeng.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=>{
                if (!currentUser){ router.push('/login?redirect=/discover/medtech'); return }
                setDemoVendor(v); setDemoOpen(true)
              }} />
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
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=>{
                if (!currentUser){ router.push('/login?redirect=/discover/medtech'); return }
                setDemoVendor(v); setDemoOpen(true)
              }} />
            ))}
          </div>
        </div>
      </section>

      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={async (form)=>{
        if (!currentUser || !demoVendor) return
        await createDemoRequest({ userId: currentUser.uid, vendorId: String(demoVendor.id), formData: form, status: 'pending' })
        setDemoOpen(false); setDemoVendor(null)
      }} />
    </div>
  )
}

