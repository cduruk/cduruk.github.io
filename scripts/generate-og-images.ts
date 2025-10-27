import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import sharp from 'sharp'
import { Resvg } from '@resvg/resvg-js'
import { createElement } from 'react'
import { HeroTemplate } from '../src/components/ui/hero-template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BLOG_DIR = join(__dirname, '../src/content/blog')
const OUTPUT_WIDTH = 1200
const OUTPUT_HEIGHT = 630

interface Frontmatter {
  [key: string]: string
}

interface BlogPost {
  slug: string
  dir: string
  hasOgImage: boolean
  title?: string
  description?: string
  draft?: string
}

// Simple frontmatter parser
function parseFrontmatter(content: string): Frontmatter | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) return null

  const frontmatter: Frontmatter = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Remove quotes
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }

    frontmatter[key] = value
  }

  return frontmatter
}

// Get all blog posts
async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true })
  const posts: BlogPost[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const postDir = join(BLOG_DIR, entry.name)
    const files = await readdir(postDir)

    // Find index.mdx or index.md
    const indexFile = files.find((f) => f === 'index.mdx' || f === 'index.md')
    if (!indexFile) continue

    // Check if OG image already exists
    const hasOgImage = files.some((f) => f.startsWith('og-image.'))

    const content = await readFile(join(postDir, indexFile), 'utf-8')
    const frontmatter = parseFrontmatter(content)

    if (!frontmatter) continue

    posts.push({
      slug: entry.name,
      dir: postDir,
      hasOgImage,
      ...frontmatter,
    })
  }

  return posts
}

// Generate OG image for a specific post by slug
export async function generateImageForSlug(slug: string): Promise<void> {
  const postDir = join(BLOG_DIR, slug)

  try {
    const files = await readdir(postDir)

    // Find index.mdx or index.md
    const indexFile = files.find((f) => f === 'index.mdx' || f === 'index.md')
    if (!indexFile) {
      throw new Error(`No index.mdx or index.md found in ${slug}`)
    }

    const content = await readFile(join(postDir, indexFile), 'utf-8')
    const frontmatter = parseFrontmatter(content)

    if (!frontmatter) {
      throw new Error(`No frontmatter found in ${slug}/${indexFile}`)
    }

    const post: BlogPost = {
      slug,
      dir: postDir,
      hasOgImage: files.some((f) => f.startsWith('og-image.')),
      ...frontmatter,
    }

    await generateImage(post)
  } catch (error) {
    throw new Error(
      `Failed to generate OG image for ${slug}: ${(error as Error).message}`,
    )
  }
}

// Generate image for a post
export async function generateImage(post: BlogPost): Promise<void> {
  console.log(`Generating image for: ${post.title}`)

  // Create React element using the TSX component
  const element = createElement(HeroTemplate, {
    title: post.title || 'Untitled',
    description: post.description,
  })

  // Generate SVG using Satori
  const svg = await satori(element, {
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    fonts: [
      {
        name: 'Inter',
        data: await readFile(
          join(
            __dirname,
            '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
          ),
        ),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: await readFile(
          join(
            __dirname,
            '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff',
          ),
        ),
        weight: 700,
        style: 'normal',
      },
    ],
  })

  // Convert SVG to PNG using resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: OUTPUT_WIDTH,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // Optimize with sharp
  const optimizedBuffer = await sharp(pngBuffer)
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer()

  // Write to post directory as OG image
  const outputPath = join(post.dir, 'og-image.png')
  await writeFile(outputPath, optimizedBuffer)

  console.log(`✓ Generated: ${outputPath}`)
}

// Main function
async function main(): Promise<void> {
  console.log('🎨 Generating OG images for blog posts...\n')

  const posts = await getBlogPosts()
  const postsWithoutOgImage = posts.filter(
    (p) => !p.hasOgImage && p.draft !== 'true',
  )

  if (postsWithoutOgImage.length === 0) {
    console.log('✨ All posts already have OG images!')
    return
  }

  console.log(`Found ${postsWithoutOgImage.length} posts without OG images:\n`)

  for (const post of postsWithoutOgImage) {
    try {
      await generateImage(post)
    } catch (error) {
      console.error(
        `✗ Failed to generate OG image for ${post.slug}:`,
        (error as Error).message,
      )
    }
  }

  console.log('\n✅ Done!')
}

// Only run main if this file is being executed directly (not imported)
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(console.error)
}
