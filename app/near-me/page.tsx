import type {Metadata} from 'next'
import {sanityClient} from '@/sanity/lib/sanity'
import NearMeExplorer, {type NearbyFind} from '@/components/NearMeExplorer'

export const metadata: Metadata = {
  title: 'Find Freebies, Deals & Events Near Me',
  description: 'Explore location-based freebies, deals, events and things to do near you in Toronto and the GTA. Filter by category and distance.',
  alternates: {canonical: '/near-me'},
}

const query = `*[_type == "find" && defined(slug.current) && count(locations[@->location != null]) > 0 && (!defined(endDate) || dateTime(endDate) >= dateTime(now()))][0...1000] {
  _id, title, "slug": slug.current, type, summary, isFree, price, startDate, endDate,
  "venues": locations[]->{name, address, city, neighbourhood, "lat": location.lat, "lng": location.lng}
}`

export default async function NearMePage() {
  let finds: NearbyFind[] = []
  try {
    finds = await sanityClient.fetch<NearbyFind[]>(query)
  } catch (error) {
    console.error('Unable to load nearby Finds:', error)
  }
  return <NearMeExplorer finds={finds} />
}
