export default function ContactSection(){
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900">Contact Us</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">Have questions or want a guided walkthrough? Send us a message and our team will get back within 1 business day.</p>
        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700">Full name</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="jane@company.com" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Message</label>
            <textarea rows={5} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Tell us how we can help" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold">Send message</button>
          </div>
        </form>
      </div>
    </section>
  )
}

