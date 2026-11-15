import {NextResponse} from 'next/server'

// This endpoint is for occasional, user-triggered Studio lookups only.
// Public Nominatim is not intended for autocomplete or bulk geocoding.
const cache = new Map<string,{expires:number;results:unknown[]}>()
let lastRequest = 0
export async function POST(request:Request) {
  const origin=request.headers.get('origin')
  const host=request.headers.get('host')
  if (origin && host) {
    try {if(new URL(origin).host!==host) return NextResponse.json({error:'Invalid origin'},{status:403})}
    catch{return NextResponse.json({error:'Invalid origin'},{status:403})}
  }
  let body: {address?:unknown}
  try {body=await request.json()} catch {return NextResponse.json({error:'Invalid request'},{status:400})}
  const address=typeof body.address==='string'?body.address.trim():''
  if(address.length<8 || address.length>250) return NextResponse.json({error:'Enter a full street address (8–250 characters).'},{status:400})
  const key=address.toLowerCase()
  const existing=cache.get(key)
  if(existing && existing.expires>Date.now()) return NextResponse.json({results:existing.results})
  // Best-effort per-instance throttle; serverless deployments need centralized rate limiting.
  if(Date.now()-lastRequest<1200) return NextResponse.json({error:'Please wait a moment before trying again.'},{status:429})
  lastRequest=Date.now()
  const params=new URLSearchParams({q:address,format:'jsonv2',addressdetails:'1',limit:'5',countrycodes:'ca'})
  try {
    const response=await fetch('https://nominatim.openstreetmap.org/search?'+params.toString(),{
      headers:{'User-Agent':'TorontoFindsVenueEditor/1.0 (https://torontofinds.com)','Accept':'application/json','Accept-Language':'en'},
      cache:'no-store',signal:AbortSignal.timeout(10000),
    })
    if(!response.ok) return NextResponse.json({error:'Geocoding service unavailable. Try again later.'},{status:503})
    const data:unknown=await response.json()
    const results=Array.isArray(data)?data.filter((v):v is Record<string,unknown>=>v!==null && typeof v==='object').map(v=>({
      label:String(v.display_name||''),
      lat:Number(v.lat),lng:Number(v.lon),
    })).filter(v=>Number.isFinite(v.lat)&&Number.isFinite(v.lng)):[]
    if(cache.size>500) cache.clear()
    cache.set(key,{expires:Date.now()+86400000,results})
    return NextResponse.json({results})
  }catch{return NextResponse.json({error:'Geocoding lookup failed. Try again later.'},{status:503})}
}
