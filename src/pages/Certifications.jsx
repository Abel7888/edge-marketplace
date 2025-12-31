import { useEffect } from 'react'
import { Menu, X, Grid, ShieldCheck, Layers, Building2, Stethoscope, Banknote, Landmark, Book, GraduationCap, Award, Shield, ClipboardList, CheckCircle2 } from 'lucide-react'

export default function Certifications() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const BuyButton = ({ children = 'Buy Now', className = '' }) => (
    <button className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 animate-pulse ${className}`}>
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header (page-scoped, does not replace global Navbar) */}
      <header className="fixed inset-x-0 top-16 z-10">{/* offset for global navbar */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 grid place-items-center text-sm font-bold">AI</div>
              <div className="text-sm text-slate-200">Certification Platform</div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white/90 text-white/70">Home</a>
              <a href="#categories" className="hover:text-white/90 text-white/70">Certifications</a>
              <a href="#industries" className="hover:text-white/90 text-white/70">Industries</a>
              <a href="#" className="hover:text-white/90 text-white/70">About</a>
              <a href="#" className="hover:text-white/90 text-white/70">Contact</a>
            </nav>
            <div className="hidden md:block">
              <BuyButton />
            </div>
            <button className="md:hidden w-9 h-9 grid place-items-center rounded-lg bg-white/10 border border-white/10">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-indigo-800/40 to-purple-900/60" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.08) 2px, transparent 0)', backgroundSize: '50px 50px' }} />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Enterprise AI Governance & Technology Certifications
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Industry-leading frameworks and certifications for healthcare, finance, and emerging technologies
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BuyButton className="animate-[pulse_2s_ease-in-out_infinite]" />
            <a href="#categories" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-white/20 text-white/90 hover:bg-white/10 transition">
              Browse Certifications
            </a>
          </div>
        </div>
      </section>

      {/* Certification & Training Catalog (10 items) */}
      <section id="categories" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Certification & Training Catalog</h2>
            <p className="mt-2 text-slate-300">Free foundation courses plus professional certifications and assessments</p>
            <div className="mx-auto mt-6 w-24 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>

          {/* Free Courses – 3 compact cards */}
          <div className="mt-10">
            <div className="flex items-center gap-2 text-slate-200 mb-3"><Book size={18}/> <span className="font-semibold">Free Courses – Build Your Foundation in Sustainable Construction</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title:'Introduction to Sustainable Construction', level:'Free | Beginner', desc:'Gain an essential understanding of sustainability principles in modern construction. Learn how materials, design, and processes can reduce environmental impact while maximizing efficiency.' },
                { title:'Life Cycle Stages of Construction Projects and Products', level:'Free | Intermediate', desc:'Explore the entire life cycle of construction—from raw materials and production to operation, maintenance, and end-of-life. Learn how each stage influences sustainability and cost.' },
                { title:'Concrete Essentials — Basic Properties of Concrete', level:'Free | Basic', desc:'Understand the science behind one of construction’s most important materials. Learn about concrete composition, strength, and performance in modern building applications.' },
              ].map((c)=> (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold"><CheckCircle2 size={14}/> Free Course</div>
                  <div className="mt-2 text-lg font-semibold">{c.title}</div>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{c.desc}</p>
                  <div className="mt-3 text-xs text-slate-400">Level: {c.level}</div>
                  <div className="mt-4"><a href="#" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/20 text-sm text-white/90 hover:bg-white/10">LEARN MORE</a></div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Certifications – 4 large cards */}
          <div className="mt-14">
            <div className="flex items-center gap-2 text-slate-200 mb-4"><GraduationCap size={18}/> <span className="font-semibold">Professional Certifications – Advance Your Career</span></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key:'cpdhts', icon: Award, title:'CPDHTS® – Certified Professional in Digital Health Transformation Strategy', body:"Demonstrate advanced expertise in digital health transformation strategy, from governance to results tracking. This credential proves your ability to lead large-scale innovation projects and organizational transformation.", ideal:'Healthcare executives, digital strategy leaders, and transformation officers.', value:'Globally recognized by HIMSS, CPDHTS® positions you as a trusted leader driving healthcare modernization.', pricing:['$1,369 (HIMSS Member/Corporate/Student)','$1,259 (HIMSS Organizational Affiliate)','$1,579 (Non-member)'], cta:'ENROLL NOW' },
                { key:'cahims', icon: Award, title:'CAHIMS® – Certified Associate in Healthcare Information and Management Systems', body:'Validate your ability to plan, implement, and support healthcare technology systems. Gain the skills to manage clinical workflows, collaborate across teams, and optimize digital operations.', ideal:'Entry- to mid-level healthcare IT professionals, analysts, and consultants.', value:'The CAHIMS® credential lays the foundation for a career in health information management and digital health innovation.', pricing:['$399 (HIMSS Member/Corporate/Student)','$349 (HIMSS Organizational Affiliate)','$439 (Non-member)'], cta:'ENROLL NOW' },
                { key:'cobit', icon: ShieldCheck, title:'COBIT Foundation Certificate', body:'Master the COBIT 2019 framework and learn how to align IT goals with strategic business objectives. Build expertise in IT governance, risk management, and performance optimization.', ideal:'IT and business managers, consultants, GRC professionals, and students.', value:'The COBIT Foundation certification validates your ability to implement governance systems that deliver business value and manage IT risk effectively.', pricing:[], cta:'REQUEST INFO' },
                { key:'isc2', icon: Shield, title:'Enterprise Cybersecurity Training (ISC2)', body:"Protect your organization by strengthening your team’s cybersecurity expertise. ISC2’s Enterprise Cybersecurity Training delivers customized programs built around your organization’s needs, threats, and budget.", ideal:'Corporate security teams, IT leaders, and organizations scaling their cybersecurity maturity.', value:'Official ISC2 courseware, expert-led instruction, group discounts, and ongoing upskilling.', pricing:[], cta:'SCHEDULE CONSULTATION' },
              ].map((c)=> (
                <div key={c.key} className="rounded-3xl border border-white/10 bg-slate-800/60 p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition">
                  <div className="flex items-center gap-3"><c.icon className="text-emerald-300" size={22}/> <div className="text-xl font-bold">{c.title}</div></div>
                  <p className="mt-3 text-slate-200 leading-relaxed">{c.body}</p>
                  <div className="mt-3 text-sm text-slate-300"><span className="font-semibold">Ideal For:</span> {c.ideal}</div>
                  <div className="mt-2 text-sm text-slate-300"><span className="font-semibold">Value:</span> {c.value}</div>
                  {c.pricing.length>0 && (
                    <div className="mt-4 text-sm text-slate-300 space-y-1">{c.pricing.map((p)=> <div key={p}>{p}</div>)}</div>
                  )}
                  <div className="mt-5"><BuyButton>{c.cta}</BuyButton></div>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks, Assessments & Certifications – 3 large cards */}
          <div className="mt-14">
            <div className="flex items-center gap-2 text-slate-200 mb-4"><ClipboardList size={18}/> <span className="font-semibold">Frameworks, Assessments & Certifications</span></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key:'nist', title:'NIST Cybersecurity Framework Assessment', body:'The NIST Cybersecurity Framework (CSF) is the world’s most widely adopted model for building and strengthening an organization’s information security program. A NIST assessment provides deep visibility into cyber risks, helps meet regulatory and cyber insurance requirements, and improves your ability to respond to modern threats.', bullets:['Identify and mitigate organizational risks','Strengthen compliance readiness','Align cybersecurity strategy with business goals'], cta:'LEARN MORE' },
                { key:'iso27001', title:'ISO 27001 – Information Security Management System (ISMS)', body:'ISO 27001:2022 defines the global standard for establishing, maintaining, and improving an Information Security Management System (ISMS). It ensures confidentiality, integrity, and availability of business information through structured risk management.', bullets:['Stronger resilience and faster recovery','Centralized data control and visibility','Comprehensive protection across assets','Cost reduction by preventing breaches'], cta:'REQUEST INFO' },
                { key:'iso42001', title:'ISO/IEC 42001 – AI Management System Certification', body:'ISO/IEC 42001 sets the global standard for the ethical and transparent use of artificial intelligence. As AI becomes integral to business operations, this certification shows your organization’s commitment to security, fairness, and responsible AI governance.', bullets:['Implement and protect AI systems responsibly','Enhance operational efficiency and compliance','Strengthen trust with clients and regulators'], cta:'LEARN MORE' },
              ].map((f)=> (
                <div key={f.key} className="rounded-3xl border border-white/10 bg-slate-800/60 p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition">
                  <div className="text-xl font-bold">{f.title}</div>
                  <p className="mt-3 text-slate-200 leading-relaxed">{f.body}</p>
                  <ul className="mt-3 text-sm text-slate-300 space-y-1 list-disc list-inside">{f.bullets.map((b)=> <li key={b}>{b}</li>)}</ul>
                  <div className="mt-5"><a href="#" className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl">{f.cta}</a></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Industry-Specific Solutions */}
      <section id="industries" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Industry-Specific Solutions</h2>
            <p className="mt-2 text-slate-300">Tailored certifications for your sector</p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'Healthcare', icon: Stethoscope, grad: 'from-rose-600 to-pink-600' },
              { key: 'Finance & Banking', icon: Landmark, grad: 'from-emerald-600 to-teal-600' },
              { key: 'Technology & Software', icon: Layers, grad: 'from-indigo-600 to-purple-600' },
              { key: 'Government & Public Sector', icon: Building2, grad: 'from-sky-600 to-cyan-600' },
            ].map((i) => (
              <div key={i.key} className="group rounded-2xl border border-white/10 bg-slate-800/50 p-6 shadow-xl transition hover:shadow-2xl hover:-translate-y-0.5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${i.grad} grid place-items-center mb-4`}>
                  <i.icon size={20} />
                </div>
                <div className="text-lg font-semibold">{i.key}</div>
                <ul className="mt-3 text-sm text-slate-300 space-y-1">
                  <li>• Risk and compliance alignment</li>
                  <li>• Role-based tracks and exams</li>
                  <li>• Vendor and model governance</li>
                  <li>• Implementation playbooks</li>
                </ul>
                <div className="mt-6 text-sm text-slate-300">From $XXX</div>
                <BuyButton className="mt-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-indigo-700 via-purple-700 to-emerald-600 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold">Ready to Get Certified?</h3>
            <p className="mt-2 text-slate-100">Join thousands of professionals advancing their careers</p>
            <div className="mt-6">
              <BuyButton className="px-8 py-3 text-base" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
