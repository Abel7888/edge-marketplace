'use client'


import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useRouter } from 'next/navigation'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  function handleSaveClick(){
    console.log('[VendorCard] Save button clicked for:', v.name, v.id)
    onToggleSave()
  }
  
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-cyan-500 transition-all duration-300 overflow-hidden relative">
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
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.fullDescription || v.about || v.shortDescription}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={handleSaveClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50">
            <Heart size={16} className={saved? 'text-red-500 fill-current' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FinTech(){
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
    console.log('[FinTech toggleSaveVendor] Called with vendor:', vendor.name, vendor.id)
    console.log('[FinTech toggleSaveVendor] currentUser:', currentUser?.uid, currentUser?.email)
    
    if (!currentUser){ 
      console.log('[FinTech toggleSaveVendor] No user, redirecting to login')
      router.push('/login?redirect=/discover/fintech')
      return 
    }
    
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    console.log('[FinTech toggleSaveVendor] Vendor ID:', id, 'Was saved:', wasSaved)
    
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    
    try {
      if (wasSaved) {
        console.log('[FinTech toggleSaveVendor] Removing vendor...')
        await fsRemoveSavedVendor(currentUser.uid, id)
        console.log('[FinTech toggleSaveVendor] Remove complete')
      } else {
        console.log('[FinTech toggleSaveVendor] Saving vendor:', vendor.name, 'id:', id)
        console.log('[FinTech toggleSaveVendor] Vendor data:', vendor)
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'FinTech' })
        console.log('[FinTech toggleSaveVendor] Save complete, navigating to /saved-new')
        console.log('[FinTech toggleSaveVendor] About to call navigate...')
        router.push('/saved-new')
        console.log('[FinTech toggleSaveVendor] Navigate called')
      }
    } catch (err) {
      console.error('[FinTech toggleSaveVendor] Error:', err)
      console.error('[FinTech toggleSaveVendor] Error details:', err.message, err.code)
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
      alert('Save failed: ' + err.message)
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/fintech'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(form){
    if (!currentUser || !demoVendor) return
    await createDemoRequest({ userId: currentUser.uid, vendorId: String(demoVendor.id), formData: form, status: 'pending' })
    setDemoOpen(false)
    setDemoVendor(null)
  }

  const payments = useMemo(()=>{
    const mk = (i, data) => ({ id:`pay-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Stripe', tagline:'Payments infrastructure for the internet', industries:['Ecommerce','SaaS'], solutions:['Payments','Billing','Connect'], services:['APIs','Fraud','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=stripe.com&sz=128', website:'https://stripe.com', fullDescription:'Stripe provides a full stack for accepting payments, managing subscriptions, sending payouts, and reconciling revenue. Developers get clean APIs, robust dashboards, and global coverage with optimized authorization.' }),
      mk(2,{ name:'Wise', tagline:'Fast, low cost international money', industries:['Consumer','SMB'], solutions:['Transfers','Multi-currency'], services:['Cards','Accounts','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=wise.com&sz=128', website:'https://wise.com', fullDescription:'Wise offers transparent, real‑exchange‑rate international transfers and multi‑currency accounts. Businesses and consumers move money across borders with low fees and speed.' }),
      mk(3,{ name:'Remitly', tagline:'Cross‑border remittances at scale', industries:['Consumer'], solutions:['Remittances','Mobile'], services:['Support'], logoUrl:'https://www.google.com/s2/favicons?domain=remitly.com&sz=128', website:'https://www.remitly.com/', fullDescription:'Remitly focuses on secure, low‑cost remittances to emerging markets. Mobile-first experiences, high coverage corridors, and strong compliance build user trust.' }),
      mk(4,{ name:'Revolut', tagline:'Global financial super app', industries:['Consumer'], solutions:['Cards','FX','Crypto'], services:['Banking','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=revolut.com&sz=128', website:'https://www.revolut.com/', fullDescription:'Revolut consolidates cards, international spending, FX, savings, and investing into one app with competitive fees and real‑time controls.' }),
      mk(5,{ name:'Block (Square)', tagline:'Omnichannel commerce and payments', industries:['Retail','SMB'], solutions:['POS','Online','Cash App'], services:['Hardware','Banking'], logoUrl:'https://www.google.com/s2/favicons?domain=block.xyz&sz=128', website:'https://www.block.xyz/', fullDescription:'Block powers in‑person and online payments, POS, and business banking. Square for sellers, Cash App for consumers, and developer tools enable end‑to‑end commerce.' }),
      mk(6,{ name:'Adyen', tagline:'Unified commerce payments for enterprise', industries:['Retail','Travel'], solutions:['Gateway','Risk','POS'], services:['Global Acquiring','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=adyen.com&sz=128', website:'https://www.adyen.com/', fullDescription:'Adyen provides a unified platform for global acquiring, risk, and POS. Enterprises benefit from higher approvals, consolidated data, and omnichannel experiences.' }),
      mk(7,{ name:'Rapyd', tagline:'Global fintech‑as‑a‑service', industries:['Marketplace','Platform'], solutions:['Collect','Disburse','Wallet'], services:['Compliance','FX'], logoUrl:'https://www.google.com/s2/favicons?domain=rapyd.net&sz=128', website:'https://www.rapyd.net/', fullDescription:'Rapyd offers payments, payouts, wallets, and compliance as modular services. Companies localize money movement across 100+ countries via a single integration.' }),
      mk(8,{ name:'Airwallex', tagline:'Global payments and treasury for modern business', industries:['SaaS','Marketplace'], solutions:['Global Accounts','Cards','FX'], services:['Treasury','APIs'], logoUrl:'https://www.google.com/s2/favicons?domain=airwallex.com&sz=128', website:'https://www.airwallex.com/', fullDescription:'Airwallex provides global accounts, cards, and FX to move money faster and cheaper. API‑first platform powers multi‑currency operations and treasury.' }),
    ]
  }, [])

  const lending = useMemo(()=>{
    const mk = (i, data) => ({ id:`lend-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Upstart', tagline:'AI‑powered lending and risk models', industries:['Consumer'], solutions:['Personal Loans','Auto'], services:['AI Models','Verification'], logoUrl:'https://www.google.com/s2/favicons?domain=upstart.com&sz=128', website:'https://www.upstart.com/', fullDescription:'Upstart partners with banks and credit unions to originate AI‑underwritten loans. Models incorporate alternative data to expand access with controlled risk.' }),
      mk(2,{ name:'Zest AI', tagline:'Explainable AI underwriting', industries:['Lenders'], solutions:['Credit Models'], services:['Compliance','ModelOps'], logoUrl:'https://www.google.com/s2/favicons?domain=zest.ai&sz=128', website:'https://www.zest.ai/', fullDescription:'Zest AI builds transparent credit models that increase approvals while maintaining fairness and compliance. Tooling supports deployment and governance.' }),
      mk(3,{ name:'Kabbage (Amex)', tagline:'Funding and tools for small businesses', industries:['SMB'], solutions:['Working Capital','Cards'], services:['Banking','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=kabbage.com&sz=128', website:'https://www.kabbage.com/', fullDescription:'Kabbage from American Express offers lines of credit, cards, and cash‑flow tools to help small businesses manage and grow.' }),
      mk(4,{ name:'Affirm', tagline:'Buy now, pay later for responsible spending', industries:['Ecommerce'], solutions:['BNPL','Pay‑over‑time'], services:['Risk','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=affirm.com&sz=128', website:'https://www.affirm.com/', fullDescription:'Affirm provides transparent BNPL with clear terms and no hidden fees, helping merchants increase conversion and AOV while protecting consumers.' }),
      mk(5,{ name:'Klarna', tagline:'Flexible BNPL and shopping app', industries:['Ecommerce'], solutions:['BNPL','Checkout'], services:['App','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=klarna.com&sz=128', website:'https://www.klarna.com/', fullDescription:'Klarna enables pay‑in‑4 and financing options with a rich shopping app. Merchants get optimized checkout; consumers get flexibility and rewards.' }),
      mk(6,{ name:'LendingClub', tagline:'Marketplace lending and digital bank', industries:['Consumer'], solutions:['Personal Loans','Banking'], services:['Verification','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=lendingclub.com&sz=128', website:'https://www.lendingclub.com/', fullDescription:'LendingClub offers personal loans and digital banking with marketplace efficiency, aiming for lower rates and better customer experience.' }),
      mk(7,{ name:'Tala', tagline:'Credit for emerging markets', industries:['Consumer'], solutions:['Micro‑loans'], services:['Mobile','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tala.co&sz=128', website:'https://tala.co/', fullDescription:'Tala delivers accessible credit via mobile apps in emerging markets, using alternative data for underwriting and rapid disbursement.' }),
      mk(8,{ name:'Funding Circle', tagline:'SMB loans marketplace', industries:['SMB'], solutions:['Term Loans'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=fundingcircle.com&sz=128', website:'https://www.fundingcircle.com/', fullDescription:'Funding Circle connects small businesses with investors for fast, competitively priced loans, supported by digital applications and underwriting.' }),
    ]
  }, [])

  const wealth = useMemo(()=>{
    const mk = (i, data) => ({ id:`wealth-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Betterment', tagline:'Automated investing and cash management', industries:['Consumer'], solutions:['Robo‑advisor','Cash'], services:['Tax‑loss Harvesting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=betterment.com&sz=128', website:'https://www.betterment.com/', fullDescription:'Betterment provides diversified portfolios, automation, and goal‑based planning with low fees. Cash and checking products complement investing needs.' }),
      mk(2,{ name:'Wealthfront', tagline:'Investing, banking, and automation', industries:['Consumer'], solutions:['Automated Investing','Banking'], services:['Tax‑loss Harvesting','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=wealthfront.com&sz=128', website:'https://www.wealthfront.com/', fullDescription:'Wealthfront offers automated portfolios, banking features, and financial planning tools with focus on simplicity and low cost.' }),
      mk(3,{ name:'Robinhood', tagline:'Investing for everyone', industries:['Consumer'], solutions:['Brokerage','Options','Crypto'], services:['Education','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=robinhood.com&sz=128', website:'https://robinhood.com/', fullDescription:'Robinhood provides zero‑commission trading, options, and crypto with intuitive mobile UX and education resources for new investors.' }),
      mk(4,{ name:'Public.com', tagline:'Investing with transparency and social features', industries:['Consumer'], solutions:['Brokerage','Treasuries'], services:['Community','Education'], logoUrl:'https://www.google.com/s2/favicons?domain=public.com&sz=128', website:'https://public.com/', fullDescription:'Public combines investing with community insights, offering stocks, treasuries, and alternative assets with transparent pricing.' }),
      mk(5,{ name:'eToro', tagline:'Social investing and multi‑asset brokerage', industries:['Consumer'], solutions:['Brokerage','Copy Trading'], services:['Community','Education'], logoUrl:'https://www.google.com/s2/favicons?domain=etoro.com&sz=128', website:'https://www.etoro.com/', fullDescription:'eToro enables social copy trading and multi‑asset brokerage across global markets, making investing collaborative and accessible.' }),
      mk(6,{ name:'Altruist', tagline:'Custody and software for RIAs', industries:['Wealth Mgmt'], solutions:['Custody','Portfolio Tools'], services:['Practice Ops','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=altruist.com&sz=128', website:'https://www.altruist.com/', fullDescription:'Altruist offers custody and modern portfolio software for RIAs, simplifying onboarding, trading, and billing with transparent pricing.' }),
      mk(7,{ name:'Apex Fintech Solutions', tagline:'Brokerage infrastructure and clearing', industries:['Platform'], solutions:['Clearing','Custody'], services:['APIs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=apexfintechsolutions.com&sz=128', website:'https://apexfintechsolutions.com/', fullDescription:'Apex provides clearing, custody, and APIs for fintechs to launch brokerage products faster with reliable infrastructure and compliance.' }),
      mk(8,{ name:'Tokeny Solutions', tagline:'Tokenization platform for compliant assets', industries:['Institutions'], solutions:['Tokenization','Compliance'], services:['Onboarding','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tokeny.com&sz=128', website:'https://tokeny.com/', fullDescription:'Tokeny enables compliant tokenization of securities with investor onboarding, identity, and transfer management that meets regulatory requirements.' }),
    ]
  }, [])

  const insurtech = useMemo(()=>{
    const mk = (i, data) => ({ id:`ins-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'Lemonade', tagline:'AI‑native insurance with instant claims', industries:['Consumer'], solutions:['Renters','Home','Pet'], services:['Claims','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=lemonade.com&sz=128', website:'https://www.lemonade.com/', fullDescription:'Lemonade delivers fast digital insurance with AI for underwriting and claims. Transparent policies and a customer‑first experience reduce friction.' }),
      mk(2,{ name:'Root Insurance', tagline:'Usage‑based auto insurance', industries:['Auto'], solutions:['Telematics','Auto'], services:['Mobile','Claims'], logoUrl:'https://www.google.com/s2/favicons?domain=rootcar.com&sz=128', website:'https://www.rootcar.com/', fullDescription:'Root prices auto insurance based on driving behavior captured via telematics, promoting fairness and potentially lower premiums.' }),
      mk(3,{ name:'Next Insurance', tagline:'Simple, digital insurance for small businesses', industries:['SMB'], solutions:['Liability','Workers Comp'], services:['Claims','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=nextinsurance.com&sz=128', website:'https://www.nextinsurance.com/', fullDescription:'Next offers fast quotes and tailored coverage for small businesses, streamlining purchase and claims with a digital‑first approach.' }),
      mk(4,{ name:'Tractable', tagline:'AI computer vision for claims automation', industries:['Insurance'], solutions:['Damage Assessment'], services:['APIs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=tractable.ai&sz=128', website:'https://tractable.ai/', fullDescription:'Tractable uses AI to assess vehicle and property damage from images, accelerating claims decisions and reducing cycle times.' }),
      mk(5,{ name:'Coalition', tagline:'Active cyber insurance and security', industries:['Cyber'], solutions:['Cyber Insurance','Security'], services:['Monitoring','Response'], logoUrl:'https://www.google.com/s2/favicons?domain=coalitioninc.com&sz=128', website:'https://www.coalitioninc.com/', fullDescription:'Coalition combines cyber insurance with active risk monitoring and incident response to reduce frequency and impact of cyber events.' }),
      mk(6,{ name:'ComplyAdvantage', tagline:'AML screening and transaction monitoring', industries:['Banks','Fintech'], solutions:['KYC','AML'], services:['APIs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=complyadvantage.com&sz=128', website:'https://complyadvantage.com/', fullDescription:'ComplyAdvantage provides AML/KYC screening, transaction monitoring, and adverse media tools via APIs to reduce financial crime risk.' }),
      mk(7,{ name:'Chainalysis', tagline:'Blockchain analytics for compliance and investigations', industries:['Crypto','Law'], solutions:['KYT','Investigations'], services:['Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=chainalysis.com&sz=128', website:'https://www.chainalysis.com/', fullDescription:'Chainalysis analyzes blockchain transactions to help exchanges, banks, and governments detect illicit activity and meet compliance.' }),
      mk(8,{ name:'Hummingbird', tagline:'Modern case management for AML teams', industries:['Banks','Fintech'], solutions:['Case Mgmt','SAR'], services:['APIs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=hummingbird.co&sz=128', website:'https://www.hummingbird.co/', fullDescription:'Hummingbird streamlines AML investigations with collaborative case management, automation, and audit trails that improve team efficiency.' }),
    ]
  }, [])

  const startups = useMemo(()=>{
    const mk = (i, data) => ({ id:`startup-${String(i).padStart(3,'0')}`, ...data })
    return [
      mk(1,{ name:'ModernFi', tagline:'Network for banks to share deposits and liquidity', industries:['Banking'], solutions:['Deposit Network','Liquidity'], services:['Platform','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=modernfi.com&sz=128', website:'https://www.modernfi.com/', fullDescription:'ModernFi connects banks to efficiently share deposits and manage liquidity needs. The platform enables institutions to balance their books by moving excess deposits to banks seeking funding. Real-time matching and automated workflows reduce manual coordination. Helps banks optimize capital allocation while maintaining regulatory compliance and building correspondent relationships.' }),
      mk(2,{ name:'Grounded Technologies', tagline:'Embedded banking infrastructure for real estate', industries:['PropTech','Banking'], solutions:['Embedded Finance','Payments'], services:['APIs','Integration'], logoUrl:'https://www.google.com/s2/favicons?domain=grounded.tech&sz=128', website:'https://www.grounded.tech/', fullDescription:'Grounded Technologies provides embedded banking and payment infrastructure tailored for real estate platforms. Enables property management software and marketplaces to offer financial services directly within their applications. Features include rent collection, security deposits, and vendor payments with compliance built in. Streamlines money movement across the real estate ecosystem while improving user experience.' }),
      mk(3,{ name:'OatFi', tagline:'Modern lending infrastructure for community banks', industries:['Banking','Lending'], solutions:['Loan Origination','Core Banking'], services:['Implementation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=oatfi.com&sz=128', website:'https://www.oatfi.com/', fullDescription:'OatFi modernizes lending operations for community banks with cloud-native loan origination and servicing tools. Replaces legacy systems with intuitive interfaces and automated workflows. Supports consumer, commercial, and mortgage lending with configurable products. Helps smaller institutions compete with digital-first lenders while maintaining personalized service and local decision-making.' }),
      mk(4,{ name:'Fuse', tagline:'Unified API for financial account aggregation', industries:['Fintech','Data'], solutions:['Account Aggregation','APIs'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=joinfuse.com&sz=128', website:'https://www.joinfuse.com/', fullDescription:'Fuse provides a single API to connect with thousands of financial institutions for account aggregation and data access. Powers personal finance apps, lending platforms, and wealth management tools with reliable connectivity. Handles authentication, data normalization, and ongoing maintenance of integrations. Reduces development time and improves data quality for fintech applications requiring bank connectivity.' }),
      mk(5,{ name:'Column Tax', tagline:'Modern tax preparation software for professionals', industries:['Tax','Accounting'], solutions:['Tax Prep','Workflow'], services:['Training','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=columntax.com&sz=128', website:'https://www.columntax.com/', fullDescription:'Column Tax reimagines professional tax software with modern design and collaborative workflows. Built for CPAs and tax preparers who want efficiency without sacrificing power. Features include real-time collaboration with clients, automated data import, and intelligent error checking. Cloud-based platform enables remote work and seamless team coordination during busy tax seasons.' }),
      mk(6,{ name:'April', tagline:'AI-powered tax filing and planning assistant', industries:['Tax','Consumer'], solutions:['Tax Filing','AI Assistant'], services:['Support','Education'], logoUrl:'https://www.google.com/s2/favicons?domain=getapril.com&sz=128', website:'https://www.getapril.com/', fullDescription:'April uses AI to simplify tax filing and year-round tax planning for individuals. Conversational interface guides users through complex tax situations with personalized advice. Automatically identifies deductions and credits based on user circumstances. Combines DIY convenience with expert review options for peace of mind and maximum refunds.' }),
      mk(7,{ name:'Savvy Wealth', tagline:'Tech-enabled financial planning for professionals', industries:['Wealth Mgmt'], solutions:['Financial Planning','Advisory'], services:['Planning','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=savvywealth.com&sz=128', website:'https://www.savvywealth.com/', fullDescription:'Savvy Wealth delivers comprehensive financial planning with technology and human advisors. Targets high-earning professionals seeking holistic wealth management beyond just investing. Services include retirement planning, tax optimization, estate planning, and insurance review. Combines digital tools for tracking with personalized advisor relationships for complex decisions.' }),
      mk(8,{ name:'Retirable', tagline:'Retirement planning and income optimization', industries:['Wealth Mgmt','Retirement'], solutions:['Retirement Planning','Income'], services:['Advisors','Tools'], logoUrl:'https://www.google.com/s2/favicons?domain=retirable.com&sz=128', website:'https://www.retirable.com/', fullDescription:'Retirable helps individuals plan and optimize retirement income across all their accounts and income sources. Platform analyzes Social Security timing, pension options, withdrawal strategies, and tax implications. Provides personalized recommendations to maximize retirement income while minimizing taxes. Combines planning software with access to financial advisors for implementation support.' }),
      mk(9,{ name:'Unlimited Funds', tagline:'Automated investing with unlimited rebalancing', industries:['Wealth Mgmt'], solutions:['Robo-advisor','Tax Optimization'], services:['Automation','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=unlimitedfunds.com&sz=128', website:'https://www.unlimitedfunds.com/', fullDescription:'Unlimited Funds offers automated portfolio management with unlimited rebalancing and tax-loss harvesting. Continuously optimizes portfolios to maintain target allocations and harvest losses for tax benefits. Low-cost index fund approach with sophisticated tax optimization typically reserved for high-net-worth investors. Transparent pricing and no minimum balance requirements make advanced strategies accessible.' }),
      mk(10,{ name:'Moment', tagline:'Web3 wealth management and crypto advisory', industries:['Crypto','Wealth Mgmt'], solutions:['Crypto Advisory','Portfolio'], services:['Planning','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=moment.xyz&sz=128', website:'https://www.moment.xyz/', fullDescription:'Moment provides wealth management services for crypto-native individuals and families. Advisors understand both traditional finance and digital assets to create holistic plans. Services include crypto tax planning, DeFi strategy, NFT valuation, and estate planning for digital assets. Bridges the gap between traditional wealth management and the emerging crypto economy.' }),
      mk(11,{ name:'Mercantile', tagline:'Embedded lending for B2B marketplaces', industries:['Lending','B2B'], solutions:['Trade Credit','Financing'], services:['APIs','Risk'], logoUrl:'https://www.google.com/s2/favicons?domain=getmercantile.com&sz=128', website:'https://www.getmercantile.com/', fullDescription:'Mercantile enables B2B marketplaces and platforms to offer embedded financing to their buyers and sellers. Provides trade credit, invoice financing, and working capital within existing workflows. API-first approach integrates financing seamlessly into purchase flows. Handles underwriting, servicing, and collections while marketplace maintains customer relationship and earns revenue share.' }),
      mk(12,{ name:'Wingspan', tagline:'Financial operating system for freelancers', industries:['Freelance','SMB'], solutions:['Invoicing','Banking','Tax'], services:['Support','Tools'], logoUrl:'https://www.google.com/s2/favicons?domain=wingspan.app&sz=128', website:'https://www.wingspan.app/', fullDescription:'Wingspan provides an all-in-one financial platform for independent contractors and freelancers. Features include invoicing, expense tracking, banking, tax withholding, and 1099 management. Automates administrative tasks so freelancers can focus on their work. Integrated approach eliminates need for multiple tools and simplifies financial management for the self-employed.' }),
      mk(13,{ name:'Authentic Insurance', tagline:'Modern insurance for small businesses', industries:['InsurTech','SMB'], solutions:['Business Insurance','Workers Comp'], services:['Claims','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=getauthentic.com&sz=128', website:'https://www.getauthentic.com/', fullDescription:'Authentic Insurance delivers fast, digital insurance solutions tailored for small businesses. Instant quotes and online purchase for general liability, workers compensation, and commercial property. Modern claims process with mobile-first experience and transparent communication. Pricing and coverage designed specifically for the needs and budgets of small business owners.' }),
      mk(14,{ name:'Gryps', tagline:'Alternative data for credit underwriting', industries:['Data','Lending'], solutions:['Credit Data','APIs'], services:['Integration','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=gryps.io&sz=128', website:'https://www.gryps.io/', fullDescription:'Gryps provides alternative data sources to enhance credit underwriting and risk assessment. Aggregates non-traditional data signals including utility payments, rental history, and employment verification. Helps lenders expand access to credit for thin-file borrowers while maintaining risk controls. API-based delivery integrates seamlessly into existing underwriting workflows and decision engines.' }),
      mk(15,{ name:'Spade', tagline:'Enriched transaction data for fintech apps', industries:['Data','Fintech'], solutions:['Transaction Enrichment','Merchant Data'], services:['APIs','Support'], logoUrl:'https://www.google.com/s2/favicons?domain=spade.com&sz=128', website:'https://www.spade.com/', fullDescription:'Spade enriches raw transaction data with merchant details, categories, and metadata for fintech applications. Cleans and standardizes messy bank transaction descriptions into structured, actionable data. Powers features like spending insights, rewards programs, and expense categorization. Real-time API delivers enriched data to improve user experiences in banking and financial management apps.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">💰</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">FinTech</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Payments, lending, wealth, and compliance</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Explore digital payments, credit technologies, wealth platforms, and InsurTech/RegTech solutions.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#pay" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>

      {/* 💸 Digital Payments & Money Transfers */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Digital Payments & Money Transfers</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="pay" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {payments.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 🏦 Lending & Credit Tech */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">Lending & Credit Tech</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="lend" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {lending.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 📈 WealthTech & Investment Platforms */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">WealthTech & Investment Platforms</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="wealth" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wealth.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ InsurTech & RegTech */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-emerald-700 font-semibold tracking-wide">InsurTech & RegTech</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="ins" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {insurtech.map(v => (
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

