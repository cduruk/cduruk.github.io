import { describe, expect, it } from 'vitest'

import {
  type BlogPost,
  type CliOptions,
  filterPostsForGeneration,
  parseCliArgs,
} from '../scripts/generate-og-images'

describe('parseCliArgs', () => {
  it('returns default options when no args provided', () => {
    const options = parseCliArgs([])

    expect(options).toEqual({
      slugs: [],
      includePosts: true,
      includeStatic: true,
      onlyMissing: true,
      help: false,
    })
  })

  it('parses slug lists from different syntaxes', () => {
    const first = parseCliArgs(['--slug', 'post-one'])
    const second = parseCliArgs(['--slug=post-one,post-two'])

    expect(first.slugs).toEqual(['post-one'])
    expect(second.slugs).toEqual(['post-one', 'post-two'])
    expect(second.includePosts).toBe(true)
    expect(second.includeStatic).toBe(true)
  })

  it('supports task selection helpers', () => {
    const postsOnly = parseCliArgs(['--posts-only'])
    const staticOnly = parseCliArgs(['--tasks', 'static'])

    expect(postsOnly.includePosts).toBe(true)
    expect(postsOnly.includeStatic).toBe(false)
    expect(staticOnly.includePosts).toBe(false)
    expect(staticOnly.includeStatic).toBe(true)
  })

  it('sets onlyMissing=false when forcing regeneration', () => {
    const options = parseCliArgs(['--all-posts', '--no-static'])

    expect(options.onlyMissing).toBe(false)
    expect(options.includeStatic).toBe(false)
  })

  it('throws on invalid tasks', () => {
    expect(() => parseCliArgs(['--tasks', 'unknown'])).toThrowError(
      'Unknown task "unknown". Use "posts" or "static".',
    )
  })
})

describe('filterPostsForGeneration', () => {
  const baseOptions: CliOptions = {
    slugs: [],
    includePosts: true,
    includeStatic: true,
    onlyMissing: true,
    help: false,
  }

  const posts: BlogPost[] = [
    {
      slug: 'first-post',
      dir: '/tmp/first-post',
      hasOgImage: false,
      title: 'First',
    },
    {
      slug: 'draft-post',
      dir: '/tmp/draft-post',
      hasOgImage: false,
      draft: 'true',
    },
    {
      slug: 'complete-post',
      dir: '/tmp/complete-post',
      hasOgImage: true,
    },
  ]

  it('returns only missing, non-draft posts by default', () => {
    const result = filterPostsForGeneration(posts, baseOptions)

    expect(result.map((post) => post.slug)).toEqual(['first-post'])
  })

  it('includes posts with existing OG images when onlyMissing=false', () => {
    const result = filterPostsForGeneration(posts, {
      ...baseOptions,
      onlyMissing: false,
    })

    expect(result.map((post) => post.slug)).toEqual([
      'first-post',
      'complete-post',
    ])
  })

  it('filters by explicit slugs and ignores draft state', () => {
    const result = filterPostsForGeneration(posts, {
      ...baseOptions,
      slugs: ['draft-post'],
    })

    expect(result.map((post) => post.slug)).toEqual(['draft-post'])
  })

  it('throws when a provided slug does not exist', () => {
    expect(() =>
      filterPostsForGeneration(posts, { ...baseOptions, slugs: ['missing'] }),
    ).toThrowError('Unknown blog post slug: missing')
  })
})
