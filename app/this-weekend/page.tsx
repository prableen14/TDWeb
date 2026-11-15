import type {Metadata} from 'next'
export const metadata:Metadata={title:'This Weekend in Toronto & GTA',description:'Discover events, pop-ups and activities happening this weekend in Toronto and the GTA.',alternates:{canonical:'/this-weekend'}}
import {sanityClient} from '@/sanity/lib/sanity'
import DateFinds, {type TimedFind} from '@/components/DateFinds'

const query = `*[_type == "find" && defined(slug.current) && defined(startDate)] | order(startDate asc)[0...1000] {
  _id,title,"slug":slug.current,type,summary,isFree,admissionType,price,startDate,endDate,
  "imageUrl":image.asset->url,"venue":locations[0]->name
}`
export default async function Page() {
  let finds:TimedFind[]=[]
  try {finds=await sanityClient.fetch<TimedFind[]>(query)}
  catch(error){console.error('Could not load dated Finds',error)}
  return <DateFinds finds={finds} mode="weekend"/>
}
