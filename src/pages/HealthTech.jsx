import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
 

function VendorCard({ v, saved, onToggleSave }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-teal-500/20 to-indigo-500/20">
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
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{x}</span>)}
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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 border-2 border-teal-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button className="h-12 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HealthTech(){
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
    if (!currentUser){ navigate('/login?redirect=/discover/healthtech'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'HealthTech' })
        navigate('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }
  const connectedCare = useMemo(()=>{
    const mk = (i, data) => ({ id:`cc-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'TytoCare', tagline:'Connected exam kit for virtual visits', industries:['Virtual Care','Home Care'], solutions:['Remote Exam','Telehealth'], services:['Programs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tytocare.com&sz=128', website:'https://www.tytocare.com/' , about:'TytoCare enables clinical-grade remote physical exams integrated with virtual visits for primary and urgent care.' }),
      mk(2,{ name:'Datos Health', tagline:'RPM and care orchestration platform', industries:['Providers','Chronic Care'], solutions:['RPM','Care Pathways'], services:['Implementation','Monitoring'], logoUrl:'https://www.google.com/s2/favicons?domain=datos-health.com&sz=128', website:'https://www.datos-health.com/' , about:'Datos Health powers remote patient monitoring and virtual care workflows across chronic conditions and perioperative care.' }),
      mk(3,{ name:'Accuhealth', tagline:'Turnkey RPM for clinics and health systems', industries:['Clinics','Health Systems'], solutions:['RPM','CCM','RTM'], services:['Monitoring','Billing'], logoUrl:'https://www.google.com/s2/favicons?domain=accuhealth.tech&sz=128', website:'https://accuhealth.tech/' , about:'Accuhealth offers fully managed remote monitoring programs with devices, clinical staff, and billing support.' }),
      mk(4,{ name:'HelloCare', tagline:'Virtual care and care-at-home services', industries:['Virtual Care','Home Care'], solutions:['Telehealth','Care Coordination'], services:['Clinical Services'], logoUrl:'https://www.google.com/s2/favicons?domain=hellocare.com&sz=128', website:'https://hellocare.com/' , about:'HelloCare supports care-at-home and virtual visits with coordinated services and technology enablement.' }),
      mk(5,{ name:'Maven Clinic', tagline:'Women’s and family health platform', industries:['Employers','Payers'], solutions:['Virtual Clinic','Care Navigation'], services:['Programs','Coaching'], logoUrl:'https://www.google.com/s2/favicons?domain=mavenclinic.com&sz=128', website:'https://www.mavenclinic.com/' , about:'Maven Clinic provides comprehensive women’s and family health programs with virtual specialists and navigation.' }),
      mk(6,{ name:'Cadence', tagline:'Remote patient care for chronic conditions', industries:['Health Systems','Cardiology'], solutions:['RPM','Clinical Programs'], services:['Care Teams','Implementation'], logoUrl:'https://www.google.com/s2/favicons?domain=cadence.care&sz=128', website:'https://www.cadence.care/' , about:'Cadence partners with health systems to deliver remote care programs for cardiometabolic and other chronic diseases.' }),
      mk(7,{ name:'Kivo Health', tagline:'Personalized care navigation and access', industries:['Consumers','Employers'], solutions:['Care Navigation','Virtual Care'], services:['Concierge','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=kivohealth.com&sz=128', website:'https://www.kivohealth.com/' , about:'Kivo Health guides patients to the right care with personalized navigation and virtual access tools.' }),
    ]
  }, [])

  const dataInfra = useMemo(()=>{
    const mk = (i, data) => ({ id:`di-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'b.well Connected Health', tagline:'Consumer health data and engagement', industries:['Health Systems','Payers'], solutions:['Health Record','Identity','Engagement'], services:['Integration','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=icanbwell.com&sz=128', website:'https://www.icanbwell.com/' , about:'b.well unifies consumer data and services into a single digital front door for health systems and plans.' }),
      mk(2,{ name:'Navina', tagline:'AI patient portraits for primary care', industries:['Primary Care','Value-Based Care'], solutions:['Data Intelligence','Risk Strat'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=navina.ai&sz=128', website:'https://www.navina.ai/' , about:'Navina builds AI patient summaries to help clinicians act on risk and gaps within workflows.' }),
      mk(3,{ name:'Corti', tagline:'AI guidance for clinical calls and triage', industries:['EMS','Call Centers','Primary Care'], solutions:['AI Scribe','Triage Guidance'], services:['QA','Training'], logoUrl:'https://www.google.com/s2/favicons?domain=corti.ai&sz=128', website:'https://www.corti.ai/' , about:'Corti provides real-time AI assistance and QA for emergency and clinical call centers and primary care.' }),
      mk(4,{ name:'Hippocratic AI', tagline:'Safety-focused generative AI agents', industries:['Providers','Payers'], solutions:['Clinical Agents','Ops Agents'], services:['Programs','Governance'], logoUrl:'https://www.google.com/s2/favicons?domain=hippocraticai.com&sz=128', website:'https://www.hippocraticai.com/' , about:'Hippocratic AI develops safe, voice-enabled agents to support clinical and administrative healthcare tasks.' }),
      mk(5,{ name:'Notable Health', tagline:'Automation platform for health systems', industries:['Health Systems'], solutions:['Intake','Rev Cycle','Back-Office'], services:['Implementation','Managed Ops'], logoUrl:'https://www.google.com/s2/favicons?domain=notablehealth.com&sz=128', website:'https://www.notablehealth.com/' , about:'Notable automates administrative workflows using AI and RPA to improve efficiency and patient experience.' }),
      mk(6,{ name:'Superpower', tagline:'AI agents for healthcare operations', industries:['Health Systems','Payers'], solutions:['Agent Platform','Workflows'], services:['Implementation'], logoUrl:'https://www.google.com/s2/favicons?domain=superpower.com&sz=128', website:'https://www.superpower.com/' , about:'Superpower builds AI agents to streamline healthcare operations and data tasks with safe orchestration.' }),
    ]
  }, [])

  const wellness = useMemo(()=>{
    const mk = (i, data) => ({ id:`pw-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Function', tagline:'Comprehensive lab-driven wellness', industries:['Consumers','Employers'], solutions:['Lab Panels','Action Plans'], services:['Coaching','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=functionhealth.com&sz=128', website:'https://www.functionhealth.com/' , about:'Function offers longitudinal lab testing and personalized plans to optimize health and prevent disease.' }),
      mk(2,{ name:'LifeNome', tagline:'Genomics-driven personalized wellness', industries:['Consumers','Employers'], solutions:['DNA Insights','Personalization'], services:['Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=lifenome.com&sz=128', website:'https://www.lifenome.com/' , about:'LifeNome uses genetics and AI to personalize wellness, nutrition, and preventive health programs.' }),
      mk(3,{ name:'Bionic Health', tagline:'AI-powered longevity and performance', industries:['Consumers'], solutions:['Diagnostics','AI Coaching'], services:['Programs','Telehealth'], logoUrl:'https://www.google.com/s2/favicons?domain=bionichealth.com&sz=128', website:'https://www.bionichealth.com/' , about:'Bionic Health combines diagnostics, continuous data, and AI coaching to extend healthspan and performance.' }),
      mk(4,{ name:'Chronomics', tagline:'Biomarker testing for personalized health', industries:['Consumers','Employers'], solutions:['Epigenetics','Biomarkers'], services:['Testing','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=chronomics.com&sz=128', website:'https://chronomics.com/' , about:'Chronomics provides biomarker and epigenetic testing with actionable insights for preventive health.' }),
      mk(5,{ name:'Lumen', tagline:'Metabolic health via breath analysis', industries:['Consumers','Fitness'], solutions:['Metabolic Measurement'], services:['Coaching','Programs'], logoUrl:'https://www.google.com/s2/favicons?domain=lumen.me&sz=128', website:'https://www.lumen.me/' , about:'Lumen measures metabolic fuel usage via breath to personalize nutrition and improve metabolic health.' }),
      mk(6,{ name:'Sprinter Health', tagline:'On-demand at-home lab draws and vitals', industries:['Consumers','Plans','Providers'], solutions:['At-Home Labs','Vitals'], services:['Clinical Visits'], logoUrl:'https://www.google.com/s2/favicons?domain=sprinterhealth.com&sz=128', website:'https://www.sprinterhealth.com/' , about:'Sprinter Health sends clinicians to the home for lab draws and vitals collection integrated with partners.' }),
    ]
  }, [])

  const operations = useMemo(()=>{
    const mk = (i, data) => ({ id:`ops-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'ShiftMed', tagline:'On-demand healthcare workforce', industries:['Providers','Post-Acute'], solutions:['Staffing Marketplace','Scheduling'], services:['Credentialing','Payroll'], logoUrl:'https://www.google.com/s2/favicons?domain=shiftmed.com&sz=128', website:'https://www.shiftmed.com/' , about:'ShiftMed connects providers with credentialed nurses and aides for flexible staffing and improved coverage.' }),
      mk(2,{ name:'AMN Healthcare', tagline:'Total talent solutions for healthcare', industries:['Hospitals','Clinics'], solutions:['Travel Nursing','Allied','Physician'], services:['Recruiting','Workforce Solutions'], logoUrl:'https://www.google.com/s2/favicons?domain=amnhealthcare.com&sz=128', website:'https://www.amnhealthcare.com/' , about:'AMN delivers end-to-end workforce solutions including travel clinicians, interim leadership, and vendor management.' }),
      mk(3,{ name:'INNOVA People', tagline:'Healthcare and tech staffing', industries:['Hospitals','Life Sciences'], solutions:['Permanent','Contract'], services:['Recruiting'], logoUrl:'https://www.google.com/s2/favicons?domain=innovapeople.com&sz=128', website:'https://www.innovapeople.com/' , about:'INNOVA People provides recruiting services across healthcare roles and emerging tech disciplines.' }),
      mk(4,{ name:'Health Recovery Solutions (HRS)', tagline:'Telehealth and RPM for care at home', industries:['Home Health','Hospitals'], solutions:['Telehealth','RPM'], services:['Implementation','Monitoring'], logoUrl:'https://www.google.com/s2/favicons?domain=healthrecoverysolutions.com&sz=128', website:'https://www.healthrecoverysolutions.com/' , about:'HRS supports care-at-home programs with devices, software, and clinical services to reduce readmissions.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`startup-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Cera', tagline:'Tech-enabled home care and clinical services', industries:['Home Care','Providers'], solutions:['Care Platform','Workforce'], services:['Clinical Services','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=cera.care&sz=128', website:'https://www.cera.care', about:'Cera delivers technology-enabled home care services with an integrated platform for care coordination, workforce management, and clinical delivery. Combines digital tools with trained caregivers to provide personalized support for elderly and vulnerable populations. Real-time monitoring and family connectivity improve care quality while optimizing caregiver scheduling and reducing operational costs for sustainable home-based care at scale.' }),
      mk(2,{ name:'XpertDox', tagline:'AI-powered medical documentation and coding', industries:['Providers','Revenue Cycle'], solutions:['Clinical Documentation','AI Coding'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=xpertdox.com&sz=128', website:'https://www.xpertdox.com', about:'XpertDox uses AI to automate clinical documentation and medical coding from physician notes and patient encounters. Natural language processing extracts key clinical information and suggests appropriate codes to improve accuracy and reduce administrative burden. Helps providers capture complete documentation for better reimbursement while allowing clinicians to focus more time on patient care rather than paperwork and coding tasks.' }),
      mk(3,{ name:'Tempus', tagline:'Precision medicine through data and AI', industries:['Oncology','Providers'], solutions:['Genomic Testing','Clinical Data'], services:['Testing','Analytics'], logoUrl:'https://www.google.com/s2/favicons?domain=tempus.com&sz=128', website:'https://www.tempus.com', about:'Tempus builds a library of clinical and molecular data to personalize cancer care and advance precision medicine. Combines genomic sequencing with clinical outcomes data to help oncologists select optimal treatments. AI-powered platform analyzes patient data against vast database to identify relevant clinical trials and therapeutic options. Expanding beyond oncology into cardiology, psychiatry, and other specialties with data-driven insights.' }),
      mk(4,{ name:'Augmedix', tagline:'AI medical documentation and ambient scribing', industries:['Providers','Clinics'], solutions:['Ambient Scribe','Documentation'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=augmedix.com&sz=128', website:'https://www.augmedix.com', about:'Augmedix provides ambient AI documentation that converts natural patient-clinician conversations into structured medical notes. Combines speech recognition with human oversight to generate accurate clinical documentation in real-time. Reduces physician documentation burden and improves patient engagement by allowing clinicians to focus on the patient rather than the computer. Integrates directly into EHR workflows for seamless note creation and coding.' }),
      mk(5,{ name:'Verantos', tagline:'Real-world evidence and regulatory-grade analytics', industries:['Pharma','Payers','Regulators'], solutions:['RWE Platform','Analytics'], services:['Research','Consulting'], logoUrl:'https://www.google.com/s2/favicons?domain=verantos.com&sz=128', website:'https://www.verantos.com', about:'Verantos generates regulatory-grade real-world evidence from healthcare data to support drug development and market access decisions. Platform applies causal inference methods to observational data to evaluate treatment effectiveness and safety. Helps pharmaceutical companies, payers, and regulators make evidence-based decisions about therapies. Accelerates evidence generation compared to traditional clinical trials while maintaining scientific rigor and regulatory acceptance.' }),
      mk(6,{ name:'Sword Health', tagline:'Digital musculoskeletal therapy platform', industries:['Employers','Payers','Providers'], solutions:['Digital PT','Pain Management'], services:['Clinical Programs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=swordhealth.com&sz=128', website:'https://swordhealth.com', about:'Sword Health delivers digital physical therapy for musculoskeletal conditions through AI-powered exercise programs and remote therapist support. Motion-tracking technology provides real-time feedback on exercise form and progress. Reduces need for in-person PT visits while achieving clinical outcomes comparable to traditional therapy. Helps employers and health plans reduce MSK-related costs and improve employee productivity through accessible, effective pain management.' }),
      mk(7,{ name:'K Health', tagline:'AI-powered primary care and urgent care', industries:['Consumers','Employers'], solutions:['Virtual Primary Care','Symptom Checker'], services:['Clinical Services','Prescriptions'], logoUrl:'https://www.google.com/s2/favicons?domain=khealth.com&sz=128', website:'https://www.khealth.com', about:'K Health provides affordable primary and urgent care through AI-driven symptom assessment and virtual physician consultations. AI analyzes millions of clinical cases to provide personalized health insights and triage recommendations. Patients can chat with board-certified physicians for diagnosis, treatment, and prescriptions at transparent pricing. Combines AI efficiency with human clinical expertise to make quality healthcare accessible and affordable for everyone.' }),
      mk(8,{ name:'PathAI', tagline:'AI-powered pathology and diagnostics', industries:['Pathology','Pharma','Labs'], solutions:['AI Pathology','Diagnostics'], services:['Research','Clinical'], logoUrl:'https://www.google.com/s2/favicons?domain=pathai.com&sz=128', website:'https://www.pathai.com', about:'PathAI develops AI-powered technology to improve accuracy and efficiency of pathology diagnosis and research. Machine learning models analyze tissue samples to detect cancer and other diseases with high precision. Assists pathologists in making faster, more consistent diagnoses while reducing errors. Supports pharmaceutical companies in clinical trials with AI-driven biomarker analysis and patient stratification for more efficient drug development.' }),
      mk(9,{ name:'RapidAI', tagline:'AI platform for time-critical medical decisions', industries:['Hospitals','Emergency Medicine'], solutions:['Stroke AI','Vascular AI','Pulmonary AI'], services:['Implementation','Clinical Support'], logoUrl:'https://www.google.com/s2/favicons?domain=rapidai.com&sz=128', website:'https://www.rapidai.com', about:'RapidAI provides AI-powered imaging analysis for time-sensitive conditions like stroke, pulmonary embolism, and aneurysms. Platform rapidly analyzes CT and other scans to identify critical findings and alert care teams instantly. Reduces time to treatment for stroke patients through automated detection and triage workflows. Helps hospitals improve outcomes in emergency situations where every minute matters by accelerating diagnosis and care coordination across specialties.' }),
      mk(10,{ name:'CodaMetrix', tagline:'AI-powered autonomous medical coding', industries:['Hospitals','Revenue Cycle'], solutions:['Autonomous Coding','CDI'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=codametrix.com&sz=128', website:'https://www.codametrix.com', about:'CodaMetrix automates medical coding using AI that reads clinical documentation and assigns accurate diagnosis and procedure codes. Platform learns from coder feedback to continuously improve accuracy and handle complex cases. Reduces coding backlogs and accelerates revenue cycle while improving code quality and compliance. Helps hospitals optimize reimbursement and reduce denials through more complete and accurate coding with less manual effort and faster turnaround times.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-indigo-50 to-sky-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">💊</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-4">HealthTech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Virtual health, data intelligence, wellness, and operations</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore connected care platforms, health data infrastructure, personalized wellness, and workforce innovation.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#connected" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-indigo-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 1. Connected Care & Virtual Health */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-teal-700 font-semibold tracking-wide">Connected Care & Virtual Health</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="connected" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {connectedCare.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Health Data Intelligence & Infrastructure */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-teal-700 font-semibold tracking-wide">Health Data Intelligence & Infrastructure</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="datainfra" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dataInfra.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Personalized Wellness & Preventive Platforms */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-teal-700 font-semibold tracking-wide">Personalized Wellness & Preventive Platforms</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="wellness" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wellness.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Healthcare Operations & Workforce Innovation */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-teal-700 font-semibold tracking-wide">Healthcare Operations & Workforce Innovation</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="operations" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {operations.map(v => (
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
