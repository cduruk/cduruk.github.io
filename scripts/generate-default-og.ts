import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import sharp from 'sharp'
import { Resvg } from '@resvg/resvg-js'
import { createElement } from 'react'
import { DefaultOGTemplate } from '../src/components/ui/default-og-template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const OUTPUT_WIDTH = 1200
const OUTPUT_HEIGHT = 630

async function generateDefaultOG(): Promise<void> {
  console.log('🎨 Generating default OG image...\n')

  const outputPath = join(__dirname, '../public/static/1200x630.png')

  // Create React element using the TSX component
  const element = createElement(DefaultOGTemplate, {
    title: 'Off by One',
    subtitle: 'by Can Duruk',
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

  // Write to public/static directory
  await writeFile(outputPath, optimizedBuffer)

  console.log(`✓ Generated: ${outputPath}`)
  console.log('\n✅ Done!')
}

// Run the generator
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  generateDefaultOG().catch(console.error)
}
