'use client'

import {useState} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, type ObjectInputProps, useFormValue} from 'sanity'

type Result={label:string;lat:number;lng:number}
export default function VenueGeocodeInput(props:ObjectInputProps) {
  const name=useFormValue(['name'])
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
  return <Stack space={3}>
    {props.renderDefault(props)}
    <Card padding={3} radius={2} border>
      <Stack space={3}>
        <Text size={1} weight="semibold">Find coordinates from address</Text>
        <Text size={1} muted>{street?fullAddress:'Enter the venue street address above first.'}</Text>
        <Button text={loading?'Searching…':'Find coordinates'} tone="primary" mode="ghost" disabled={!street||loading} onClick={lookup}/>
        {error&&<Text size={1} tone="critical">{error}</Text>}
        {results.length>0&&<Stack space={2}>
          <Text size={1}>Select the correct match before saving:</Text>
          {results.map((result,index)=><Card key={index} padding={2} border radius={2}>
            <Flex align="center" gap={2}>
              <Stack flex={1} space={1}><Text size={1}>{result.label}</Text><Text size={0} muted>{result.lat.toFixed(6)}, {result.lng.toFixed(6)}</Text></Stack>
              <Button text="Use" mode="ghost" onClick={()=>choose(result)}/>
            </Flex>
          </Card>)}
        </Stack>}
        <Text size={0} muted>Powered by OpenStreetMap Nominatim. Review the address match. Manual coordinates remain editable. This tool is for occasional venue edits, not bulk imports.</Text>
      </Stack>
    </Card>
  </Stack>
}
