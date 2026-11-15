'use client'

import {useEffect, useRef} from 'react'

export type MapMarker = {key: string; lat: number; lng: number; title: string; category: string}
type LeafletMap = {remove:()=>void;fitBounds:(bounds:unknown,options?:unknown)=>void;setView:(coords:[number,number],zoom:number)=>void}
type LeafletMarker = {addTo:(map:LeafletMap)=>LeafletMarker;on:(event:string,fn:()=>void)=>LeafletMarker;bindTooltip:(text:string)=>LeafletMarker;openTooltip:()=>void}
type LeafletApi = {
  map:(element:HTMLElement,options:unknown)=>LeafletMap
  tileLayer:(url:string,options:unknown)=>{addTo:(map:LeafletMap)=>void}
  circleMarker:(coords:[number,number],options:unknown)=>LeafletMarker
  latLngBounds:(coords:[number,number][])=>unknown
}
declare global {interface Window {L?: LeafletApi}}
let leafletPromise: Promise<LeafletApi> | null = null
function loadLeaflet(): Promise<LeafletApi> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Map requires a browser'))
  if (window.L) return Promise.resolve(window.L)
  if (leafletPromise) return leafletPromise
  leafletPromise = new Promise((resolve,reject)=>{
    if (!document.querySelector('link[data-tf-leaflet]')) {
      const link=document.createElement('link')
      link.rel='stylesheet'
      link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.setAttribute('data-tf-leaflet','')
      document.head.appendChild(link)
    }
    const script=document.createElement('script')
    script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async=true
    script.onload=()=>window.L ? resolve(window.L) : reject(new Error('Map library unavailable'))
    script.onerror=()=>reject(new Error('Unable to load map library'))
    document.head.appendChild(script)
  }).catch(error=>{leafletPromise=null;throw error})
  return leafletPromise
}
type Props = {markers:MapMarker[];center:{lat:number;lng:number};selectedKey:string|null;onSelect:(key:string)=>void}
export default function NearMeMap({markers,center,selectedKey,onSelect}:Props) {
  const element=useRef<HTMLDivElement>(null)
  const map=useRef<LeafletMap|null>(null)
  const api=useRef<LeafletApi|null>(null)
  const drawn=useRef<LeafletMarker[]>([])
  const onSelectRef=useRef(onSelect)
  const [error,setError]=useStateSafe('')
  onSelectRef.current=onSelect

  useEffect(()=>{
    let cancelled=false
    loadLeaflet().then(L=>{
      if (cancelled || !element.current || map.current) return
      api.current=L
      const instance=L.map(element.current,{scrollWheelZoom:false})
      map.current=instance
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; OpenStreetMap contributors',maxZoom:19,
      }).addTo(instance)
      instance.setView([center.lat,center.lng],12)
      renderMarkers()
    }).catch(()=>{if(!cancelled)setError('Interactive map could not load. Nearby results are still available in the list.')})
    return ()=>{cancelled=true;map.current?.remove();map.current=null;api.current=null;drawn.current=[]}
    // Initialize map only once; subsequent updates handled in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function renderMarkers() {
    const L=api.current, instance=map.current
    if (!L || !instance) return
    for (const marker of drawn.current) (marker as unknown as {remove:()=>void}).remove()
    drawn.current=[]
    for (const item of markers) {
      const selected=item.key===selectedKey
      const marker=L.circleMarker([item.lat,item.lng],{
        radius:selected?12:9,color:'#111827',weight:2,fillColor:selected?'#f59e0b':'#ffcf33',fillOpacity:1,
      }).addTo(instance).bindTooltip(item.title)
      marker.on('click',()=>onSelectRef.current(item.key))
      if (selected) marker.openTooltip()
      drawn.current.push(marker)
    }
    if (markers.length) {
      const bounds=L.latLngBounds(markers.map(m=>[m.lat,m.lng] as [number,number]))
      instance.fitBounds(bounds,{padding:[30,30],maxZoom:14})
    } else instance.setView([center.lat,center.lng],12)
  }
  useEffect(()=>{renderMarkers()
    // Render after markers, center, or selected item changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[markers,center.lat,center.lng,selectedKey])
  return <div className="relative">
    <div ref={element} className="h-[440px] w-full bg-[#eae8df]" aria-label="Interactive map of nearby Finds" role="region"/>
    {error && <p role="status" className="p-4 text-sm">{error}</p>}
  </div>
}
// State wrapper keeps the map's external library lifecycle isolated.
import {useState} from 'react'
function useStateSafe(initial:string){return useState(initial)}
