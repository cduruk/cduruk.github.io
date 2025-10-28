import { describe, it, expect } from 'vitest'
import { ensureTrailingSlash } from './utils'

describe('ensureTrailingSlash', () => {
  it.each([
    // Basic paths without trailing slash
    { input: '/posts', expected: '/posts/', description: 'adds trailing slash to simple path' },
    { input: '/posts/my-post', expected: '/posts/my-post/', description: 'adds trailing slash to nested path' },
    { input: '/authors/cduruk', expected: '/authors/cduruk/', description: 'adds trailing slash to author path' },
    { input: '/tags/engineering', expected: '/tags/engineering/', description: 'adds trailing slash to tag path' },

    // Paths that already have trailing slash
    { input: '/posts/', expected: '/posts/', description: 'preserves existing trailing slash' },
    { input: '/authors/', expected: '/authors/', description: 'preserves trailing slash on authors' },
    { input: '/', expected: '/', description: 'preserves root path trailing slash' },

    // Paths with hash fragments
    { input: '/posts#top', expected: '/posts/#top', description: 'adds trailing slash before hash' },
    { input: '/posts/my-post#heading', expected: '/posts/my-post/#heading', description: 'adds trailing slash before hash in nested path' },
    { input: '/posts/#top', expected: '/posts/#top', description: 'preserves trailing slash with hash' },
    { input: '/posts/my-post/#heading-1', expected: '/posts/my-post/#heading-1', description: 'preserves existing slash before hash' },

    // Hash-only links (should not be modified)
    { input: '#top', expected: '#top', description: 'preserves hash-only anchor' },
    { input: '#post-title', expected: '#post-title', description: 'preserves hash-only link' },

    // Paths with file extensions (should not get trailing slash)
    { input: '/rss.xml', expected: '/rss.xml', description: 'preserves file with .xml extension' },
    { input: '/sitemap.xml', expected: '/sitemap.xml', description: 'preserves sitemap file' },
    { input: '/static/logo.png', expected: '/static/logo.png', description: 'preserves image file' },
    { input: '/docs/guide.pdf', expected: '/docs/guide.pdf', description: 'preserves PDF file' },
    { input: '/robots.txt', expected: '/robots.txt', description: 'preserves text file' },

    // External URLs (should not be modified)
    { input: 'https://example.com', expected: 'https://example.com', description: 'preserves external HTTP URL' },
    { input: 'https://example.com/path', expected: 'https://example.com/path', description: 'preserves external URL with path' },
    { input: 'http://localhost:3000', expected: 'http://localhost:3000', description: 'preserves HTTP localhost' },
    { input: 'https://felt.com', expected: 'https://felt.com', description: 'preserves external domain' },

    // Edge cases
    { input: '', expected: '', description: 'handles empty string' },
    { input: '/posts/2024/', expected: '/posts/2024/', description: 'preserves trailing slash in year path' },
    { input: '/a', expected: '/a/', description: 'adds trailing slash to single character path' },
    { input: '/posts/my-post-name-with-dashes', expected: '/posts/my-post-name-with-dashes/', description: 'handles dashes in path' },

    // Multiple hash scenarios
    { input: '/posts#', expected: '/posts/', description: 'handles path with empty hash fragment' },
    { input: '/#about', expected: '/#about', description: 'handles root with hash' },

    // mailto and other protocols
    { input: 'mailto:test@example.com', expected: 'mailto:test@example.com', description: 'preserves mailto links' },
  ])('$description', ({ input, expected }) => {
    expect(ensureTrailingSlash(input)).toBe(expected)
  })
})
