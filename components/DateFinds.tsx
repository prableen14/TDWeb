'use client'

import {useMemo} from 'react'
import Link from 'next/link'
import FindCard, {type FindCardData} from '@/components/FindCard'

export type TimedFind = FindCardData & {endDate?:string; admissionType?:string}
function torontoDate(date:Date):string {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date)
  const part=(type:string)=>parts.find(p=>p.type===type)?.value||''
  return part('year')+'-'+part('month')+'-'+part('day')
}
function addDays(day:string,days:number):string {
  const date=new Date(day+'T12:00:00Z')
  date.setUTCDate(date.getUTCDate()+days)
  return date.toISOString().slice(0,10)
}
function weekendRange(today:string) {
  const day=new Date(today+'T12:00:00Z').getUTCDay()
  const untilFriday=(5-day+7)%7
  return {start:addDays(today,untilFriday),end:addDays(today,untilFriday+2)}
}
function overlaps(find:TimedFind,start:string,end:string) {
  if(!find.startDate) return false
  const begins=torontoDate(new Date(find.startDate))
  const finishes=find.endDate ? torontoDate(new Date(find.endDate)) : begins
  return begins<=end && finishes>=start
}
export default function DateFinds({finds,mode}:{finds:TimedFind[];mode:'today'|'weekend'}) {
  const today=torontoDate(new Date())
  const range=mode==='today'?{start:today,end:today}:weekendRange(today)
  const filtered=useMemo(()=>finds.filter(find=>
    (mode!=='today'||find.isFree===true||find.admissionType==='free') &&
    overlaps(find,range.start,range.end)
  ).sort((a,b)=>(a.startDate||'').localeCompare(b.startDate||'')),[finds,mode,range.start,range.end])
  const heading=mode==='today'?'Free Today in Toronto & GTA':'This Weekend in Toronto & GTA'
  const display=new Intl.DateTimeFormat('en-CA',{timeZone:'UTC',month:'short',day:'numeric'})
  const dates=range.start===range.end?display.format(new Date(range.start+'T12:00:00Z')):display.format(new Date(range.start+'T12:00:00Z'))+' – '+display.format(new Date(range.end+'T12:00:00Z'))
  return <main className="min-h-screen bg-[#faf9f6] px-6 py-16 text-black">
    <div className="mx-auto max-w-7xl">
      <Link href="/" className="text-sm font-semibold text-black/60 hover:underline">← Back to home</Link>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight md:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-3xl text-lg text-black/60">{mode==='today'?'Freebies, giveaways and free experiences happening today.':'Events, pop-ups, offers and experiences happening this coming Friday through Sunday.'}</p>
      <p className="mt-3 text-sm font-semibold">📅 {dates} · Toronto local dates</p>
      <p className="mt-2 text-xs text-black/50">Only listings with published start dates are shown. Always check official details before visiting.</p>
      {filtered.length?<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(find=><FindCard key={find._id} find={find}/>)}</div>:
      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-10"><h2 className="text-xl font-bold">No matching Finds yet</h2><p className="mt-2 text-black/60">We haven't added any dated listings for this period. Browse all Finds or check again later.</p><Link href="/finds" className="mt-4 inline-block font-semibold underline">Browse all Finds</Link></div>}
    </div>
  </main>
}
