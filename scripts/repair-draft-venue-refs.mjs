import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const envFile = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '')
  }
}
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !token) throw new Error('Missing Sanity project ID or write token in .env.local')
const apply = process.argv.includes('--apply')
const client = createClient({projectId,dataset,token,apiVersion:'2025-02-19',useCdn:false,perspective:'raw'})
const docs = await client.fetch('*[_type == "find" && count(locations[_ref match "drafts.*"]) > 0]{_id,title,locations}')
let updates = 0, unresolved = 0
for (const doc of docs) {
  let changed = false
  const locations = []
  for (const ref of doc.locations || []) {
    if (!ref?._ref?.startsWith('drafts.')) {locations.push(ref);continue}
    const publishedId = ref._ref.slice('drafts.'.length)
    const publishedVenue = await client.fetch('*[_id == $id && _type == "venue"][0]{_id,name,location}',{id:publishedId})
    if (!publishedVenue) {
      unresolved++
      console.log('UNRESOLVED:',doc.title,ref._ref,'(publish the venue first)')
      locations.push(ref)
      continue
    }
    changed = true
    console.log('RELINK:',doc.title,ref._ref,'->',publishedId, publishedVenue.location ? '(mapped)' : '(coordinates missing)')
    const {_weak,...rest} = ref
    locations.push({...rest,_ref:publishedId})
  }
  if (changed) {
    updates++
    if (apply) await client.patch(doc._id).set({locations}).commit()
  }
}
console.log(`\n${apply ? 'Updated' : 'Would update'} ${updates} Find documents. Unresolved references: ${unresolved}.`)
if (!apply) console.log('Preview only. To apply: node scripts/repair-draft-venue-refs.mjs --apply')
