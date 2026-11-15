import Link from 'next/link'
import FindCard, {type FindCardData} from '@/components/FindCard'
import {sanityClient} from '@/sanity/lib/sanity'

const query = `*[_type == "find" && defined(slug.current) && (!defined(endDate) || dateTime(endDate) >= dateTime(now()))] | order(_createdAt desc)[0...60] {
  _id, title, "slug": slug.current, type, summary, isFree, price, startDate,
  "imageUrl": coalesce(image.asset->url, brand->image.asset->url, locations[0]->image.asset->url),
  "imageAlt": select(defined(image.asset) => image.alt, defined(brand->image.asset) => brand->image.alt, defined(locations[0]->image.asset) => locations[0]->image.alt, null), "venue": locations[0]->name
}`


export default async function AllFindsPage() {
  const finds = await sanityClient.fetch<FindCardData[]>(query)
  return (
    <main className="min-h-screen bg-[#faf9f6] text-black">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <Link href="/" className="text-sm font-semibold text-black/60 hover:underline">← Back to home</Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">All Toronto Finds</h1>
        <p className="mt-4 text-lg text-black/60">Browse the latest freebies, deals, events, food, and things to do.</p>
        {finds.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{finds.map((find) => <FindCard key={find._id} find={find} />)}</div>
        ) : (
          <p className="mt-10 rounded-2xl bg-white p-10 text-center text-black/60">New Finds coming soon!</p>
        )}
      </section>
    </main>
  )
}
