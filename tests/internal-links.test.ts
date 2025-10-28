import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { globSync } from 'glob'

describe('Internal blog post links', () => {
  it('should have trailing slashes on all internal /posts/ links', async () => {
    // Find all MDX files in the blog content directory
    const mdxFiles = globSync('src/content/blog/**/*.mdx', {
      cwd: process.cwd(),
    })

    const errors: Array<{ file: string; line: number; match: string }> = []

    // Check each file for internal links without trailing slashes
    for (const file of mdxFiles) {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, index) => {
        // Match internal /posts/ links that don't have a trailing slash before the closing paren
        // Pattern: /posts/[anything except /])
        const regex = /\/posts\/([^/\s)]+)\)/g
        let match

        while ((match = regex.exec(line)) !== null) {
          errors.push({
            file: file.replace(process.cwd() + '/', ''),
            line: index + 1,
            match: match[0],
          })
        }
      })
    }

    // If we found any errors, format them nicely and fail the test
    if (errors.length > 0) {
      const errorMessage = [
        '\nFound internal /posts/ links without trailing slashes:',
        ...errors.map(
          (e) => `  ${e.file}:${e.line} - "${e.match.replace(')', '')}/)"`,
        ),
        '\nAll internal blog post links should end with a trailing slash before the closing parenthesis.',
      ].join('\n')

      throw new Error(errorMessage)
    }

    expect(errors).toHaveLength(0)
  })
})
