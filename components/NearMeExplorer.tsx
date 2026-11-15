'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'
import NearMeMap from './NearMeMap'

type Venue = {name?: string; address?: string; city?: string; neighbourhood?: string; lat?: number; lng?: number}
export type NearbyFind = {
  _id: string; title: string; slug: string; type?: string; summary?: string
  isFree?: boolean; price?: string; startDate?: string; endDate?: string; imageUrl?: string; imageAlt?: string; venues?: (Venue | null)[]
}
type Point = {lat: number; lng: number}
type Match = {find: NearbyFind; venue: Venue; distance: number; key: string}
const presets: Record<string, Point> = {
  'Downtown Toronto': {lat: 43.6532, lng: -79.3832},
  'North York': {lat: 43.7615, lng: -79.4111},
  Scarborough: {lat: 43.7764, lng: -79.2318},
  Etobicoke: {lat: 43.6205, lng: -79.5132},
  Mississauga: {lat: 43.5890, lng: -79.6441},
  Brampton: {lat: 43.7315, lng: -79.7624},
  Vaughan: {lat: 43.8361, lng: -79.4983},
  Markham: {lat: 43.8561, lng: -79.3370},
  Ajax: {lat: 43.8509, lng: -79.0204},
  Oakville: {lat: 43.4675, lng: -79.6877},
}
const categoryLabels: Record<string,string> = {
  all: 'All Finds', freebie: 'Freebies', deal: 'Deals', event: 'Events',
  food: 'Food & Drinks', 'things-to-do': 'Things To Do',
}
function distanceKm(a: Point, b: Point) {
  const radians = (n: number) => n * Math.PI / 180
  const dLat = radians(b.lat - a.lat)
  const dLng = radians(b.lng - a.lng)
  const h = Math.sin(dLat/2)**2 + Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLng/2)**2
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))
}
export default function NearMeExplorer({finds}: {finds: NearbyFind[]}) {
  const [origin, setOrigin] = useState<Point>(presets['Downtown Toronto'])
  const [area, setArea] = useState('Downtown Toronto')
  const [radius, setRadius] = useState(10)
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('')
  const [locating, setLocating] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const matches = useMemo(() => {
    const rows: Match[] = []
    for (const find of finds) {
      if (category !== 'all' && find.type !== category) continue
      for (const [index,venue] of (find.venues || []).entries()) {
        if (!venue || typeof venue.lat !== 'number' || typeof venue.lng !== 'number') continue
        const distance = distanceKm(origin,{lat:venue.lat,lng:venue.lng})
        if (distance <= radius) rows.push({find,venue,distance,key:find._id+':'+index})
      }
    }
    return rows.sort((a,b)=>a.distance-b.distance)
  },[finds,origin,radius,category])

  const active = matches.find(m=>m.key===selected) || matches[0]
  const markers = useMemo(() => matches.map(m => ({key:m.key,lat:m.venue.lat!,lng:m.venue.lng!,title:m.find.title,category:m.find.type||''})),[matches])

  function locate() {
    if (!navigator.geolocation) {setStatus('Your browser does not support location access. Choose an area instead.');return}
    setLocating(true)
    setStatus('')
    navigator.geolocation.getCurrentPosition(
      pos=>{setOrigin({lat:pos.coords.latitude,lng:pos.coords.longitude});setArea('My location');setSelected(null);setLocating(false);setStatus('Showing Finds near your current location.')},
      ()=>{setLocating(false);setStatus('Location unavailable or permission denied. You can choose a GTA area instead.')},
      {enableHighAccuracy:false,timeout:12000,maximumAge:300000},
    )
  }
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 text-black md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-widest text-black/50">Toronto & the GTA</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Finds Near Me</h1>
        <p className="mt-4 max-w-2xl text-black/65">Discover real freebies, deals, events and activities near you. Pick a GTA area or share your location to sort by distance.</p>
        <div className="mt-7 flex flex-wrap items-end gap-3 rounded-2xl border border-black/10 bg-white p-5">
          <button onClick={locate} disabled={locating} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{locating?'Finding location…':'📍 Use my location'}</button>
          <label className="flex flex-col gap-1 text-sm font-semibold">Explore an area
            <select value={area} onChange={e=>{const name=e.target.value;setArea(name);setOrigin(presets[name]);setSelected(null);setStatus('')}} className="rounded-xl border border-black/15 bg-white px-3 py-2.5">
              {area==='My location' && <option value="My location">My location</option>}
              {Object.keys(presets).map(name=><option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Within
            <select value={radius} onChange={e=>{setRadius(Number(e.target.value));setSelected(null)}} className="rounded-xl border border-black/15 bg-white px-3 py-2.5">
              {[2,5,10,20,50].map(n=><option key={n} value={n}>{n} km</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Category
            <select value={category} onChange={e=>{setCategory(e.target.value);setSelected(null)}} className="rounded-xl border border-black/15 bg-white px-3 py-2.5">
              {Object.entries(categoryLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        {status && <p role="status" className="mt-3 text-sm text-black/70">{status}</p>}
        <p className="mt-3 text-xs text-black/50">Your precise location stays in your browser and is not sent to Toronto Finds. Location access requires HTTPS or localhost.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section aria-label="Nearby results" className="min-w-0">
            <h2 className="mb-4 text-xl font-bold">{matches.length} nearby {matches.length===1?'location':'locations'}</h2>
            {matches.length===0 ? <div className="rounded-2xl border border-black/10 bg-white p-8"><h3 className="font-bold">No mapped Finds in this area yet</h3><p className="mt-2 text-sm text-black/60">Try a wider radius or another GTA area. Finds appear here when their Sanity venue has a map location.</p><Link href="/finds" className="mt-4 inline-block font-semibold underline">Browse all Finds</Link></div> :
              <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
                {matches.map(match=><div key={match.key} className={'w-full rounded-2xl border bg-white p-5 text-left transition hover:border-black/50 '+(active?.key===match.key?'border-black shadow-sm':'border-black/10')}>
                  <div className="flex justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-black/50">{categoryLabels[match.find.type||'']||'Find'}</span><span className="text-sm font-semibold">{match.distance.toFixed(1)} km</span></div>
                  {match.find.imageUrl && <img src={match.find.imageUrl} alt={match.find.imageAlt || match.find.title} loading="lazy" className="mt-3 h-36 w-full rounded-lg object-cover" />}<h3 className="mt-2 text-lg font-bold">{match.find.title}</h3>
                  <p className="mt-1 text-sm text-black/60">{[match.venue.name,match.venue.neighbourhood,match.venue.city].filter(Boolean).join(' · ')}</p>
                  {match.find.summary && <p className="mt-2 line-clamp-2 text-sm text-black/65">{match.find.summary}</p>}
                  <Link href={'/finds/'+encodeURIComponent(match.find.slug)} className="mt-3 inline-block text-sm font-bold underline">View details</Link><button type="button" onClick={()=>setSelected(match.key)} className="ml-4 text-sm font-bold underline">Show on map</button>
                </div>)}
              </div>}
          </section>
          <section aria-label="Map" className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <NearMeMap markers={markers} center={origin} selectedKey={active?.key||null} onSelect={setSelected} />
              <div className="p-4">
                <p className="text-sm font-semibold">{active ? active.find.title : 'Map centred on '+area}</p>
                <p className="mt-1 text-xs text-black/60">{active ? [active.venue.address,active.venue.city].filter(Boolean).join(', ') : 'Select a nearby Find to see its location.'}</p>

              </div>
            </div>
            <p className="mt-2 text-xs text-black/50">Map data © OpenStreetMap contributors. Tap any map marker to select a Find.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
