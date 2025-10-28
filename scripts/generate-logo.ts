import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import { createElement } from 'react'
import { FaviconTemplate } from '../src/components/ui/favicon-template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const LOGO_SIZE = 64
const OUTPUT_PATH = join(__dirname, '../public/static/logo.svg')

async function generateLogo(): Promise<void> {
  console.log('🎨 Generating logo.svg...\n')

  // Create React element using the FaviconTemplate with logo size
  const element = createElement(FaviconTemplate, { size: LOGO_SIZE })

  // Generate SVG using Satori
  const svg = await satori(element, {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
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

  // Write SVG directly to file
  await writeFile(OUTPUT_PATH, svg)

  console.log(`✓ Generated: ${OUTPUT_PATH}`)
  console.log('\n✅ Done!')
}

// Run the generator
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  generateLogo().catch(console.error)
}
