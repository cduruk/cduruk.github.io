import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import sharp from 'sharp'
import { Resvg } from '@resvg/resvg-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BLOG_DIR = join(__dirname, '../src/content/blog')
const OUTPUT_WIDTH = 1200
const OUTPUT_HEIGHT = 630

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) return null

  const frontmatter = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Remove quotes
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }

    frontmatter[key] = value
  }

  return frontmatter
}

// Get all blog posts
async function getBlogPosts() {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true })
  const posts = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const postDir = join(BLOG_DIR, entry.name)
    const files = await readdir(postDir)

    // Find index.mdx or index.md
    const indexFile = files.find(f => f === 'index.mdx' || f === 'index.md')
    if (!indexFile) continue

    // Check if banner already exists
    const hasBanner = files.some(f => f.startsWith('banner.'))

    const content = await readFile(join(postDir, indexFile), 'utf-8')
    const frontmatter = parseFrontmatter(content)

    if (!frontmatter) continue

    posts.push({
      slug: entry.name,
      dir: postDir,
      hasBanner,
      ...frontmatter
    })
  }

  return posts
}

// Generate hero image template
function generateHeroTemplate(title, description, date, tags = []) {
  // Format date
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        justifyContent: 'space-between',
      },
      children: [
        // Main content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            },
            children: [
              // Title
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '72px',
                    fontWeight: 'bold',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em',
                  },
                  children: title,
                },
              },
              // Description (if provided)
              description ? {
                type: 'div',
                props: {
                  style: {
                    fontSize: '32px',
                    opacity: 0.9,
                    lineHeight: '1.4',
                  },
                  children: description,
                },
              } : null,
            ].filter(Boolean),
          },
        },
        // Footer with date and tags
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '24px',
              opacity: 0.8,
            },
            children: [
              {
                type: 'div',
                props: {
                  children: formattedDate,
                },
              },
              tags && tags.length > 0 ? {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '12px',
                  },
                  children: tags.slice(0, 3).map(tag => ({
                    type: 'div',
                    props: {
                      style: {
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                      },
                      children: tag,
                    },
                  })),
                },
              } : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  }
}

// Generate image for a post
async function generateImage(post) {
  console.log(`Generating image for: ${post.title}`)

  // Parse tags if they exist
  let tags = []
  if (post.tags) {
    try {
      // Handle array format: ['tag1', 'tag2']
      tags = JSON.parse(post.tags.replace(/'/g, '"'))
    } catch {
      tags = []
    }
  }

  const template = generateHeroTemplate(
    post.title,
    post.description,
    post.date,
    tags
  )

  // Generate SVG using Satori
  const svg = await satori(template, {
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    fonts: [
      {
        name: 'Inter',
        data: await readFile(join(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: await readFile(join(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')),
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

  // Write to post directory
  const outputPath = join(post.dir, 'banner.png')
  await writeFile(outputPath, optimizedBuffer)

  console.log(`✓ Generated: ${outputPath}`)
}

// Main function
async function main() {
  console.log('🎨 Generating hero images for blog posts...\n')

  const posts = await getBlogPosts()
  const postsWithoutBanner = posts.filter(p => !p.hasBanner && !p.draft)

  if (postsWithoutBanner.length === 0) {
    console.log('✨ All posts already have banner images!')
    return
  }

  console.log(`Found ${postsWithoutBanner.length} posts without banners:\n`)

  for (const post of postsWithoutBanner) {
    try {
      await generateImage(post)
    } catch (error) {
      console.error(`✗ Failed to generate image for ${post.slug}:`, error.message)
    }
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
