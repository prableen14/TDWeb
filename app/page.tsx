
import Link from 'next/link'
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
  venue?: string
}

const categories = [
  {name: 'Freebies', emoji: '🎁', href: '/freebies'},
  {name: 'Deals', emoji: '💰', href: '/deals'},
  {name: 'Events', emoji: '📅', href: '/events'},
  {name: 'Food & Drinks', emoji: '🍜', href: '/food'},
  {name: 'Things To Do', emoji: '✨', href: '/things-to-do'},
]

const findsQuery = `*[
  _type == "find" &&
  defined(slug.current)
] | order(_createdAt desc)[0...12] {
  _id,
  title,
  "slug": slug.current,
  type,
  summary,
  isFree,
  price,
  startDate,
  "imageUrl": coalesce(image.asset->url, brand->image.asset->url, locations[0]->image.asset->url),
  "imageAlt": select(defined(image.asset) => image.alt, defined(brand->image.asset) => brand->image.alt, defined(locations[0]->image.asset) => locations[0]->image.alt, null),
  "venue": locations[0]->name
}`

export default async function Home() {
  let finds: Find[] = []

  try {
    finds = await sanityClient.fetch<Find[]>(findsQuery)
  } catch (error) {
    console.error('Failed to load Finds:', error)
  }

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
          Discover the latest deals, freebies, events, food and things to do
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

      {/* LATEST FINDS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-black/50">
              Discover what's happening
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Latest Finds
            </h2>
          </div>

          <Link
            href="/finds"
            className="text-sm font-semibold hover:underline"
          >
            View all →
          </Link>
        </div>

        {finds.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
            <h3 className="text-xl font-bold">
              New Finds coming soon!
            </h3>
            <p className="mt-2 text-black/60">
              We're gathering Toronto's best freebies, deals and events.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {finds.map((find) => (
              <Link
                key={find._id}
                href={`/finds/${find.slug}`}
                className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {find.imageUrl ? (
                    <img
                      src={find.imageUrl}
                      alt={find.imageAlt || find.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      {find.type === 'freebie'
                        ? '🎁'
                        : find.type === 'deal'
                        ? '💰'
                        : find.type === 'event'
                        ? '📅'
                        : find.type === 'food'
                        ? '🍜'
                        : '✨'}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize">
                      {find.type.replaceAll('-', ' ')}
                    </span>

                    {find.isFree && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold leading-snug group-hover:underline">
                    {find.title}
                  </h3>

                  {find.summary && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">
                      {find.summary}
                    </p>
                  )}

                  <div className="mt-4 space-y-1 text-sm text-black/60">
                    {find.venue && (
                      <p>📍 {find.venue}</p>
                    )}

                    {find.startDate && (
                      <p>
                        📅 {new Date(find.startDate).toLocaleDateString(
                          'en-CA',
                          {
                            timeZone: 'America/Toronto',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    )}

                    {!find.isFree && find.price && (
                      <p>💰 {find.price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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
            href="/things-to-do"
            className="rounded-2xl bg-[#e7f4e8] p-8 transition hover:shadow-md"
          >
            <div className="mb-5 text-4xl">✨</div>
            <h3 className="text-2xl font-bold">Things To Do</h3>
            <p className="mt-2 text-sm text-black/60">
              Explore new experiences and hidden gems.
            </p>
          </Link>

        </div>

      </section>

    </main>
  )
}
