// Canonical public origin for Toronto Finds.
// Override only if the production domain changes; preview deployments should not be indexed.
export function getSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://torontofinds.com'
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)) return null
    return url.origin
  } catch {
    return null
  }
}
