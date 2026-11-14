// Set NEXT_PUBLIC_SITE_URL to the production origin before launch (e.g. https://your-domain.ca).
// Never use localhost as a public canonical URL.
export function getSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (!['https:', 'http:'].includes(url.protocol) || ['localhost', '127.0.0.1'].includes(url.hostname)) return null
    return url.origin
  } catch {
    return null
  }
}
