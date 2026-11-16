
import Link from 'next/link'
import FindCard from '@/components/FindCard'
import {sanityClient} from '@/sanity/lib/sanity'

type Find = {
  _id: string
  title: string
  slug: string
  type: string
  summary?: string
  isFree?: boolean
  price?: string
  startDate?: string
  imageUrl?: string
  imageAlt?: string
  brandLogoUrl?: string
  brandName?: string
  venue?: string
  endDate?: string
  featured?: boolean
}

const categories = [
  {name: 'Freebies', emoji: '🎁', href: '/freebies'},
  {name: 'Deals', emoji: '💰', href: '/deals'},
  {name: 'Events', emoji: '📅', href: '/events'},
  {name: 'Food & Drinks', emoji: '🍜', href: '/food'},
  {name: 'Pop-Ups', emoji: '🎪', href: '/pop-ups'},
]

const findsQuery = `*[
  _type == "find" &&
  defined(slug.current) &&
  (!defined(endDate) || dateTime(endDate) >= dateTime(now()))
] | order(_createdAt desc)[0...150] {
  _id,
  title,
  "slug": slug.current,
  type,
  summary,
  isFree,
  price,
  startDate,
  endDate,
  featured,
  "brandLogoUrl": brand->logo.asset->url,
  "brandName": brand->name,
  "imageUrl": coalesce(image.asset->url, brand->image.asset->url, locations[0]->image.asset->url),
  "imageAlt": select(defined(image.asset) => image.alt, defined(brand->image.asset) => brand->image.alt, defined(locations[0]->image.asset) => locations[0]->image.alt, null),
  "venue": locations[0]->name
}`

function torontoDay(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export default async function Home() {
  let finds: Find[] = []

  try {
    finds = await sanityClient.fetch<Find[]>(findsQuery)
  } catch (error) {
    console.error('Failed to load Finds:', error)
  }

  const today = torontoDay(new Date())
  const weekEnd = new Date(today + 'T12:00:00Z')
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  const lastDay = weekEnd.toISOString().slice(0, 10)
  const happeningThisWeek = finds
    .filter((find) => {
      if (!find.startDate) return false
      const start = torontoDay(new Date(find.startDate))
      const end = find.endDate ? torontoDay(new Date(find.endDate)) : start
      return start <= lastDay && end >= today
    })
    .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''))
    .slice(0, 6)
  const featuredFinds = finds.filter((find) => find.featured).slice(0, 3)
  const latestFinds = finds.slice(0, 6)

  return (
    <main className="min-h-screen bg-[#faf9f6] text-black">

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-20 text-center md:pt-28">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-black/60">
          Discover Toronto
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Find something worth doing.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/60">
          Discover the latest deals, freebies, events, pop-ups and food
          around Toronto & the GTA.
        </p>

        {/* Search form */}
        <form
          action="/search"
          method="GET"
          className="mx-auto mt-10 flex max-w-xl items-center rounded-full border border-black/10 bg-white p-2 shadow-sm"
        >
          <input
            type="search"
            name="q"
            placeholder="Search deals, events, places..."
            className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"
          />

          <button
            type="submit"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
          >
            Search
          </button>
        </form>

        <Link
          href="/near-me"
          className="mt-5 inline-block text-sm font-semibold hover:underline"
        >
          📍 Find things near me
        </Link>

      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold transition hover:border-black hover:shadow-sm"
            >
              {category.emoji} {category.name}
            </Link>
          ))}
        </div>

      </section>

      {/* HAPPENING THIS WEEK */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/50">Don't miss out</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Happening This Week</h2>
            <p className="mt-3 text-black/60">Upcoming freebies, pop-ups and events across Toronto &amp; the GTA.</p>
          </div>
          <Link href="/this-weekend" className="text-sm font-semibold hover:underline">Explore this weekend →</Link>
        </div>
        {happeningThisWeek.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {happeningThisWeek.map((find) => <FindCard key={find._id} find={find} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-black/60">
            Nothing scheduled for this week yet. <Link href="/events" className="font-semibold text-black underline">Browse all events</Link>.
          </div>
        )}
      </section>

      {/* FEATURED FINDS */}
      {featuredFinds.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/50">Handpicked for you</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Finds</h2>
            </div>
            <Link href="/finds" className="text-sm font-semibold hover:underline">View all →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFinds.map((find) => <FindCard key={find._id} find={find} />)}
          </div>
        </section>
      )}

      {/* LATEST FINDS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/50">Fresh discoveries</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Latest Finds</h2>
          </div>
          <Link href="/finds" className="text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {latestFinds.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestFinds.map((find) => <FindCard key={find._id} find={find} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-black/60">New Finds coming soon!</div>
        )}
      </section>

      {/* NEAR YOU */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col gap-6 rounded-3xl bg-[#fff1cc] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/60">Explore your neighbourhood</p>
            <h2 className="text-3xl font-bold tracking-tight">Find something near you 📍</h2>
            <p className="mt-3 max-w-xl text-black/65">Discover deals, free samples, pop-ups and events close to you, across Toronto and the GTA.</p>
          </div>
          <Link href="/near-me" className="inline-flex shrink-0 items-center justify-center rounded-full bg-black px-7 py-3 font-semibold text-white transition hover:bg-black/80">Explore Near Me →</Link>
        </div>
      </section>

      {/* DISCOVER SECTIONS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">

        <h2 className="mb-8 text-3xl font-bold tracking-tight">
          Explore Toronto
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <Link
            href="/free-today"
            className="rounded-2xl bg-[#fff1cc] p-8 transition hover:shadow-md"
          >
            <div className="mb-5 text-4xl">🎁</div>
            <h3 className="text-2xl font-bold">Free Today</h3>
            <p className="mt-2 text-sm text-black/60">
              Discover free food, samples, giveaways and experiences.
            </p>
          </Link>

          <Link
            href="/this-weekend"
            className="rounded-2xl bg-[#e8efff] p-8 transition hover:shadow-md"
          >
            <div className="mb-5 text-4xl">📅</div>
            <h3 className="text-2xl font-bold">This Weekend</h3>
            <p className="mt-2 text-sm text-black/60">
              Find upcoming events, pop-ups and festivals.
            </p>
          </Link>

          <Link
            href="/pop-ups"
            className="rounded-2xl bg-[#e7f4e8] p-8 transition hover:shadow-md"
          >
            <div className="mb-5 text-4xl">✨</div>
            <h3 className="text-2xl font-bold">Pop-Ups</h3>
            <p className="mt-2 text-sm text-black/60">
              Explore brand activations, limited-time experiences and sampling pop-ups.
            </p>
          </Link>

        </div>

      </section>

      {/* INSTAGRAM COMMUNITY */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-black/10 bg-white px-8 py-10 text-center sm:py-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/50">Stay in the loop</p>
          <h2 className="text-3xl font-bold tracking-tight">Join our Toronto community</h2>
          <p className="mx-auto mt-3 max-w-xl text-black/60">Follow @torontodiscounts for local freebies, deals, new openings and pop-ups around the GTA.</p>
          <a href="https://www.instagram.com/torontodiscounts/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full bg-black px-7 py-3 font-semibold text-white transition hover:bg-black/80">Follow on Instagram ↗</a>
        </div>
      </section>
    </main>
  )
}
