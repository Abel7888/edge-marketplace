export default function AboutUs(){
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900">About Us</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">EmergingTech Hub is a marketplace connecting buyers with vetted emerging technology vendors and development firms. We simplify discovery, evaluation, and procurement with verified profiles, rich comparisons, and streamlined request workflows.</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-4">
            <div className="text-2xl font-bold text-slate-900">270+</div>
            <div className="text-sm text-gray-600">Verified vendors</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-2xl font-bold text-slate-900">500+</div>
            <div className="text-sm text-gray-600">Enterprise clients</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-2xl font-bold text-slate-900">97%</div>
            <div className="text-sm text-gray-600">Satisfaction score</div>
          </div>
        </div>
      </div>
    </section>
  )
}

