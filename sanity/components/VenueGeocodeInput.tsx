'use client'

import {useState} from 'react'
import {PatchEvent, set, type ObjectInputProps, useFormValue} from 'sanity'

type Result={label:string;lat:number;lng:number}
export default function VenueGeocodeInput(props:ObjectInputProps) {
  const address=useFormValue(['address'])
  const city=useFormValue(['city'])
  const province=useFormValue(['province'])
  const postalCode=useFormValue(['postalCode'])
  const [results,setResults]=useState<Result[]>([])
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const street=typeof address==='string'?address.trim():''
  const fullAddress=[street,typeof city==='string'?city:'Toronto',typeof province==='string'?province:'Ontario',typeof postalCode==='string'?postalCode:'','Canada'].filter(Boolean).join(', ')

  async function lookup(){
    setLoading(true);setError('');setResults([])
    try {
      const response=await fetch('/api/geocode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({address:fullAddress})})
      const payload: {results?:Result[];error?:string}=await response.json()
      if(!response.ok) throw new Error(payload.error||'Lookup failed')
      if(!payload.results?.length) setError('No matching addresses found. Check the street address or enter coordinates manually.')
      else setResults(payload.results)
    } catch(e){setError(e instanceof Error?e.message:'Unable to find address')}
    finally{setLoading(false)}
  }
  function choose(result:Result) {
    props.onChange(PatchEvent.from(set({_type:'geopoint',lat:result.lat,lng:result.lng})))
    setResults([])
    setError('')
  }
  return <div style={{display:'grid',gap:12}}>
    {props.renderDefault(props)}
    <div style={{padding:14,border:'1px solid #ccc',borderRadius:6,display:'grid',gap:10}}>
      <strong>Find coordinates from address</strong>
      <p style={{fontSize:13,margin:0}}>{street?fullAddress:'Enter the venue street address above first.'}</p>
      <button type="button" disabled={!street||loading} onClick={lookup} style={{padding:10,borderRadius:6,border:'1px solid #999',cursor:'pointer'}}>
        {loading?'Searching…':'Find coordinates'}
      </button>
      {error&&<p role="alert" style={{color:'#b91c1c',fontSize:13}}>{error}</p>}
      {results.length>0&&<div style={{display:'grid',gap:8}}>
        <strong style={{fontSize:13}}>Select the correct match:</strong>
        {results.map((result,index)=><div key={index} style={{border:'1px solid #ccc',padding:10,borderRadius:6,display:'flex',alignItems:'center',gap:12}}>
          <div style={{flex:1,fontSize:13}}>{result.label}<div style={{color:'#666'}}>{result.lat.toFixed(6)}, {result.lng.toFixed(6)}</div></div>
          <button type="button" onClick={()=>choose(result)} style={{padding:8,border:'1px solid #999',borderRadius:5}}>Use</button>
        </div>)}
      </div>}
      <small style={{color:'#666'}}>OpenStreetMap Nominatim address lookup. Review the match before saving. Manual coordinates remain editable. Not intended for bulk imports.</small>
    </div>
  </div>
}
