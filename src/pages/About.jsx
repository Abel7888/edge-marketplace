import { Building2, Users, Target, Zap, Shield, Globe, CheckCircle2, TrendingUp, Search, BarChart3, Handshake, Rocket } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRmNDZlNSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            About Edge Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            We're here to simplify how businesses discover, evaluate, and connect with emerging technology solutions and specialized talent.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Edge Marketplace exists to simplify procurement, vetting, and comparison for emerging technologies. We believe finding the right technology partner or talent shouldn't be overwhelming—it should be straightforward, transparent, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Simplify Selection</h3>
              <p className="text-gray-700 leading-relaxed">
                Cut through the noise and find the right solutions faster with curated, vetted options.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ensure Quality</h3>
              <p className="text-gray-700 leading-relaxed">
                Every vendor and talent profile is vetted through our expert partner network.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Drive Results</h3>
              <p className="text-gray-700 leading-relaxed">
                Connect buyers with the right partners to maximize ROI and project success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">How We Work</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We partner with expert analysis firms that specialize in niche technology spaces to bring you vetted vendors and talent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Search size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">For Buyers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Access vetted vendors in our marketplace across emerging tech categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Coordinate demos and conduct analysis to compare vendors side-by-side</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Make informed decisions with deep research, analysis, and ROI comparisons</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Save time with our free platform—no hidden costs or commitments</span>
                </li>
              </ul>
            </div>

            {/* For Vendors */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-purple-300 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Rocket size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">For Vendors</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Showcase your innovation on our platform and across all our channels</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Get discovered by qualified buyers actively searching for solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Benefit from our expert analysis and research to highlight your strengths</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Submit your company for free—no listing fees or barriers to entry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">What We Offer</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Four specialized services designed to help you find the right technology partners and talent.
            </p>
          </div>

          <div className="space-y-12">
            {/* Emerging Tech Vendors */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Emerging Technology Vendors</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Discover vetted vendors across AI, blockchain, IoT, AR/VR, and other emerging technologies. Our expert partners analyze and curate solutions so you can compare features, pricing, and ROI to find the perfect fit for your needs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">AI & ML</span>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">Blockchain</span>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">IoT</span>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">AR/VR</span>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">Cloud</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Software Development Firms */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Building2 size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Software Development Firms</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Access 100+ software development firms with niche expertise in emerging technologies. Whether you're an enterprise or small business, we simplify the selection process—from coordinating initial calls to project completion. Find teams that specialize in your exact technology needs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">Custom Development</span>
                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">Enterprise Solutions</span>
                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">Startups</span>
                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">SMB Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Talent */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Tech Talent Placement</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Find vetted global talent specializing in niche tech positions across all sectors. We work with multiple platforms and partners who obsess over technical assessments, skill profiling, and matching algorithms to drive success. Perfect for temporary hires or long-term positions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-sm font-semibold">AI Engineers</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-sm font-semibold">Full-Stack</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-sm font-semibold">DevOps</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-sm font-semibold">Data Engineers</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-sm font-semibold">Blockchain</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Research & Analysis */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Deep Research & Analysis</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We conduct in-depth analysis and research on tools, applications, and emerging technologies. Our team learns the ins and outs of each solution to provide you with comprehensive comparisons, helping you make confident decisions backed by data.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">Vendor Comparison</span>
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">ROI Analysis</span>
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">Tech Reviews</span>
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">Market Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Our Approach</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're here to assist in any way we can. Our platform is completely free for both vendors and buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Handshake size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Partnership-Driven</h3>
              <p className="text-sm text-gray-600">We work with expert partners who specialize in niche technology spaces</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Quality-Focused</h3>
              <p className="text-sm text-gray-600">Every vendor and talent profile is thoroughly vetted before listing</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-cyan-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Free Platform</h3>
              <p className="text-sm text-gray-600">No listing fees for vendors, no subscription costs for buyers</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <Target size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Results-Oriented</h3>
              <p className="text-sm text-gray-600">Focused on helping you find the right partner and maximize ROI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Whether you're looking for technology solutions, development partners, or specialized talent, we're here to help you find the right match.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Browse Vendors
            </a>
            <a href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold transition-all">
              Find Development Firms
            </a>
            <a href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold transition-all">
              Hire Tech Talent
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
