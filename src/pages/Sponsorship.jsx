'use client'


import { useState } from 'react'
import { Check, TrendingUp, Users, Mail, BarChart3, Target, Zap, Globe, X, Building, Phone, MessageSquare, BookOpen, Download, CheckCircle2, Sparkles } from 'lucide-react'
import ContactModal from '../components/modals/ContactModal.jsx'

function Sponsorship() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showSponsorModal, setShowSponsorModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [modalPackage, setModalPackage] = useState(null)

  const packages = [
    {
      id: 'classified',
      name: 'Classified Ad',
      price: '$350',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      description: 'Text-only ads displayed at the bottom of the newsletter with a link. Perfect for cost-effective promotion.',
      features: [
        'Text-only placement',
        'Bottom of newsletter',
        'Direct link to your site',
        'Single issue placement',
        'Quick turnaround'
      ],
      cta: 'Book Classified Ad'
    },
    {
      id: 'sponsored',
      name: 'Sponsored Ad',
      price: '$600',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
      description: 'A featured placement at the top of the email that can include a banner, description, and call-to-action button.',
      features: [
        'Top of newsletter placement',
        'Custom banner image',
        'Description text',
        'Call-to-action button',
        'Higher visibility'
      ],
      cta: 'Book Sponsored Ad',
      popular: true
    },
    {
      id: 'dedicated',
      name: 'Dedicated Ad',
      price: '$1,300',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      description: 'An entire newsletter issue dedicated to showcasing your product or service. Maximum impact and engagement with the audience.',
      features: [
        'Entire newsletter issue',
        'Full creative control',
        'Maximum engagement',
        'Detailed product showcase',
        'Highest conversion potential'
      ],
      cta: 'Book Dedicated Issue'
    },
    {
      id: 'bundle',
      name: 'Partner Bundle',
      price: '$1,300',
      icon: Globe,
      color: 'from-teal-500 to-green-500',
      description: 'Sponsored visibility with 3 posts per week across 3 sector publications for 3 consecutive weeks, reaching engaged emerging-tech decision-makers.',
      features: [
        '3 posts per week',
        '3 sector publications',
        '3 consecutive weeks',
        'Cross-industry reach',
        'Sustained visibility'
      ],
      cta: 'Book Partner Bundle',
      featured: true
    }
  ]

  const stats = [
    { label: 'Subscribers', value: '35K', icon: Users },
    { label: 'Open Rate', value: '35%', icon: Mail },
    { label: 'Click-through Rate', value: '20%', icon: TrendingUp },
    { label: 'Page Views', value: '150K+ / month', icon: BarChart3 }
  ]

  const readerProfiles = [
    'CFO', 'CTO', 'CEO', 'CMO', 'COO', 
    'Recruiters', 'Acquisitions', 'Procurement'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <TrendingUp size={16} />
              Reach 35K+ Decision-Makers
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Sponsorship Opportunities
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Connect with engaged professionals actively evaluating emerging technologies across finance, construction, real estate, healthcare, and supply chain.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#packages" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition-all">
                View Packages
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Newsletter Performance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our audience is highly engaged, with strong open rates and click-through rates that outperform industry averages.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border-2 border-blue-100 hover:border-blue-300 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Edge Marketplace Newsletter
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  The Edge Marketplace Newsletter is a thoughtfully curated publication focused on emerging technologies shaping real-world industries. We cover practical insights across AI, automation, IoT, digital twins, data infrastructure, and adjacent innovations—always with an emphasis on real use cases, not hype.
                </p>
                <p>
                  Over the past year, our audience has grown organically to include professionals who are actively evaluating, adopting, or building emerging technologies. Roughly <strong>90% of our readers are decision-makers</strong>—from founders and technical leaders at small and mid-sized companies to executives and innovation teams within large enterprises.
                </p>
                <p>
                  We publish <strong>3 times per week</strong>, with each issue focused on a specific sector—rotating across finance, construction & real estate, healthcare, and supply chain—to deliver targeted, relevant insights for our audience.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Reader Profile</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {readerProfiles.map((profile, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold text-sm">
                    {profile}
                  </span>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Decision-makers across finance, construction, real estate, healthcare, and supply chain</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Focused on discovering trusted solutions and understanding impact</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Cutting through the hype around emerging tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Package</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the sponsorship option that best fits your marketing goals and budget.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 p-8 hover:shadow-2xl transition-all cursor-pointer ${
                  selectedPackage === pkg.id ? 'border-blue-600 shadow-xl' : 'border-gray-200'
                } ${pkg.popular || pkg.featured ? 'ring-4 ring-blue-100' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold">
                    Most Popular
                  </div>
                )}
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-600 to-green-600 text-white text-sm font-bold">
                    Best Value
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white`}>
                    <pkg.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {pkg.price}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setModalPackage(pkg)
                    setShowSponsorModal(true)
                  }}
                  className={`block w-full text-center px-6 py-4 rounded-xl font-semibold transition-all ${
                    selectedPackage === pkg.id
                      ? `text-white bg-gradient-to-r ${pkg.color} hover:shadow-xl`
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Request {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-1.5 mb-3">
              <Sparkles className="text-purple-600" size={16} />
              <span className="text-purple-700 font-bold text-xs uppercase tracking-wider">Free Resources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Buyers Guides & eBooks</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights to help you make informed technology decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full" />

              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mb-1.5">FINTECH GUIDE</span>
                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">What Enterprises Really Look for When Choosing FinTech in the AI Era (2026)</h3>
                    <p className="text-xs text-gray-600">How buyers evaluate vendors behind closed doors</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-blue-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Why deals stall (even when the product is solid)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Security scrutiny, pricing transparency, implementation fear</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>How enterprise teams judge AI in practice (not slides)</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href="/resources/fintech-ai-era"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl hover:border-orange-400 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-bl-full" />

              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 mb-1.5">CONSTRUCTION TECH</span>
                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">How GCs Decide Which Construction Tech Actually Gets Used (2026)</h3>
                    <p className="text-xs text-gray-600">How to earn real jobsite adoption</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-orange-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Who really influences adoption on a job site</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Why most tools die after the pilot</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>What turns a test into a company-wide rollout</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href="/resources/contech-adoption"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-semibold hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 rounded-2xl border border-teal-200 shadow-lg hover:shadow-xl hover:border-teal-400 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-bl-full" />

              <div className="relative p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700 mb-1.5">HEALTHCARE IT</span>
                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">What Healthcare Providers Want Before Approving IT or Digital Health Solutions (2026)</h3>
                    <p className="text-xs text-gray-600">How approval really works in 2026</p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-teal-100">
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Who has veto power (and what they care about)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Security, compliance, and equity expectations</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={14} />
                      <span>Why deals stall late—even after strong demos</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href="/resources/healthcare-approval"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold hover:from-teal-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5"
                  >
                    <Download size={16} />
                    Get Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Reach 35K+ Decision-Makers?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how Edge Marketplace can help you connect with the right audience.
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white text-blue-600 hover:shadow-2xl transition-all"
          >
            <Mail size={20} />
            Contact Partnerships Team
          </button>
        </div>
      </section>

      {/* Sponsorship Request Modal */}
      {showSponsorModal && modalPackage && (
        <SponsorshipModal
          package={modalPackage}
          onClose={() => {
            setShowSponsorModal(false)
            setModalPackage(null)
          }}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  )
}

// Sponsorship Request Modal Component
function SponsorshipModal({ package: pkg, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    packageType: pkg.name,
    goals: '',
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: `Sponsorship Request: ${pkg.name}`,
          _subject: `Sponsorship Request: ${pkg.name} - ${formData.companyName}`
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r ${pkg.color} text-white mb-4`}>
                  <pkg.icon size={24} />
                  <span className="font-bold">{pkg.name}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Sponsorship</h2>
                <p className="text-gray-600">{pkg.description}</p>
                <div className="mt-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {pkg.price}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sponsorship Goals *
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      required
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="What are your goals for this sponsorship? (e.g., brand awareness, lead generation, product launch)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Any other details you'd like to share about your company or campaign..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${pkg.color} hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sponsorship

