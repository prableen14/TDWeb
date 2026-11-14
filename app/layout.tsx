import {getSiteUrl} from '@/lib/site-url'
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  ...(siteUrl ? {metadataBase: new URL(siteUrl)} : {}),
  title: {
    default: 'Toronto Finds | Freebies, Deals & Events in Toronto & GTA',
    template: '%s | Toronto Finds',
  },
  description: 'Discover Toronto and GTA freebies, local deals, pop-ups, events, food offers and things to do. Explore verified details and official sources.',
  applicationName: 'Toronto Finds',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Toronto Finds',
    title: 'Toronto Finds | Freebies, Deals & Events in Toronto & GTA',
    description: 'Discover freebies, deals, events, pop-ups and things to do across Toronto and the GTA.',
    ...(siteUrl ? {url: siteUrl} : {}),
  },
  twitter: {card: 'summary_large_image'},
  robots: {index: Boolean(siteUrl), follow: Boolean(siteUrl)},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}