'use client'


import { useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, Eye, DollarSign, Send, Users, Calendar, MessageSquare, ChevronDown, ChevronUp, Shield, Award, Globe } from 'lucide-react'

export default function FindTalent() {
  const [openFaq, setOpenFaq] = useState(null)
  const [showMainForm, setShowMainForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'Main Talent Request',
          ...formData,
          submittedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        alert('Request submitted! We\'ll connect you with our vetted partners shortly.')
        setFormData({ name: '', email: '', phone: '', company: '', role: '', message: '' })
        setShowMainForm(false)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRmNDZlNSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Emerging Tech Talent Pool</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Find World-Class Remote Talent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">For Your Next Project</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
              We coordinate with top talent pools and partners in our network to help you find the perfect developers, designers, and specialists. Think of us as your extra resource for tech talent recruiting—we deploy vetted professionals as soon as you submit your request.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => setShowMainForm(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Send size={20} />
                Submit Your Request
                <ArrowRight size={20} />
              </button>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold transition-all">
                <Calendar size={20} />
                How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">2,500+</div>
                <div className="text-sm text-blue-200">Vetted Experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300">&lt;7 Days</div>
                <div className="text-sm text-purple-200">Avg. Match Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-300">96%</div>
                <div className="text-sm text-pink-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300">250+</div>
                <div className="text-sm text-cyan-200">Tech Skills</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Innovate Faster with World-Class Remote Talent</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The quality and commitment of an in-house team, with the flexibility of contractors. We pair world-class talent with unmatched transparency on developer performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Target, title: 'Quality', desc: 'Every developer is rigorously vetted through technical assessments, code reviews, and background checks to ensure top-tier expertise.', color: 'from-blue-500 to-indigo-600' },
              { icon: Zap, title: 'Speed', desc: 'Get matched with qualified candidates within 48 hours. Start interviewing immediately and onboard within days, not weeks.', color: 'from-purple-500 to-pink-600' },
              { icon: Eye, title: 'Transparency', desc: 'Full visibility into developer performance, work history, and client feedback. No surprises, just honest assessments.', color: 'from-cyan-500 to-blue-600' },
              { icon: Users, title: 'Flexibility', desc: 'Scale your team up or down based on project needs. Short-term contracts or long-term partnerships—your choice.', color: 'from-green-500 to-emerald-600' },
              { icon: DollarSign, title: 'Cost-Effective', desc: 'Competitive rates without compromising quality. No hidden fees, no recruitment costs, just straightforward pricing.', color: 'from-orange-500 to-red-600' }
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Four simple steps to find your perfect match</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Submit Request', desc: 'Tell us about your project needs, timeline, and the skills you\'re looking for. Takes less than 5 minutes.', icon: Send, color: 'from-blue-500 to-indigo-600' },
              { step: '2', title: 'Book a Meeting', desc: 'Schedule a call with our vetted partner to discuss your requirements in detail and refine your search.', icon: Calendar, color: 'from-purple-500 to-pink-600' },
              { step: '3', title: 'Review Matches', desc: 'Receive curated profiles of pre-vetted candidates that match your criteria. Interview your top picks.', icon: Users, color: 'from-cyan-500 to-blue-600' },
              { step: '4', title: 'Start Working', desc: 'Onboard your selected talent and start collaborating. We handle contracts, compliance, and payments.', icon: CheckCircle2, color: 'from-green-500 to-emerald-600' }
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -z-10" />
                )}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon size={32} className="text-white" />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-blue-600">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Elite Tech Talent, Rigorously Vetted</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Access pre-screened senior engineers and specialists trusted by CTOs and engineering leaders at Fortune 500 companies and high-growth startups</p>
          </div>

          {/* AI/ML Engineering */}
          <TalentCategory 
            title="AI & Machine Learning Engineering" 
            talents={[
              { name: 'Dr. Sarah Chen', role: 'Senior AI Engineer', experience: '8+ years', skills: ['PyTorch', 'TensorFlow', 'LLM Fine-tuning', 'MLOps'], location: 'San Francisco, CA' },
              { name: 'Michael Rodriguez', role: 'ML Engineer', experience: '6 years', skills: ['Python', 'Scikit-learn', 'AWS SageMaker', 'Model Deployment'], location: 'Austin, TX' },
              { name: 'Dr. Priya Patel', role: 'NLP Specialist', experience: '7 years', skills: ['Transformers', 'BERT', 'GPT', 'Hugging Face'], location: 'Boston, MA' },
              { name: 'James Anderson', role: 'Computer Vision Engineer', experience: '5 years', skills: ['OpenCV', 'YOLO', 'CNN', 'Image Processing'], location: 'Seattle, WA' }
            ]}
            count="85+"
          />

          {/* Full-Stack Engineering */}
          <TalentCategory 
            title="Full-Stack Engineering" 
            talents={[
              { name: 'Alex Thompson', role: 'Senior Full-Stack Engineer', experience: '10+ years', skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'], location: 'New York, NY' },
              { name: 'Emily Zhang', role: 'Full-Stack Developer', experience: '6 years', skills: ['Vue.js', 'Python', 'Django', 'Docker'], location: 'Remote' },
              { name: 'David Kim', role: 'Lead Full-Stack Engineer', experience: '9 years', skills: ['Next.js', 'TypeScript', 'GraphQL', 'Kubernetes'], location: 'Los Angeles, CA' },
              { name: 'Maria Garcia', role: 'Full-Stack Engineer', experience: '7 years', skills: ['Angular', 'Java', 'Spring Boot', 'MongoDB'], location: 'Chicago, IL' }
            ]}
            count="120+"
          />

          {/* Cloud & DevOps */}
          <TalentCategory 
            title="Cloud Architecture & DevOps" 
            talents={[
              { name: 'Robert Williams', role: 'Senior DevOps Engineer', experience: '11 years', skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'], location: 'Denver, CO' },
              { name: 'Lisa Johnson', role: 'Cloud Architect', experience: '12+ years', skills: ['Azure', 'Microservices', 'Docker', 'Infrastructure as Code'], location: 'Atlanta, GA' },
              { name: 'Kevin Nguyen', role: 'Site Reliability Engineer', experience: '8 years', skills: ['GCP', 'Prometheus', 'Grafana', 'Linux'], location: 'San Diego, CA' },
              { name: 'Amanda Brown', role: 'DevOps Lead', experience: '10 years', skills: ['Jenkins', 'GitLab CI', 'Ansible', 'Security'], location: 'Portland, OR' }
            ]}
            count="95+"
          />

          {/* Data Engineering */}
          <TalentCategory 
            title="Data Engineering & Analytics" 
            talents={[
              { name: 'Dr. Thomas Lee', role: 'Senior Data Engineer', experience: '9 years', skills: ['Apache Spark', 'Airflow', 'Snowflake', 'ETL'], location: 'San Francisco, CA' },
              { name: 'Jennifer Martinez', role: 'Data Platform Engineer', experience: '7 years', skills: ['Databricks', 'Kafka', 'Python', 'SQL'], location: 'Remote' },
              { name: 'Chris Taylor', role: 'Analytics Engineer', experience: '6 years', skills: ['dbt', 'BigQuery', 'Looker', 'Data Modeling'], location: 'New York, NY' },
              { name: 'Nina Patel', role: 'Data Architect', experience: '10+ years', skills: ['Data Warehousing', 'Redshift', 'Data Governance', 'BI'], location: 'Boston, MA' }
            ]}
            count="70+"
          />

          {/* Blockchain & Web3 */}
          <TalentCategory 
            title="Blockchain & Web3 Development" 
            talents={[
              { name: 'Marcus Johnson', role: 'Senior Blockchain Engineer', experience: '6 years', skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'], location: 'Miami, FL' },
              { name: 'Sophie Anderson', role: 'Web3 Developer', experience: '5 years', skills: ['Rust', 'Solana', 'DeFi', 'NFT'], location: 'Austin, TX' },
              { name: 'Daniel Kim', role: 'Blockchain Architect', experience: '8 years', skills: ['Hyperledger', 'Consensus Algorithms', 'Cryptography', 'dApps'], location: 'San Francisco, CA' },
              { name: 'Rachel Cohen', role: 'Smart Contract Developer', experience: '4 years', skills: ['Hardhat', 'Truffle', 'IPFS', 'Layer 2'], location: 'Remote' }
            ]}
            count="45+"
          />

          {/* Mobile Engineering */}
          <TalentCategory 
            title="Mobile Engineering" 
            talents={[
              { name: 'Brandon Lee', role: 'Senior iOS Engineer', experience: '9 years', skills: ['Swift', 'SwiftUI', 'Core Data', 'ARKit'], location: 'Seattle, WA' },
              { name: 'Olivia Martinez', role: 'Android Lead', experience: '10 years', skills: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Firebase'], location: 'Los Angeles, CA' },
              { name: 'Ryan Thompson', role: 'React Native Engineer', experience: '6 years', skills: ['React Native', 'TypeScript', 'Redux', 'Mobile CI/CD'], location: 'Chicago, IL' },
              { name: 'Jessica Wang', role: 'Flutter Developer', experience: '5 years', skills: ['Flutter', 'Dart', 'BLoC', 'Cross-platform'], location: 'Remote' }
            ]}
            count="80+"
          />
        </div>
      </section>

      {/* Enterprise Security */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Shield size={16} className="text-green-300" />
                <span className="text-sm font-medium">Enterprise-Grade Security & Compliance</span>
              </div>
              <h2 className="text-4xl font-extrabold mb-6">Trusted, Compliant, and Secure</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Edge Marketplace works with partners who are compliant with global workforce regulations, including the Dutch DBA Act, the 24-Month Rule, and the UK's IR35 laws. Our structure eliminates misclassification risks, providing a seamless and risk-free hiring experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={24} className="text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">ISO 27001 Certified</h3>
                    <p className="text-blue-100">Upholding the highest standards of security and data protection</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe size={24} className="text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Global Compliance</h3>
                    <p className="text-blue-100">Fully compliant with international workforce regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Risk-Free Hiring</h3>
                    <p className="text-blue-100">Zero misclassification risks with our vetted partner network</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white/10 rounded-2xl">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-blue-200">Secure</div>
                  </div>
                  <div className="text-center p-6 bg-white/10 rounded-2xl">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-2xl font-bold">Compliant</div>
                    <div className="text-sm text-blue-200">Globally</div>
                  </div>
                  <div className="text-center p-6 bg-white/10 rounded-2xl">
                    <div className="text-4xl mb-2">🛡️</div>
                    <div className="text-2xl font-bold">Zero</div>
                    <div className="text-sm text-blue-200">Risk</div>
                  </div>
                  <div className="text-center p-6 bg-white/10 rounded-2xl">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="text-2xl font-bold">Fast</div>
                    <div className="text-sm text-blue-200">Deploy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about finding talent through Edge Marketplace</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Edge Marketplace find talent for me?',
                a: 'We work with a curated network of vetted talent partners who specialize in different tech domains. When you submit a request, we coordinate with the most relevant partners to match you with pre-screened candidates who fit your requirements. Think of us as your extra recruiting resource that taps into multiple high-quality talent pools.'
              },
              {
                q: 'How long does it take to get matched with candidates?',
                a: 'On average, you\'ll receive your first batch of candidate profiles within 48 hours of submitting your request. After booking a meeting with our partner, you can typically start interviewing candidates within 3-5 business days. The entire process from request to hire usually takes 1-2 weeks.'
              },
              {
                q: 'What makes your talent different from other platforms?',
                a: 'Every developer in our network has been rigorously vetted by our partners through technical assessments, code reviews, and background checks. We focus on quality over quantity, ensuring you only see candidates who truly match your needs. Plus, we provide full transparency on developer performance and work history.'
              },
              {
                q: 'Can I hire for short-term projects or only long-term roles?',
                a: 'Both! Our talent network is flexible and can accommodate everything from 1-month projects to multi-year engagements. Whether you need someone for a quick sprint or a long-term partnership, we\'ll find the right fit for your timeline and budget.'
              },
              {
                q: 'What if I\'m not satisfied with the matches?',
                a: 'We\'re committed to finding you the perfect match. If the initial candidates don\'t meet your expectations, we\'ll work with our partners to refine the search and provide additional profiles at no extra cost. Your satisfaction is our priority.'
              },
              {
                q: 'How does pricing work?',
                a: 'Pricing varies based on the role, experience level, and engagement length. Our partners provide transparent, competitive rates with no hidden fees. You\'ll receive detailed pricing information during your consultation call before making any commitments.'
              },
              {
                q: 'Are there any upfront costs or commitments?',
                a: 'No! Submitting a request and reviewing candidate profiles is completely free. You only pay when you decide to hire a candidate, and there are no long-term commitments required. You have full flexibility to scale up or down as needed.'
              },
              {
                q: 'How do you ensure compliance and reduce hiring risks?',
                a: 'Our partner network is fully compliant with global workforce regulations, including the Dutch DBA Act, UK IR35, and other international laws. We handle all compliance, contracts, and legal requirements, eliminating misclassification risks and ensuring a seamless, risk-free hiring experience for you.'
              }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Request Form Modal */}
      {showMainForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowMainForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Submit Your Request</h3>
            <p className="text-gray-600 mb-6">Tell us about your needs and we'll connect you with world-class talent within 48 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email *</label>
                <input 
                  type="email" 
                  placeholder="john@company.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input 
                  type="text" 
                  placeholder="Acme Inc." 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role/Position Needed</label>
                <input 
                  type="text" 
                  placeholder="e.g., Senior Full-Stack Developer" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Details *</label>
                <textarea 
                  placeholder="Tell us about your project, timeline, and requirements..." 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMainForm(false)} className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

// FAQ Item Component
function FAQItem({ question, answer, index, openFaq, setOpenFaq }) {
  const isOpen = openFaq === index

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-blue-50/50 transition-all"
      >
        <span className="text-lg font-bold text-slate-900 pr-4">{question}</span>
        {isOpen ? <ChevronUp size={24} className="text-blue-600 flex-shrink-0" /> : <ChevronDown size={24} className="text-gray-400 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

// Talent Category Component
function TalentCategory({ title, talents, count }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: `${title} Talent Request`,
          ...formData,
          submittedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        alert('Request submitted! We\'ll connect you with our vetted partners shortly.')
        setFormData({ name: '', email: '', company: '', message: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error. Please try again.')
    }
  }

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-bold text-slate-900">{title}</h3>
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg">{count} Available</span>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Send size={18} />
          Request Positions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {talents.map((talent, i) => (
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full min-h-[420px]">
            {/* Professional Avatar with Initials */}
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3 group-hover:scale-110 transition-transform shadow-lg">
                {talent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{talent.name}</h4>
              <p className="text-sm font-semibold text-blue-600 mb-1">{talent.role}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Users size={12} />
                <span>{talent.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Globe size={12} />
                <span>{talent.location}</span>
              </div>
            </div>
            
            {/* Skills */}
            <div className="mb-4 flex-grow">
              <div className="text-xs font-semibold text-gray-700 mb-2">Core Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {talent.skills.map((skill, j) => (
                  <span key={j} className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA Button */}
            <button 
              onClick={() => setShowForm(true)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-auto"
            >
              <Send size={14} />
              Request Position
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Request {title} Talent</h3>
            <p className="text-gray-600 mb-6">Fill out this form and we'll connect you with our vetted partners to find the perfect match for your project.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
              />
              <input 
                type="email" 
                placeholder="Work Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
              />
              <input 
                type="text" 
                placeholder="Company Name" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none" 
              />
              <textarea 
                placeholder="Tell us about your project..." 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none"
              ></textarea>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

