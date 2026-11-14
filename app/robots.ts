import type {MetadataRoute} from 'next'
import {getSiteUrl} from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl()
  if (!origin) return {rules: {userAgent: '*', disallow: '/' }}
  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/studio/', '/api/']},
    sitemap: new URL('/sitemap.xml', origin).toString(),
  }
}
