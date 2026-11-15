
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const root = process.cwd()

// Load environment variables from .env.local
const envPath = path.join(root, '.env.local')

if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8')

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([\w]+)\s*=\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const value = match[2]
      .trim()
      .replace(/^["']|["']$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  'production'

const token = process.env.SANITY_API_WRITE_TOKEN

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
  perspective: 'raw',
})

const jsonPath = path.resolve(root, process.argv[2] || 'data/finds.json')

const input = JSON.parse(
  fs.readFileSync(jsonPath, 'utf8')
)

if (!Array.isArray(input.finds)) {
  throw new Error('finds.json must contain a finds array')
}

// Find an existing published or draft document by slug
async function findReference(type, slug) {
  if (!slug) return null

  const results = await client.fetch(
    `*[
      _type == $type &&
      slug.current == $slug
    ][0...10]._id`,
    {type, slug}
  )

  const published = results.find(
    (id) => !id.startsWith('drafts.')
  )

  return published || results[0] || null
}

// Convert plain text into Sanity Portable Text
function toPortableText(value) {
  if (!value) return undefined

  if (Array.isArray(value)) return value

  return String(value)
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: 'block',
      _key: `paragraph-${index}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `text-${index}`,
          text: paragraph.trim(),
          marks: [],
        },
      ],
    }))
}

function optionalString(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : undefined
}

let created = 0
let skipped = 0
let failed = 0

for (const find of input.finds) {
  try {
    if (!find.title || !find.slug || !find.type) {
      throw new Error('Missing title, slug, or type')
    }

    const existing = await findReference(
      'find',
      find.slug
    )

    if (existing) {
      console.log(`SKIPPED: ${find.title}`)
      skipped++
      continue
    }

    // Connect existing Brand
    let brandReference

    if (find.brand) {
      const brandId = await findReference(
        'brand',
        find.brand
      )

      if (!brandId) {
        throw new Error(
          `Brand not found: ${find.brand}`
        )
      }

      brandReference = {
        _type: 'reference',
        _ref: brandId,
        ...(
          brandId.startsWith('drafts.')
            ? {_weak: true}
            : {}
        ),
      }
    }

    // Connect existing Venues
    const locations = []

    for (const venueSlug of find.locations || []) {
      const venueId = await findReference(
        'venue',
        venueSlug
      )

      if (!venueId || venueId.startsWith('drafts.')) {
        throw new Error(
          `Venue must be published before importing Find: ${venueSlug}`
        )
      }

      locations.push({
        _key: `venue-${locations.length}`,
        _type: 'reference',
        _ref: venueId,
        ...(
          venueId.startsWith('drafts.')
            ? {_weak: true}
            : {}
        ),
      })
    }

    const document = {
      _id: `drafts.find-${find.slug}`,
      _type: 'find',

      title: find.title,
      slug: {
        _type: 'slug',
        current: find.slug,
      },

      type: find.type,
      tags: find.tags || [],
      summary: optionalString(find.summary),

      brand: brandReference,
      locations,

      startDate: find.startDate || undefined,
      endDate: find.endDate || undefined,

      isFree: find.isFree === true,
      price: optionalString(find.price),

      admissionType: optionalString(
        find.admissionType
      ),
      bookingType: optionalString(
        find.bookingType
      ),
      featured: find.featured === true,

      description: toPortableText(
        find.description
      ),

      howToClaim: optionalString(
        find.howToClaim
      ),
      restrictions: optionalString(
        find.restrictions
      ),
      sourceUrl: optionalString(
        find.sourceUrl
      ),
    }

    await client.createIfNotExists(document)

    console.log(`CREATED: ${find.title}`)
    created++
  } catch (error) {
    console.error(
      `FAILED: ${find.title || 'Unknown Find'}`,
      error.message
    )
    failed++
  }
}

console.log('\nImport complete!')
console.log(`Created: ${created}`)
console.log(`Skipped: ${skipped}`)
console.log(`Failed: ${failed}`)

if (failed > 0) {
  process.exitCode = 1
}
