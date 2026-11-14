import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import FindCard, {type FindCardData} from '@/components/FindCard'
import {sanityClient} from '@/sanity/lib/sanity'

const categories = {
  freebies: {type: 'freebie', title: 'Freebies in Toronto', description: 'Discover free samples, giveaways, and experiences around Toronto & the GTA.'},
  deals: {type: 'deal', title: 'Deals & Discounts', description: 'Find great local deals, offers, and discounts.'},
  events: {type: 'event', title: 'Events in Toronto', description: 'Explore upcoming events, pop-ups, and festivals.'},
  food: {type: 'food', title: 'Food & Drinks', description: 'Discover food offers, openings, and tasty finds.'},
  'things-to-do': {type: 'things-to-do', title: 'Things To Do', description: 'Find experiences and activities across Toronto & the GTA.'},
} as const

const query = `*[_type == "find" && defined(slug.current) && type == $type] | order(startDate desc, _createdAt desc)[0...60] {
  _id, title, "slug": slug.current, type, summary, isFree, price, startDate,
  "imageUrl": image.asset->url, "venue": locations[0]->name
}`


export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({category}))
}

export async function generateMetadata({params}: {params: Promise<{category: string}>}): Promise<Metadata> {
  const {category} = await params
  const info = categories[category as keyof typeof categories]
  return {title: info ? `${info.title} | Toronto Finds` : 'Not found', description: info?.description}
}

export default async function CategoryPage({params}: {params: Promise<{category: string}>}) {
  const {category} = await params
  const info = categories[category as keyof typeof categories]
  if (!info) notFound()

  const finds = await sanityClient.fetch<FindCardData[]>(query, {type: info.type})
  return (
    <main className="min-h-screen bg-[#faf9f6] text-black">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <Link href="/" className="text-sm font-semibold text-black/60 hover:underline">← Back to home</Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">{info.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/60">{info.description}</p>
        {finds.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {finds.map((find) => <FindCard key={find._id} find={find} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No Finds here yet</h2>
            <p className="mt-2 text-black/60">Check back soon for new discoveries.</p>
          </div>
        )}
      </div>
    </main>
  )
}
