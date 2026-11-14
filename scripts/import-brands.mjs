
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const root = process.cwd()

// Read the private environment variables
const envPath = path.join(root, '.env.local')
const envText = fs.readFileSync(envPath, 'utf8')

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
  throw new Error(
    'Missing Sanity project ID or write token in .env.local'
  )
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
})

const file = path.join(root, 'data', 'brands.json')
const {brands} = JSON.parse(fs.readFileSync(file, 'utf8'))

if (!Array.isArray(brands)) {
  throw new Error('brands.json must contain a brands array')
}

for (const brand of brands) {
  if (!brand.name || !brand.slug) {
    console.log('Skipping incomplete brand:', brand)
    continue
  }

  const slug = brand.slug

  // Reuse existing brands, including published documents
  const existing = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]._id`,
    {slug},
    {perspective: 'raw'}
  )

  if (existing) {
    console.log(`Already exists: ${brand.name}`)
    continue
  }

  // Create as a draft so nothing goes live automatically
  const id = `drafts.brand-${slug}`

  await client.createIfNotExists({
    _id: id,
    _type: 'brand',
    name: brand.name,
    slug: {
      _type: 'slug',
      current: slug,
    },
    ...(brand.website ? {website: brand.website} : {}),
  })

  console.log(`Created draft: ${brand.name}`)
}

console.log('Brand import finished!')
