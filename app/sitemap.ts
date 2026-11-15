import type {MetadataRoute} from 'next'
import {sanityClient} from '@/sanity/lib/sanity'
import {getSiteUrl} from '@/lib/site-url'

type Entry = {slug: string; updatedAt: string}
const query = `*[_type == "find" && defined(slug.current)] | order(_updatedAt desc)[0...5000] {
  "slug": slug.current, "updatedAt": _updatedAt
}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl()
  if (!origin) return []
  const staticPaths = ['/', '/freebies', '/deals', '/events', '/food', '/pop-ups', '/things-to-do', '/finds']
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
  try {
    const finds = await sanityClient.fetch<Entry[]>(query)
    return [...staticEntries, ...finds.map((find) => ({
      url: new URL(`/finds/${encodeURIComponent(find.slug)}`, origin).toString(),
      lastModified: new Date(find.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))]
  } catch (error) {
    console.error('Unable to load Finds for sitemap:', error)
    return staticEntries
  }
}
