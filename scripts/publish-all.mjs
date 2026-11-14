
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const root = process.cwd()
const envPath = path.join(root, '.env.local')

// Load .env.local
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([\w]+)\s*=\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const value = match[2]
      .trim()
      .replace(/^["']|["']$/g, '')

    if (!process.env[key]) process.env[key] = value
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
  throw new Error('Missing Sanity project ID or write token')
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
  perspective: 'raw',
})

const publish = process.argv.includes('--publish')
const types = ['brand']
const batchSize = 50

let publishedCount = 0
let failedCount = 0

async function getDrafts(type) {
  return client.fetch(
    `*[
      _type == $type &&
      _id in path("drafts.**")
    ] | order(_id asc) {
      ...,
      "publishedId": string::split(_id, "drafts.")[1]
    }`,
    {type}
  )
}

async function publishDraft(draft) {
  const publishedId = draft._id.replace(/^drafts\./, '')

  const publishedDocument = {...draft}
  publishedDocument._id = publishedId

  delete publishedDocument._rev
  delete publishedDocument._createdAt
  delete publishedDocument._updatedAt
  delete publishedDocument.publishedId

  await client
    .transaction()
    .createOrReplace(publishedDocument)
    .delete(draft._id)
    .commit()
}

for (const type of types) {
  console.log(`\n=== ${type.toUpperCase()} ===`)

  const drafts = await getDrafts(type)

  console.log(`Found ${drafts.length} draft(s)`)

  if (!publish) {
    for (const draft of drafts.slice(0, 10)) {
      console.log(`  - ${draft.name || draft.title || draft._id}`)
    }

    if (drafts.length > 10) {
      console.log(`  ...and ${drafts.length - 10} more`)
    }

    continue
  }

  for (let i = 0; i < drafts.length; i += batchSize) {
    const batch = drafts.slice(i, i + batchSize)

    for (const draft of batch) {
      try {
        await publishDraft(draft)

        console.log(
          `PUBLISHED: ${draft.name || draft.title || draft._id}`
        )

        publishedCount++
      } catch (error) {
        failedCount++

        console.error(
          `FAILED: ${draft._id}`,
          error.message
        )
      }
    }
  }
}

console.log('\n=== SUMMARY ===')

if (!publish) {
  console.log('DRY RUN ONLY — nothing was published.')
  console.log('To publish, run:')
  console.log('node scripts/publish-all.mjs --publish')
} else {
  console.log(`Published: ${publishedCount}`)
  console.log(`Failed: ${failedCount}`)
}

if (failedCount > 0) {
  process.exitCode = 1
}
