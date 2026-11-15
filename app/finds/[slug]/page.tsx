import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {sanityClient} from '@/sanity/lib/sanity'

type TextSpan = {_key?: string; _type: string; text?: string; marks?: string[]}
type DescriptionBlock = {_key?: string; _type: string; style?: string; children?: TextSpan[]}
type Venue = {name?: string; address?: string; neighbourhood?: string; city?: string; province?: string}
type Find = {
  title: string
  slug: string
  type?: string
  summary?: string
  description?: DescriptionBlock[]
  isFree?: boolean
  price?: string
  admissionType?: string
  bookingType?: string
  startDate?: string
  endDate?: string
  imageUrl?: string
  imageAlt?: string
  brand?: string
  locations?: (Venue | null)[]
  howToClaim?: string
  restrictions?: string
  sourceUrl?: string
  tags?: string[]
}

const findQuery = `*[_type == "find" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  type,
  summary,
  description,
  isFree,
  price,
  admissionType,
  bookingType,
  startDate,
  endDate,
  "imageUrl": coalesce(image.asset->url, brand->image.asset->url, locations[0]->image.asset->url),
  "imageAlt": select(defined(image.asset) => image.alt, defined(brand->image.asset) => brand->image.alt, defined(locations[0]->image.asset) => locations[0]->image.alt, null),
  "brand": brand->name,
  "locations": locations[]->{name, address, neighbourhood, city, province},
  howToClaim,
  restrictions,
  sourceUrl,
  tags
}`

const categoryNames: Record<string, string> = {
  freebie: 'Freebies',
  deal: 'Deals',
  event: 'Events',
  food: 'Food & Drinks',
  'things-to-do': 'Things To Do',
}
const categoryPaths: Record<string, string> = {
  freebie: '/freebies',
  deal: '/deals',
  event: '/events',
  food: '/food',
  'things-to-do': '/things-to-do',
}
const bookingNames: Record<string, string> = {
  'walk-in': 'Walk-in',
  rsvp: 'RSVP required',
  tickets: 'Tickets required',
}
const admissionNames: Record<string, string> = {
  free: 'Free',
  paid: 'Paid',
  'free-with-purchase': 'Free with purchase',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function Description({blocks}: {blocks: DescriptionBlock[]}) {
  return (
    <div className="space-y-4 text-base leading-8 text-black/75">
      {blocks.filter((block) => block._type === 'block').map((block, index) => {
        const children = (block.children || []).map((span, spanIndex) => {
          let node: React.ReactNode = span.text || ''
          if (span.marks?.includes('strong')) node = <strong>{node}</strong>
          if (span.marks?.includes('em')) node = <em>{node}</em>
          return <span key={span._key || spanIndex}>{node}</span>
        })
        if (block.style === 'h2') return <h2 key={block._key || index} className="text-2xl font-bold text-black">{children}</h2>
        if (block.style === 'h3') return <h3 key={block._key || index} className="text-xl font-bold text-black">{children}</h3>
        return <p key={block._key || index}>{children}</p>
      })}
    </div>
  )
}

async function getFind(slug: string) {
  return sanityClient.fetch<Find | null>(findQuery, {slug})
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params
  const find = await getFind(slug)
  if (!find) return {title: 'Find not found | Toronto Finds'}
  return {
    title: `${find.title} | Toronto Finds`,
    description: find.summary || `Explore ${find.title} in Toronto and the GTA.`,
  }
}


export default async function FindDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const find = await getFind(slug)
  if (!find) notFound()

  const categoryName = categoryNames[find.type || ''] || 'Finds'
  const categoryPath = categoryPaths[find.type || ''] || '/'
  const isFree = find.isFree || find.admissionType === 'free'
  const validSource = find.sourceUrl && /^https?:\/\//i.test(find.sourceUrl) ? find.sourceUrl : null

  return (
    <main className="min-h-screen bg-[#faf9f6] text-black">
      <article className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:pt-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-black/60">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href={categoryPath} className="hover:underline">{categoryName}</Link>
        </nav>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-black/10">{categoryName}</span>
          {isFree && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">FREE</span>}
          {find.tags?.map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs text-black/65 ring-1 ring-black/10">{tag.replaceAll('-', ' ')}</span>)}
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{find.title}</h1>
        {find.brand && <p className="mt-3 text-sm font-semibold text-black/55">By {find.brand}</p>}
        {find.summary && <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65">{find.summary}</p>}

        <div className="mt-10 overflow-hidden rounded-3xl bg-neutral-100">
          {find.imageUrl ? (
            <img src={find.imageUrl} alt={find.imageAlt || find.title} className="max-h-[560px] w-full object-cover" />
          ) : (
            <div className="flex aspect-[16/7] items-center justify-center text-7xl" aria-label="No image available">
              {find.type === 'freebie' ? '🎁' : find.type === 'deal' ? '💰' : find.type === 'event' ? '📅' : find.type === 'food' ? '🍜' : '✨'}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            {find.description && find.description.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold">About this Find</h2>
                <Description blocks={find.description} />
              </section>
            )}

            {find.howToClaim && (
              <section>
                <h2 className="mb-4 text-2xl font-bold">How to claim or attend</h2>
                <p className="whitespace-pre-line leading-8 text-black/75">{find.howToClaim}</p>
              </section>
            )}

            {find.restrictions && (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Important details</h2>
                <p className="whitespace-pre-line leading-8 text-black/75">{find.restrictions}</p>
              </section>
            )}

            {find.locations?.some((venue) => venue != null) && (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Location{find.locations.filter((venue) => venue != null).length > 1 ? 's' : ''}</h2>
                <div className="space-y-3">
                  {find.locations.filter((venue): venue is Venue => venue != null).map((venue, index) => (
                    <div key={index} className="rounded-2xl border border-black/10 bg-white p-5">
                      <h3 className="font-semibold">{venue.name || 'Venue'}</h3>
                      <p className="mt-1 text-sm text-black/60">
                        {[venue.address, venue.neighbourhood, venue.city, venue.province].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">At a glance</h2>
            <dl className="mt-5 space-y-5 text-sm">
              {(find.startDate || find.endDate) && (
                <div>
                  <dt className="font-semibold">📅 When</dt>
                  {find.startDate && <dd className="mt-1 text-black/65">Starts: {formatDate(find.startDate)}</dd>}
                  {find.endDate && <dd className="mt-1 text-black/65">Ends: {formatDate(find.endDate)}</dd>}
                  <dd className="mt-1 text-xs text-black/45">Toronto time</dd>
                </div>
              )}
              {(isFree || find.price || find.admissionType) && (
                <div>
                  <dt className="font-semibold">💰 Admission / price</dt>
                  <dd className="mt-1 text-black/65">{isFree ? 'Free' : find.price || admissionNames[find.admissionType || ''] || 'See official details'}</dd>
                </div>
              )}
              {find.bookingType && (
                <div>
                  <dt className="font-semibold">🎟️ Booking</dt>
                  <dd className="mt-1 text-black/65">{bookingNames[find.bookingType] || find.bookingType}</dd>
                </div>
              )}
            </dl>
            {validSource && (
              <a href={validSource} target="_blank" rel="noopener noreferrer" className="mt-7 block rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-black/80">
                View official details ↗
              </a>
            )}
          </aside>
        </div>

        <Link href={categoryPath} className="mt-14 inline-block text-sm font-semibold hover:underline">← More {categoryName}</Link>
      </article>
    </main>
  )
}
