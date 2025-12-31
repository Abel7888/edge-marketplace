// Premium mock data generator for 270 vendors (15 per category x 18 categories)
// Deterministic RNG for stable outputs across reloads
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const industryCategories = ['PropTech','FinTech','ConTech','MedTech','HealthTech']
const softwareCategories = ['AI','Machine Learning','IoT','Blockchain/Web3','AR/VR','Digital Twin','Edge Computing']
const hardwareCategories = ['Semiconductors','Robotics','Drones','3D Printing','Advanced Materials','Quantum Computing']

const ALL_CATEGORIES = [
  ...industryCategories.map((c) => ({ name: c, subcategory: 'Industry' })),
  ...softwareCategories.map((c) => ({ name: c, subcategory: 'Software' })),
  ...hardwareCategories.map((c) => ({ name: c, subcategory: 'Hardware' })),
] // 18 total

const teamSizes = ['11-50','51-200','201-500','500+']
const fundingStages = ['Bootstrapped', '$2M Seed', '$6M Seed', '$15M Series A', '$40M Series B', null]
const pricingModels = ['Subscription', 'Usage-based', 'One-time', 'Custom']
const responseTimes = ['< 2 hours', '< 24 hours', '1-2 days']
const brandPalette = ['#2563EB','#4F46E5','#7C3AED','#DB2777','#059669','#0EA5E9','#F59E0B']
const emojis = ['🏢','🚀','🏗️','🏥','🏦','🤖','🧠','🛰️','🧪','📈','⚙️','🛡️']
const tagsPool = ['enterprise-ready','no-code','AI-powered','real-time','scalable','secure','composable','multi-tenant','low-latency','batch & streaming']
const integrationsPool = ['Salesforce','Microsoft Teams','Slack','AWS','Azure','GCP','HubSpot','Snowflake']
const industriesPool = ['construction','real-estate','healthcare','finance','retail','manufacturing','logistics','energy']
const useCasesPool = ['predictive maintenance','energy optimization','tenant experience','document automation','fraud detection','demand forecasting','quality inspection','chat assistance']
const certsPool = ['SOC 2','ISO 27001','GDPR Compliant','HIPAA','PCI DSS']

