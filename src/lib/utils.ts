import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateWordCountFromHtml(
  html: string | null | undefined,
): number {
  if (!html) return 0
  const textOnly = html.replace(/<[^>]+>/g, '')
  return textOnly.split(/\s+/).filter(Boolean).length
}

export function readingTime(wordCount: number): string {
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))
  return `${readingTimeMinutes} min read`
}

export function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: 'ml-4',
    4: 'ml-8',
    5: 'ml-12',
    6: 'ml-16',
  }
  return margins[depth] || ''
}

/**
 * Ensures that internal links always have a trailing slash.
 * Preserves hash fragments and doesn't add trailing slash before hash.
 *
 * @param href - The URL to normalize
 * @returns The URL with a trailing slash (if internal and no hash at the end)
 *
 * @example
 * ensureTrailingSlash('/posts') // => '/posts/'
 * ensureTrailingSlash('/posts/my-post') // => '/posts/my-post/'
 * ensureTrailingSlash('/posts#top') // => '/posts/#top'
 * ensureTrailingSlash('/posts/') // => '/posts/'
 * ensureTrailingSlash('/rss.xml') // => '/rss.xml' (keeps file extensions as is)
 */
export function ensureTrailingSlash(href: string): string {
  // Don't modify empty strings, external URLs, or anchor-only links
  if (!href || href.startsWith('http') || href.startsWith('#')) {
    return href
  }

  // Split the URL into path and hash
  const [path, hash] = href.split('#')

  // Don't add trailing slash to files with extensions (like .xml, .pdf, etc.)
  // or if the path already has a trailing slash
  if (path.endsWith('/') || /\.[a-z]+$/i.test(path)) {
    return href
  }

  // Add trailing slash to the path, then reattach hash if present
  return hash ? `${path}/#${hash}` : `${path}/`
}
