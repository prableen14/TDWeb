import Link from 'next/link'
import FindCard, {type FindCardData} from '@/components/FindCard'
import {sanityClient} from '@/sanity/lib/sanity'

const query = `*[_type == "find" && defined(slug.current) && (!defined(endDate) || dateTime(endDate) >= dateTime(now())) && (
  title match $term || summary match $term || pt::text(description) match $term ||
  brand->name match $term || type match $term
)] | order(_createdAt desc)[0...60] {
  _id, title, "slug": slug.current, type, summary, isFree, price, startDate,
  "imageUrl": coalesce(image.asset->url, brand->image.asset->url, locations[0]->image.asset->url),
  "imageAlt": select(defined(image.asset) => image.alt, defined(brand->image.asset) => brand->image.alt, defined(locations[0]->image.asset) => locations[0]->image.alt, null), "venue": locations[0]->name
}`

export default async function SearchPage({searchParams}: {searchParams: Promise<{q?: string | string[]}>}) {
  const {q} = await searchParams
  const term = (typeof q === 'string' ? q : '').trim().slice(0, 100)
  const finds = term ? await sanityClient.fetch<FindCardData[]>(query, {term: `*${term.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().split(/\s+/).filter(Boolean).join('* *')}*`}) : []
  return (
    <main className="min-h-screen bg-[#faf9f6] text-black">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <Link href="/" className="text-sm font-semibold text-black/60 hover:underline">← Back to home</Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">Search Toronto Finds</h1>
        <form action="/search" method="GET" className="mt-8 flex max-w-2xl gap-3">
          <input name="q" type="search" defaultValue={term} placeholder="Search freebies, events, deals..." className="min-w-0 flex-1 rounded-full border border-black/15 bg-white px-5 py-3 outline-none focus:border-black" />
          <button type="submit" className="rounded-full bg-black px-6 py-3 font-semibold text-white">Search</button>
        </form>
        {term ? (
          <>
            <p className="mt-8 text-sm text-black/60">{finds.length} result{finds.length === 1 ? '' : 's'} for “{term}”</p>
            {finds.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{finds.map((find) => <FindCard key={find._id} find={find} />)}</div>
            ) : <p className="mt-6 rounded-2xl bg-white p-10 text-center text-black/60">No matches found. Try another search.</p>}
          </>
        ) : <p className="mt-8 text-black/60">Enter a keyword to explore local Finds.</p>}
      </section>
    </main>
  )
}