function pickN(rand, arr, n) {
  const copy = [...arr]
  const out = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

function sentenceCase(str) { return str.charAt(0).toUpperCase() + str.slice(1) }

function companyName(rand, cat) {
  const prefixes = ['Nova','Quantum','Vertex','Apex','Hyper','Atlas','Vector','Nimbus','Strata','Fusion','Vanta','Lumina','Cirrus','Helix','Orion']
  const suffixes = ['Labs','Systems','Dynamics','Works','AI','Analytics','Automations','Cloud','Networks','Robotics','Solutions','Technologies']
  const mid = cat.replace(/[^A-Za-z]/g,'')
  return `${prefixes[Math.floor(rand()*prefixes.length)]}${mid} ${suffixes[Math.floor(rand()*suffixes.length)]}`
}

function benefitTagline(rand, cat) {
  const verbs = ['Cut','Increase','Automate','Accelerate','Transform','Predict','Secure','Optimize']
  const outcomes = ['costs by 40%','deployment 10x','time-to-value by 70%','MTTR by 55%','accuracy to 99.9%','revenue by 18%']
  const targets = ['with intelligent','using real-time','via no-code','through predictive','with secure','using scalable']
  const tech = ['AI','automation','insights','orchestration','analytics','workflows']
  return `${verbs[Math.floor(rand()*verbs.length)]} ${outcomes[Math.floor(rand()*outcomes.length)]} ${targets[Math.floor(rand()*targets.length)]} ${tech[Math.floor(rand()*tech.length)]}`
}

function resultMetrics(rand) {
  const m1 = `${10 + Math.floor(rand()*50)}% cost reduction`
  const m2 = `${2 + Math.floor(rand()*15)}x faster deployment`
  const m3 = `${99 + Math.floor(rand()*2)}.${Math.floor(rand()*9)}% uptime SLA`
  return { metric1: m1, metric2: m2, metric3: m3 }
}

function primaryCTA(rand) {
  const texts = ['See Live Demo','Start Free Trial','Get Custom Quote','Book Consultation']
  const urg = [null,'Limited slots this month','3 demos left today']
  return { text: texts[Math.floor(rand()*texts.length)], urgency: urg[Math.floor(rand()*urg.length)] }
}

function secondaryCTA(rand) {
  const texts = ['Download Case Study','Watch 2-Min Video','View Pricing','Compare Solutions']
  return { text: texts[Math.floor(rand()*texts.length)] }
}

function testimonial(rand) {
  const names = ['Sarah Chen','Michael Rodriguez','Emily Thompson','David Park','Lisa Martinez','James Wilson','Ava Patel','Noah Kim','Olivia Brooks','Ethan Rivera']
  const titles = ['VP Operations','CTO','Head of Engineering','Director of Product','CIO','COO','Chief Data Officer']
  const companies = ['MetroPlex','QuantumBank','RetailPro Global','HealthTech Systems','AeroLogix','BluePeak Capital']
  const name = names[Math.floor(rand()*names.length)]
  const title = titles[Math.floor(rand()*titles.length)]
  const comp = companies[Math.floor(rand()*companies.length)]
  const quotes = [
    'Paid for itself in under 4 months with measurable savings.',
    'Deployment took days, not months—our team was stunned.',
    'We saw a 3x productivity lift within the first quarter.',
    'Security and performance exceeded our enterprise standards.',
  ]
  return {
    testimonial: quotes[Math.floor(rand()*quotes.length)],
    testimonialAuthor: `${name}, ${title} at ${comp}`,
  }
}

function richDescription(name, cat, rand) {
  const pain = 'disconnected systems, manual workflows, and rising operational costs that slow growth.'
  const approach = 'a unified, API-first platform with embedded AI that automates the most error-prone processes, surfaces predictive insights, and integrates seamlessly with your existing stack.'
  const benefits = 'teams ship 10x faster, cut costs by 30–50%, and make decisions with 99% confidence using real-time telemetry.'
  const target = 'mid-market to enterprise organizations in regulated industries that need secure, scalable solutions without expanding headcount.'
  const proof = 'Trusted by 500+ customers across 20 countries with SOC 2 and ISO 27001 compliance and 99.95% uptime.'
  const nums = resultMetrics(rand)
  return (
    `${name} helps ${cat.toLowerCase()} leaders eliminate ${pain} ` +
    `It delivers ${approach} With ${benefits} ` +
    `Designed for ${target} ${proof} Key outcomes include ${nums.metric1}, ${nums.metric2}, and ${nums.metric3}.`
  )
}

export function generateVendors(seed = 42) {
  const rand = mulberry32(seed)
  const vendors = []
  let idCounter = 1

  for (const { name: category, subcategory } of ALL_CATEGORIES) {
    for (let i = 0; i < 15; i++) {
      const brandColor = brandPalette[Math.floor(rand()*brandPalette.length)]
      const name = companyName(rand, category)
      const tagline = benefitTagline(rand, category)
      const { metric1, metric2, metric3 } = resultMetrics(rand)
      const pCTA = primaryCTA(rand)
      const sCTA = secondaryCTA(rand)
      const { testimonial: tQuote, testimonialAuthor } = testimonial(rand)
      const foundedYear = 2018 + Math.floor(rand()*7) // 2018-2024
      const teamSize = teamSizes[Math.floor(rand()*teamSizes.length)]
      const funding = fundingStages[Math.floor(rand()*fundingStages.length)]
      const logos = pickN(rand, ['Acme Corp','Globex','Initech','Umbrella','Stark Industries','Wayne Enterprises','Wonka Labs','Tyrell Corp','Cyberdyne','Hooli'], 3)
      const isVerified = rand() < 0.4
      const isFeatured = rand() < 0.2
      const certifications = rand() < 0.5 ? pickN(rand, certsPool, 2 + Math.floor(rand()*2)) : []
      const hasVideo = rand() < 0.3
      const hasPdf = rand() < 0.5
      const shortDescription = `Benefit-focused platform for ${category.toLowerCase()} that drives measurable ROI—`+
        `cutting costs, accelerating deployments, and improving reliability across critical workflows.`
      const fullDescription = richDescription(name, category, rand)

      const totalCustomers = 50 + Math.floor(rand()*4950)
      const metrics = {
        viewCount: 500 + Math.floor(rand()*7500),
        demoRequests: 30 + Math.floor(rand()*370),
        quoteRequests: 20 + Math.floor(rand()*230),
        avgResponseTime: responseTimes[Math.floor(rand()*responseTimes.length)],
        satisfactionScore: +(4.2 + rand()*0.7).toFixed(1),
      }

      const vendor = {
        id: `v_${idCounter++}`,
        name,
        tagline,
        category,
        subcategory,
        shortDescription,
        fullDescription,
        primaryCTA: pCTA,
        secondaryCTA: sCTA,
        logoEmoji: emojis[Math.floor(rand()*emojis.length)],
        brandColor,
        isVerified,
        isFeatured,
        certifications,
        foundedYear,
        teamSize,
        funding,
        customers: {
          totalCount: totalCustomers,
          logos,
          testimonial: tQuote,
          testimonialAuthor,
        },
        results: { metric1, metric2, metric3 },
        metrics,
        tags: pickN(rand, tagsPool, 5),
        industries: pickN(rand, industriesPool, 3),
        useCases: pickN(rand, useCasesPool, 3),
        integrations: pickN(rand, integrationsPool, 3),
        videoUrl: hasVideo ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
        caseStudyPdf: hasPdf ? 'customer-success-story.pdf' : null,
        productImages: [],
        pricingModel: pricingModels[Math.floor(rand()*pricingModels.length)],
        startingPrice: rand() < 0.33 ? '$299/mo' : (rand() < 0.66 ? 'Free trial available' : 'Contact for pricing'),
        websiteUrl: 'https://example.com',
        linkedIn: 'https://linkedin.com/company/example',
        twitter: rand() < 0.5 ? '@exampleCo' : null,
        createdAt: Date.now() - Math.floor(rand()*1000*60*60*24*365),
        lastUpdated: Date.now(),
      }

      vendors.push(vendor)
    }
  }

  return vendors
}

const generated = generateVendors()

// Curated AI vendors for Software → AI category
const curatedAIVendors = [
  { id:'ai_inflection', name:'Inflection AI', tagline:'Enterprise-grade generative AI models and APIs', category:'AI', subcategory:'Software', sector:'Generative AI / Conversational Agents', shortDescription:'Customized LLMs and conversational agents for enterprises with scalable, real-time deployment.', fullDescription:'Inflection AI builds enterprise-grade large language models and customizable AI APIs. Pivoted from Pi to enterprise AI delivery with fine-tuning and SLAs.', logoEmoji:'🤖', brandColor:'#4F46E5', isVerified:true, isFeatured:true, certifications:['SOC 2'], results:{ metric1:'30% cost reduction', metric2:'5x faster deployment', metric3:'99.95% uptime' }, metrics:{ viewCount:9200, demoRequests:340, quoteRequests:210, avgResponseTime:'< 2 hours', satisfactionScore:4.8 }, tags:['enterprise-ready','AI-powered','real-time'], industries:['finance','healthcare','retail'], useCases:['chat assistance','document automation','predictive analytics'], integrations:['AWS','Azure','GCP'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://inflection.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_cognition', name:'Cognition AI', tagline:'Devin: Autonomous AI software engineer', category:'AI', subcategory:'Software', sector:'Autonomous Coding Agents / Dev Tools', shortDescription:'Autonomous coding agent that plans, writes, tests, and deploys code end-to-end.', fullDescription:'Cognition AI develops Devin, an autonomous AI software engineer with multi-step reasoning and sandboxed execution, integrated with Windsurf IDE.', logoEmoji:'🧠', brandColor:'#2563EB', isVerified:true, isFeatured:true, certifications:['SOC 2'], results:{ metric1:'40% cycle-time reduction', metric2:'2.5x velocity', metric3:'99% build stability' }, metrics:{ viewCount:11000, demoRequests:520, quoteRequests:260, avgResponseTime:'< 2 hours', satisfactionScore:4.7 }, tags:['developer-tools','agents','RL'], industries:['technology','finance'], useCases:['code generation','bug fixing','test automation'], integrations:['GitHub','Slack','Stripe'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.cognition-labs.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_together', name:'Together AI', tagline:'AI Acceleration Cloud for training, finetuning, and inference', category:'AI', subcategory:'Software', sector:'Cloud Infra / Open Source AI', shortDescription:'Enterprise-grade cloud to run open-source generative models with high performance.', fullDescription:'Together AI offers cloud infrastructure to train, finetune, and run inference on 200+ open-source models with proprietary high-performance inference.', logoEmoji:'☁️', brandColor:'#0EA5E9', isVerified:true, isFeatured:true, certifications:['SOC 2','ISO 27001'], results:{ metric1:'60% lower inference cost', metric2:'10x throughput', metric3:'99.99% reliability' }, metrics:{ viewCount:9800, demoRequests:430, quoteRequests:240, avgResponseTime:'< 2 hours', satisfactionScore:4.7 }, tags:['open-source','inference','training'], industries:['technology','media'], useCases:['model hosting','finetuning','RAG'], integrations:['AWS','Azure','GCP'], pricingModel:'Usage-based', startingPrice:'Free trial available', websiteUrl:'https://www.together.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_celestial', name:'Celestial AI', tagline:'Photonic Fabric™ optical interconnect for AI data centers', category:'AI', subcategory:'Software', sector:'Optical Interconnect / Data Center Infra', shortDescription:'Silicon-photonic interconnect linking compute and memory with ultra-low latency.', fullDescription:'Celestial AI develops Photonic Fabric to connect chips, packages, and racks with TB/s bandwidth, enabling energy-efficient AI infrastructure.', logoEmoji:'🛰️', brandColor:'#059669', isVerified:true, isFeatured:false, certifications:[], results:{ metric1:'10× energy reduction', metric2:'TB/s bandwidth', metric3:'Ultra-low latency' }, metrics:{ viewCount:8700, demoRequests:210, quoteRequests:180, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['photonic','interconnect','datacenter'], industries:['technology','cloud'], useCases:['AI training infra','memory disaggregation'], integrations:['NVIDIA'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://celestial.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_pathos', name:'Pathos', tagline:'Multimodal AI for oncology drug discovery', category:'AI', subcategory:'Software', sector:'Biotech / Oncology', shortDescription:'PathOS™ foundation model integrating clinical, molecular, and imaging data.', fullDescription:'Pathos accelerates oncology drug development with multimodal AI for trial design and patient selection.', logoEmoji:'🧬', brandColor:'#7C3AED', isVerified:true, isFeatured:true, certifications:['HIPAA'], results:{ metric1:'30% faster trial enrollment', metric2:'2x lead discovery speed', metric3:'Regulatory-grade pipelines' }, metrics:{ viewCount:7600, demoRequests:260, quoteRequests:140, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['biotech','multimodal','clinical'], industries:['healthcare','biopharma'], useCases:['trial optimization','biomarker discovery'], integrations:['AWS','GCP'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://www.pathos.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_magic', name:'Magic', tagline:'Foundation models for programming with ultra-long context', category:'AI', subcategory:'Software', sector:'Generative AI / Dev Tools', shortDescription:'AI colleague that writes, debugs, and plans code using LTM networks.', fullDescription:'Magic builds programming-optimized models with up to 100M-token context and large-scale GPU deployments.', logoEmoji:'🪄', brandColor:'#DB2777', isVerified:true, isFeatured:true, certifications:['SOC 2'], results:{ metric1:'35% coding time reduction', metric2:'2x PR throughput', metric3:'99.9% uptime' }, metrics:{ viewCount:8800, demoRequests:410, quoteRequests:190, avgResponseTime:'< 2 hours', satisfactionScore:4.6 }, tags:['long-context','coding','LLM'], industries:['technology'], useCases:['code generation','review','planning'], integrations:['GitHub','GCP'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.magic.dev', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_skild', name:'Skild AI', tagline:'Foundation model brain for general-purpose robots', category:'AI', subcategory:'Software', sector:'Robotics / Foundation Models', shortDescription:'Navigation, manipulation, and versatile task execution across robot platforms.', fullDescription:'Skild AI builds a general robot brain trained on 1000× data, adaptable across platforms for plug-and-play deployment.', logoEmoji:'🤖', brandColor:'#F59E0B', isVerified:true, isFeatured:false, certifications:[], results:{ metric1:'50% task time reduction', metric2:'3x task repertoire', metric3:'Platform-agnostic' }, metrics:{ viewCount:6900, demoRequests:180, quoteRequests:120, avgResponseTime:'1-2 days', satisfactionScore:4.5 }, tags:['robotics','foundation-model','manipulation'], industries:['manufacturing','logistics'], useCases:['pick-and-place','navigation'], integrations:['NVIDIA'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://www.skild.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_decagon', name:'Decagon', tagline:'Agentic AI for omnichannel customer support', category:'AI', subcategory:'Software', sector:'CX Automation', shortDescription:'AI agents that automate support across chat, email, and voice.', fullDescription:'Decagon automates and resolves support inquiries with agentic AI and natural language instructions integrated into enterprise systems.', logoEmoji:'💬', brandColor:'#2563EB', isVerified:true, isFeatured:true, certifications:['SOC 2'], results:{ metric1:'70% ticket deflection', metric2:'3x faster resolution', metric3:'CSAT +18%' }, metrics:{ viewCount:8400, demoRequests:390, quoteRequests:170, avgResponseTime:'< 2 hours', satisfactionScore:4.7 }, tags:['support','agentic-ai','omnichannel'], industries:['saas','retail'], useCases:['ticket automation','voice bots'], integrations:['Salesforce','Zendesk'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.decagon.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_spreeai', name:'SpreeAI', tagline:'Photorealistic virtual try-on with 99% sizing accuracy', category:'AI', subcategory:'Software', sector:'Fashion Tech / Retail Personalization', shortDescription:'Virtual try-on and AI sizing reduce returns and boost conversions.', fullDescription:'SpreeAI enables shoppers to visualize clothing on themselves with high accuracy, offering dashboards and AI stylist features.', logoEmoji:'👗', brandColor:'#DB2777', isVerified:true, isFeatured:false, certifications:[], results:{ metric1:'25% return reduction', metric2:'+18% conversion', metric3:'99% sizing accuracy' }, metrics:{ viewCount:6200, demoRequests:150, quoteRequests:110, avgResponseTime:'< 24 hours', satisfactionScore:4.5 }, tags:['virtual-try-on','retail','vision'], industries:['retail','ecommerce'], useCases:['fit visualization','AI sizing'], integrations:['Shopify','BigCommerce'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.spreeai.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_windsurf', name:'Windsurf', tagline:'AI-native IDE with agentic coding workflows', category:'AI', subcategory:'Software', sector:'AI-powered Coding Tools', shortDescription:'Generate, refactor, and deploy code with Cascade agent and Supercomplete.', fullDescription:'Windsurf is an AI-native IDE enabling multi-agent refactoring, one-click deployment, and real-time previews.', logoEmoji:'🧭', brandColor:'#0EA5E9', isVerified:true, isFeatured:true, certifications:['SOC 2'], results:{ metric1:'45% dev time reduction', metric2:'2x deployment speed', metric3:'High developer adoption' }, metrics:{ viewCount:12000, demoRequests:600, quoteRequests:300, avgResponseTime:'< 2 hours', satisfactionScore:4.8 }, tags:['IDE','agentic','code-gen'], industries:['technology'], useCases:['refactor','deploy','generate'], integrations:['GitHub','Slack','Stripe'], pricingModel:'Subscription', startingPrice:'Free trial available', websiteUrl:'https://www.codewindsurf.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_snorkel', name:'Snorkel AI', tagline:'Data development platform for AI/ML at scale', category:'AI', subcategory:'Software', sector:'Data Development / ML Infra', shortDescription:'Programmatic labeling, evaluation, and tuning for unstructured data.', fullDescription:'Snorkel AI provides programmatic weak supervision, Snorkel Flow, and Evaluate to build and improve AI systems efficiently.', logoEmoji:'📝', brandColor:'#4F46E5', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'40% cost savings', metric2:'3x data iteration speed', metric3:'Higher model quality' }, metrics:{ viewCount:7100, demoRequests:260, quoteRequests:130, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['labeling','evaluation','mlops'], industries:['finance','public sector'], useCases:['document AI','log analysis'], integrations:['Snowflake','AWS'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://www.snorkel.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_devrev', name:'DevRev', tagline:'AgentOS: AI-native business operating system', category:'AI', subcategory:'Software', sector:'Enterprise Software / CRM', shortDescription:'Unifies support, product, and engineering through conversational AI.', fullDescription:'DevRev uses a knowledge graph and AI agents with patented Airdrop tech to unify enterprise workflows.', logoEmoji:'📈', brandColor:'#2563EB', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'30% faster resolution', metric2:'2x roadmap velocity', metric3:'Unified analytics' }, metrics:{ viewCount:6400, demoRequests:200, quoteRequests:120, avgResponseTime:'< 24 hours', satisfactionScore:4.5 }, tags:['crm','agents','knowledge-graph'], industries:['saas','finance'], useCases:['support automation','roadmap planning'], integrations:['Salesforce','Slack'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.devrev.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_statsig', name:'Statsig', tagline:'Unified experimentation and product analytics', category:'AI', subcategory:'Software', sector:'Experimentation / Analytics', shortDescription:'Feature flags, A/B testing, product analytics, and session replay.', fullDescription:'Statsig combines experimentation with analytics and low-latency evaluation in a unified platform.', logoEmoji:'📊', brandColor:'#059669', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'20% faster rollouts', metric2:'Lower incident rate', metric3:'Warehouse-native' }, metrics:{ viewCount:7300, demoRequests:240, quoteRequests:140, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['experimentation','feature-flags','analytics'], industries:['technology','ecommerce'], useCases:['AB testing','flagging'], integrations:['Segment','Snowflake'], pricingModel:'Subscription', startingPrice:'Free trial available', websiteUrl:'https://www.statsig.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_truveta', name:'Truveta', tagline:'Regulatory-grade de-identified EHR data platform', category:'AI', subcategory:'Software', sector:'HealthTech / Medical Data', shortDescription:'Comprehensive clinical datasets and AI models for research and public health.', fullDescription:'Truveta aggregates de-identified EHR data across U.S. systems with daily updates and multimodal normalization.', logoEmoji:'🩺', brandColor:'#0EA5E9', isVerified:true, isFeatured:true, certifications:['HIPAA'], results:{ metric1:'Faster research cycles', metric2:'10M exome linkage', metric3:'Regulatory-grade' }, metrics:{ viewCount:6900, demoRequests:230, quoteRequests:120, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['ehr','genomics','public-health'], industries:['healthcare','life sciences'], useCases:['drug discovery','population health'], integrations:['Azure'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://www.truveta.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_evenup', name:'EvenUp', tagline:'AI-powered claims intelligence for PI law firms', category:'AI', subcategory:'Software', sector:'Legal Tech / Case Mgmt', shortDescription:'Automates drafting, evaluation, and negotiation prep using legal/medical data.', fullDescription:'EvenUp delivers claims intelligence trained on legal and medical data with SOC2/HIPAA compliance.', logoEmoji:'⚖️', brandColor:'#7C3AED', isVerified:true, isFeatured:false, certifications:['SOC 2','HIPAA'], results:{ metric1:'2x case throughput', metric2:'Higher settlement values', metric3:'Reduced missing docs' }, metrics:{ viewCount:5800, demoRequests:170, quoteRequests:100, avgResponseTime:'< 24 hours', satisfactionScore:4.5 }, tags:['legal','claims','documents'], industries:['legal'], useCases:['drafting','evaluation'], integrations:['Salesforce'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.evenuplaw.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_worldlabs', name:'World Labs', tagline:'Large World Models for 3D spatial intelligence', category:'AI', subcategory:'Software', sector:'Spatial Intelligence / 3D', shortDescription:'Generates and interacts with 3D environments with physics-aware semantics.', fullDescription:'World Labs builds LWMs for real-time explorable scenes and image-to-3D conversion.', logoEmoji:'🌎', brandColor:'#4F46E5', isVerified:true, isFeatured:true, certifications:[], results:{ metric1:'Faster 3D workflows', metric2:'Interactive browser scenes', metric3:'Physics-aware' }, metrics:{ viewCount:6000, demoRequests:180, quoteRequests:110, avgResponseTime:'< 24 hours', satisfactionScore:4.5 }, tags:['3d','spatial','vision'], industries:['gaming','media'], useCases:['world generation','3D QA'], integrations:['WebGL'], pricingModel:'Custom', startingPrice:'Contact for pricing', websiteUrl:'https://www.worldlabs.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_typeface', name:'Typeface', tagline:'Enterprise generative AI for on-brand content', category:'AI', subcategory:'Software', sector:'Enterprise Content', shortDescription:'Personalized, on-brand content embedded into business workflows.', fullDescription:'Typeface offers Brand Hub, Arc Agents, and Spaces with multimodal AI for marketing/sales/product/HR.', logoEmoji:'📝', brandColor:'#2563EB', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'3x content velocity', metric2:'Brand consistency', metric3:'Enterprise security' }, metrics:{ viewCount:6700, demoRequests:210, quoteRequests:120, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['content','multimodal','enterprise'], industries:['marketing','saas'], useCases:['campaigns','copy'], integrations:['Salesforce'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.typeface.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_speak', name:'Speak', tagline:'AI tutor for real-time speaking practice', category:'AI', subcategory:'Software', sector:'Language Learning', shortDescription:'Conversational lessons with pronunciation and grammar feedback.', fullDescription:'Speak provides an AI-driven language platform with real-time speech recognition and multilingual support.', logoEmoji:'🗣️', brandColor:'#059669', isVerified:true, isFeatured:false, certifications:[], results:{ metric1:'Higher fluency gains', metric2:'Personalized feedback', metric3:'10M+ users' }, metrics:{ viewCount:7200, demoRequests:240, quoteRequests:130, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['edtech','speech','tutor'], industries:['education','consumer'], useCases:['speaking practice','pronunciation'], integrations:['iOS','Android'], pricingModel:'Subscription', startingPrice:'Free trial available', websiteUrl:'https://www.speak.com', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_reka', name:'Reka AI', tagline:'Efficient multimodal foundation models for enterprise', category:'AI', subcategory:'Software', sector:'Multimodal LLMs', shortDescription:'Low-cost inference models processing text, images, video, and audio.', fullDescription:'Reka Flash/Flash 3.1 and Vision deliver efficient multimodal understanding with enterprise tooling.', logoEmoji:'📷', brandColor:'#0EA5E9', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'Lower inference cost', metric2:'Customizable pipelines', metric3:'Quantized performance' }, metrics:{ viewCount:6500, demoRequests:200, quoteRequests:120, avgResponseTime:'< 24 hours', satisfactionScore:4.6 }, tags:['multimodal','vision','audio'], industries:['enterprise','developer'], useCases:['visual QA','search','agentic QA'], integrations:['AWS','Snowflake'], pricingModel:'Usage-based', startingPrice:'Contact for pricing', websiteUrl:'https://www.reka.ai', createdAt: Date.now(), lastUpdated: Date.now() },
  { id:'ai_augment', name:'Augment Code', tagline:'Project-aware coding assistant with autonomous agents', category:'AI', subcategory:'Software', sector:'Developer Productivity', shortDescription:'Context engine and agents deliver code suggestions, debugging, and docs.', fullDescription:'Augment Code provides 200k-token windows, Memory, and IDE integrations for deep code understanding.', logoEmoji:'🧩', brandColor:'#7C3AED', isVerified:true, isFeatured:false, certifications:['SOC 2'], results:{ metric1:'30% rework reduction', metric2:'Faster onboarding', metric3:'Higher code quality' }, metrics:{ viewCount:6400, demoRequests:210, quoteRequests:120, avgResponseTime:'< 24 hours', satisfactionScore:4.5 }, tags:['context','agents','IDE'], industries:['technology'], useCases:['debugging','documentation'], integrations:['VS Code','JetBrains'], pricingModel:'Subscription', startingPrice:'Contact for pricing', websiteUrl:'https://www.augmentcode.ai', createdAt: Date.now(), lastUpdated: Date.now() }
]

// Remove generated AI vendors in Software subcategory and replace with curated list
const withoutAISoftware = generated.filter(v => !(v.subcategory === 'Software' && (v.category === 'AI' || v.category.toLowerCase() === 'ai')))
const defaultVendors = [...withoutAISoftware, ...curatedAIVendors]
export default defaultVendors
