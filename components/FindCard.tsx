import Link from 'next/link'

export type FindCardData = {
  _id: string
  title: string
  slug: string
  type?: string
  summary?: string
  isFree?: boolean
  price?: string
  startDate?: string
  imageUrl?: string
  imageAlt?: string
  venue?: string
}

export default function FindCard({find}: {find: FindCardData}) {
  const icon = find.type === 'freebie' ? '🎁' : find.type === 'deal' ? '💰' : find.type === 'event' ? '📅' : find.type === 'food' ? '🍜' : find.type === 'pop-up' ? '🎪' : '✨'
  return (
    <Link href={`/finds/${find.slug}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        {find.imageUrl ? (
          <img src={find.imageUrl} alt={find.imageAlt || find.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{icon}</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {find.type && <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize">{find.type.replaceAll('-', ' ')}</span>}
          {find.isFree && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">FREE</span>}
        </div>
        <h2 className="text-lg font-bold leading-snug group-hover:underline">{find.title}</h2>
        {find.summary && <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">{find.summary}</p>}
        <div className="mt-4 space-y-1 text-sm text-black/60">
          {find.venue && <p>📍 {find.venue}</p>}
          {find.startDate && <p>📅 {new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Toronto', dateStyle: 'medium'}).format(new Date(find.startDate))}</p>}
          {!find.isFree && find.price && <p>💰 {find.price}</p>}
        </div>
      </div>
    </Link>
  )
}
