
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const root = process.cwd()
const envText = fs.readFileSync(
  path.join(root, '.env.local'),
  'utf8'
)

function getEnv(key) {
  const line = envText.split(/\r?\n/).find(
    (line) => line.trim().startsWith(`${key}=`)
  )
  return line
    ? line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')
    : process.env[key]
}

const projectId =
  getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID') ||
  getEnv('SANITY_STUDIO_PROJECT_ID')

const dataset =
  getEnv('NEXT_PUBLIC_SANITY_DATASET') ||
  getEnv('SANITY_STUDIO_DATASET') ||
  'production'

const token = getEnv('SANITY_API_WRITE_TOKEN')

if (!projectId || !token) {
  throw new Error('Missing project ID or write token')
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
})

const {venues} = JSON.parse(
  fs.readFileSync(path.join(root, 'data', 'venues.json'), 'utf8')
)

if (!Array.isArray(venues)) {
  throw new Error('venues.json must contain a venues array')
}

for (const venue of venues) {
  if (!venue.name || !venue.slug) {
    console.log('Skipping incomplete venue:', venue)
    continue
  }

  const existing = await client.fetch(
    `*[_type == "venue" && slug.current == $slug][0]._id`,
    {slug: venue.slug},
    {perspective: 'raw'}
  )

  if (existing) {
    console.log(`Already exists: ${venue.name}`)
    continue
  }

  const document = {
    _id: `drafts.venue-${venue.slug}`,
    _type: 'venue',
    name: venue.name,
    slug: {
      _type: 'slug',
      current: venue.slug,
    },
    address: venue.address,
    neighbourhood: venue.neighbourhood,
    city: venue.city || 'Toronto',
    province: venue.province || 'Ontario',
    ...(venue.postalCode
      ? {postalCode: venue.postalCode}
      : {}),
    ...(venue.latitude != null && venue.longitude != null
      ? {
          location: {
            _type: 'geopoint',
            lat: venue.latitude,
            lng: venue.longitude,
          },
        }
      : {}),
  }

  await client.createIfNotExists(document)
  console.log(`Created draft: ${venue.name}`)
}

console.log('Venue import finished!')
