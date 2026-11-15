import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
import Header from '../components/Header'
import {getSiteUrl} from '@/lib/site-url'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  ...(siteUrl ? {metadataBase: new URL(siteUrl)} : {}),
  title: {
    default: 'Toronto Discounts | Freebies, Deals & Events in Toronto & GTA',
    template: '%s | Toronto Discounts',
  },
  description: 'Discover Toronto and GTA freebies, local deals, pop-ups, events, food offers and things to do. Explore verified details and official sources.',
  applicationName: 'Toronto Discounts',
  icons: {icon: '/logo_TDiscounts.png', apple: '/logo_TDiscounts.png'},
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Toronto Discounts',
    title: 'Toronto Discounts | Freebies, Deals & Events in Toronto & GTA',
    description: 'Discover freebies, deals, events, pop-ups and things to do across Toronto and the GTA.',
    ...(siteUrl ? {url: siteUrl} : {}),
  },
  twitter: {card: 'summary_large_image'},
  robots: {index: Boolean(siteUrl), follow: Boolean(siteUrl)},
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <Header />
        {children}
      </body>
    </html>
  )
}
