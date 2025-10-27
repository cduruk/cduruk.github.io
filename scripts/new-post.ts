import { mkdir, writeFile, readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BLOG_DIR = join(__dirname, '../src/content/blog')
const DEFAULT_AUTHOR = 'cduruk'

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Promisified question function
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Generate frontmatter
function generateFrontmatter(data: {
  title: string
  description: string
  date: string
  tags?: string[]
  author: string
  draft: boolean
}): string {
  const lines: string[] = ['---']

  lines.push(`title: '${data.title}'`)
  lines.push(`description: '${data.description}'`)
  lines.push(`date: ${data.date}`)

  if (data.tags && data.tags.length > 0) {
    lines.push(`tags: [${data.tags.map((tag) => `'${tag}'`).join(', ')}]`)
  }

  lines.push(`ogImage: './og-image.png'`)
  lines.push(`authors: ['${data.author}']`)

  if (data.draft) {
    lines.push(`draft: true`)
  }

  lines.push('---')

  return lines.join('\n')
}

// Generate post content
function generatePostContent(data: {
  title: string
  description: string
  date: string
  tags?: string[]
  author: string
  draft: boolean
}): string {
  const frontmatter = generateFrontmatter(data)

  return `${frontmatter}

import Callout from '@/components/Callout.astro'

## Introduction

Your content here...
`
}

// Check if directory exists
async function directoryExists(slug: string): Promise<boolean> {
  try {
    const entries = await readdir(BLOG_DIR, { withFileTypes: true })
    return entries.some((entry) => entry.isDirectory() && entry.name === slug)
  } catch {
    return false
  }
}

// Main function
async function main(): Promise<void> {
  console.log('📝 Create New Blog Post\n')

  // Get title (required)
  let title = ''
  while (!title.trim()) {
    title = await question('Post title: ')
    if (!title.trim()) {
      console.log('⚠️  Title is required!\n')
    }
  }

  // Generate and confirm slug
  const slug = generateSlug(title)
  console.log(`Generated slug: ${slug}\n`)

  // Check if post already exists
  if (await directoryExists(slug)) {
    console.log(`❌ A post with slug "${slug}" already exists!`)
    rl.close()
    return
  }

  // Get description (required)
  let description = ''
  while (!description.trim()) {
    description = await question('Description: ')
    if (!description.trim()) {
      console.log('⚠️  Description is required!\n')
    }
  }

  // Get tags (optional)
  const tagsInput = await question('Tags (comma-separated, or press enter to skip): ')
  const tags = tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  // Get draft status (optional)
  const draftInput = await question('Create as draft? (y/N): ')
  const draft = draftInput.toLowerCase() === 'y' || draftInput.toLowerCase() === 'yes'

  rl.close()

  // Generate content
  const content = generatePostContent({
    title,
    description,
    date: formatDate(new Date()),
    tags: tags.length > 0 ? tags : undefined,
    author: DEFAULT_AUTHOR,
    draft,
  })

  // Create directory and file
  const postDir = join(BLOG_DIR, slug)
  const indexPath = join(postDir, 'index.mdx')

  try {
    await mkdir(postDir, { recursive: true })
    await writeFile(indexPath, content, 'utf-8')

    console.log(`\n✅ Created ${indexPath}`)

    if (draft) {
      console.log('📌 Post created as draft')
    }

    console.log('\n💡 Next steps:')
    console.log(`   1. Edit ${slug}/index.mdx`)
    console.log(`   2. Run "npm run generate-og-images" to create the OG image`)
    console.log(`   3. Run "npm run dev" to preview your post`)
  } catch (error) {
    console.error('❌ Failed to create post:', (error as Error).message)
    process.exit(1)
  }
}

main().catch(console.error)
