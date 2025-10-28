import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import sharp from 'sharp'
import { Resvg } from '@resvg/resvg-js'
import { createElement } from 'react'
import { FaviconTemplate } from '../src/components/ui/favicon-template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PUBLIC_DIR = join(__dirname, '../public')

// Favicon sizes to generate
const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'web-app-manifest-192x192.png' },
  { size: 512, name: 'web-app-manifest-512x512.png' },
]

// Generate a single favicon at a specific size
async function generateFaviconSize(size: number, outputPath: string): Promise<void> {
  console.log(`  Generating ${size}x${size} favicon...`)

  // Create React element using the TSX component with size prop
  const element = createElement(FaviconTemplate, { size })

  // Generate SVG using Satori
  const svg = await satori(element, {
    width: size,
    height: size,
    fonts: [
      {
        name: 'Fira Sans',
        data: await readFile(
          join(
            __dirname,
            '../node_modules/@fontsource/fira-sans/files/fira-sans-latin-700-normal.woff',
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
      value: size,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // Optimize with sharp
  const optimizedBuffer = await sharp(pngBuffer)
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer()

  // Write to public directory
  await writeFile(outputPath, optimizedBuffer)

  console.log(`  ✓ Generated: ${outputPath}`)
}

// Generate favicon.ico from the 32x32 PNG
async function generateFaviconIco(): Promise<void> {
  console.log('  Generating favicon.ico...')

  const png32Path = join(PUBLIC_DIR, 'favicon-32x32.png')
  const icoPath = join(PUBLIC_DIR, 'favicon.ico')

  // Read the 32x32 PNG and convert to ICO format
  const icoBuffer = await sharp(png32Path)
    .resize(32, 32)
    .toFormat('png')
    .toBuffer()

  // For .ico file, we'll just use the PNG format
  // Modern browsers support PNG in .ico files
  await writeFile(icoPath, icoBuffer)

  console.log(`  ✓ Generated: ${icoPath}`)
}

// Main function
async function main(): Promise<void> {
  console.log('🎨 Generating favicon files...\n')

  // Generate all favicon sizes
  for (const { size, name } of FAVICON_SIZES) {
    const outputPath = join(PUBLIC_DIR, name)
    try {
      await generateFaviconSize(size, outputPath)
    } catch (error) {
      console.error(
        `  ✗ Failed to generate ${name}:`,
        (error as Error).message,
      )
    }
  }

  // Generate favicon.ico
  try {
    await generateFaviconIco()
  } catch (error) {
    console.error(
      '  ✗ Failed to generate favicon.ico:',
      (error as Error).message,
    )
  }

  console.log('\n✅ Done!')
}

// Run main if this file is being executed directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(console.error)
}
