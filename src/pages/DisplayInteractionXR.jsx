import React from 'react'

function Section({ title, items }){
  return (
    <section className="pt-10">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4 divide-y rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
        {items.map((it)=>{
          const domain = (()=>{ try { return new URL(it.url).hostname } catch { return it.url } })()
          const logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          return (
            <div key={it.name} className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 min-w-0">
                <img src={logo} alt="logo" className="w-8 h-8 rounded" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{it.name}</div>
                  <div className="text-sm text-gray-600 truncate">{domain}</div>
                </div>
              </div>
              <a href={it.url} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50">Visit</a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function DisplayInteractionXR(){
  const sections = [
    {
      title: 'AR / VR / XR Headsets',
      items: [
        { name: 'Varjo Technologies Oy', url: 'https://varjo.com' },
        { name: 'Samsung Electronics (XR)', url: 'https://www.samsung.com' },
        { name: 'Pimax Innovation Inc.', url: 'https://pimax.com' },
        { name: 'QWR XR', url: 'https://qwxr.in' },
        { name: 'Sightful', url: 'https://www.sightful.com' },
      ],
    },
    {
      title: 'Interactive Displays / Smart Boards',
      items: [
        { name: 'SMART Technologies', url: 'https://www.smarttech.com' },
        { name: 'Samsung Electronics (Displays)', url: 'https://www.samsung.com/displaysolutions' },
        { name: 'Ideum', url: 'https://ideum.com' },
        { name: 'Nanolumens Inc.', url: 'https://nanolumens.com' },
        { name: 'UNV Display', url: 'https://www.unvdisplays.com' },
      ],
    },
    {
      title: 'Haptics & Gesture Devices',
      items: [
        { name: 'Haptikos Inc.', url: 'https://haptikos.com' },
        { name: 'Ultraleap Ltd', url: 'https://www.ultraleap.com' },
        { name: 'SenseGlove B.V.', url: 'https://www.senseglove.com' },
        { name: 'Wearable Devices Ltd.', url: 'https://www.wearabledevices.com' },
        { name: 'Doublepoint Technologies', url: 'https://doublepoint.ai' },
      ],
    },
    {
      title: 'Projection & Visualization Systems',
      items: [
        { name: 'Disguise Ltd', url: 'https://www.disguise.one' },
        { name: 'Igloo Vision', url: 'https://igloovision.com' },
        { name: 'Swave Photonics', url: 'https://swave.io' },
        { name: 'HP Inc. (Dimension)', url: 'https://www.hp.com' },
        { name: 'Morelli Tech', url: 'https://morellitech.com' },
      ],
    },
    {
      title: 'Spatial Computing Hardware',
      items: [
        { name: 'INAIR', url: 'https://inair.tech' },
        { name: 'XGRIDS', url: 'https://xgrids.com' },
        { name: 'Artemis Immersive', url: 'https://www.artemis-immersive.com' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      <section className="relative py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🖥️</div>
          <h1 className="mt-2 text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Display, Interaction & XR</h1>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">Displays, sensors, haptics, and XR interfaces for rich human-computer interaction.</p>
          <p className="mt-1 text-sm text-gray-600 max-w-3xl mx-auto">XR • Haptics • Interfaces</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {sections.map((s)=> (
            <div key={s.title} className="pt-8 border-t first:pt-0 first:border-t-0">
              <Section title={s.title} items={s.items} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
