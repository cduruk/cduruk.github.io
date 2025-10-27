# Build & Asset Generation Scripts

This directory contains TypeScript scripts for managing blog posts and generating website assets.

## Scripts Overview

### Content Management
- **[new-post.ts](./new-post.ts)**: Interactive CLI for creating new blog posts with auto-generated OG images

### Asset Generation
- **[generate-favicon.ts](./generate-favicon.ts)**: Generates all favicon sizes (16x16, 32x32, 96x96, 180x180, 192x192, 512x512) and favicon.ico
- **[generate-logo.ts](./generate-logo.ts)**: Generates the site logo (logo.svg) used in the header
- **[generate-default-og.ts](./generate-default-og.ts)**: Generates the default fallback OG image (1200x630.png)
- **[generate-og-images.ts](./generate-og-images.ts)**: Generates Open Graph images for blog posts and static pages

All asset generation scripts use:
- **Satori**: Converts React/TSX components to SVG
- **Resvg**: Converts SVG to PNG (for raster images)
- **Sharp**: Optimizes PNG images
- **tsx**: TypeScript execution for Node.js

---

# Favicon Generation

The `generate-favicon.ts` script generates all required favicon sizes for the website.

## Usage

```bash
npx tsx scripts/generate-favicon.ts
```

## What It Generates

The script creates all favicon files in the `public/` directory:

- `favicon-16x16.png` - Standard browser tab icon (small)
- `favicon-32x32.png` - Standard browser tab icon (medium)
- `favicon-96x96.png` - Standard browser tab icon (large)
- `favicon.ico` - Legacy browser support (generated from 32x32)
- `apple-touch-icon.png` (180x180) - iOS home screen icon
- `web-app-manifest-192x192.png` - PWA icon (small)
- `web-app-manifest-512x512.png` - PWA icon (large)

## Design

All favicons feature the "-1" logo in white text on a red rounded box background (#F89C91). The design uses:

- **Responsive font sizing**: 65% of canvas size (e.g., 16px canvas = 10px font, 512px canvas = 333px font)
- **Vertical centering**: 5% paddingTop to compensate for text baseline offset
- **Consistent branding**: Same template across all sizes

## Template

The favicon design is defined in **[src/components/ui/favicon-template.tsx](../src/components/ui/favicon-template.tsx)**. The template accepts a `size` prop and automatically scales the font and padding for optimal appearance at any size.

---

# Logo Generation

The `generate-logo.ts` script generates the site logo used in the header navigation.

## Usage

```bash
npx tsx scripts/generate-logo.ts
```

## What It Generates

Creates `public/static/logo.svg` - a 64x64 SVG logo with the "-1" design, used in the site header.

## Design

The logo uses the exact same `FaviconTemplate` component as the favicons, ensuring perfect visual consistency across all branding assets.

---

# Default OG Image Generation

The `generate-default-og.ts` script creates the fallback Open Graph image used when a page doesn't have a custom OG image.

## Usage

```bash
npx tsx scripts/generate-default-og.ts
```

## What It Generates

Creates `public/static/1200x630.png` - a 1200x630 PNG image featuring:
- Large centered "-1" logo (200x200 red box)
- "Off by One" title
- "by Can Duruk" subtitle
- Dark background with Flexoki colors

This image is used as a fallback in `PageHead.astro` and `PostHead.astro` when no custom OG image is provided.

## Template

The default OG image design is defined in **[src/components/ui/default-og-template.tsx](../src/components/ui/default-og-template.tsx)**.

---

# Creating New Blog Posts

The `new-post.ts` script provides an interactive CLI for creating new blog posts with all the required metadata and structure.

## Usage

```bash
npm run new-post
```

## What It Does

The script will prompt you for:

1. **Title** (required) - The post title
2. **Description** (required) - A brief description for SEO/social sharing
3. **Tags** (optional) - Comma-separated list of tags (e.g., `engineering-management, hiring`)
4. **Draft status** (optional) - Whether to mark the post as a draft

Then it will:

1. Generate a URL-friendly slug from the title
2. Create a new directory: `src/content/blog/[slug]/`
3. Create `index.mdx` with:
   - Properly formatted frontmatter
   - Current date
   - Default author (`cduruk`)
   - Starter template with Callout component import
4. **Automatically generate an Open Graph image** for the post

## Example

```
📝 Create New Blog Post

Post title: Running 1:1s for Engineers
Generated slug: running-11s-for-engineers

Description: A practical framework for running weekly engineering 1:1s
Tags (comma-separated, or press enter to skip): engineering-management
Create as draft? (y/N): n

✅ Created src/content/blog/running-11s-for-engineers/index.mdx
📌 Post created as draft

🎨 Generating Open Graph image...
Generating image for: Running 1:1s for Engineers
✓ Generated: /path/to/running-11s-for-engineers/og-image.png
✅ OG image generated successfully

💡 Next steps:
   1. Edit running-11s-for-engineers/index.mdx
   2. Run "npm run dev" to preview your post
```

## Generated File Structure

```
src/content/blog/your-post-slug/
├── index.mdx      # Main post content
└── og-image.png   # Auto-generated social media preview
```

## Post Template

The generated `index.mdx` includes:

```mdx
---
title: 'Your Post Title'
description: 'Your description'
date: 2025-10-27
tags: ['tag1', 'tag2']
ogImage: './og-image.png'
authors: ['cduruk']
draft: true  # Only if you selected draft mode
---

import Callout from '@/components/Callout.astro'

## Introduction

Your content here...
```

---

# Open Graph Image Generation

This directory also contains a script to automatically generate Open Graph (social media preview) images for both blog posts and static pages.

## How It Works

The script ([generate-og-images.ts](./generate-og-images.ts)):
- Scans all blog posts in `src/content/blog/` and generates `og-image.png` files for any posts that don't already have one
- Generates OG images for static pages (e.g., About, Subscribe) defined in the `getStaticPages()` function

It uses:
- **Satori**: Converts React/TSX components to SVG
- **Resvg**: Converts SVG to PNG
- **Sharp**: Optimizes the final PNG
- **tsx**: TypeScript execution for Node.js

## Usage

### Manual Generation

To generate OG images manually:

```bash
npm run generate-og-images
```

Example output:

```
🎨 Generating OG images...

📝 Blog posts:
  ✨ All posts already have OG images!

📄 Static pages:
  Generating OG image for: about
  ✓ Generated OG image: /static/og/about.png
  Generating OG image for: subscribe
  ✓ Generated OG image: /static/og/subscribe.png

✅ Done!
```

### Automatic Generation

OG images are automatically generated during the build process:

```bash
npm run build
```

The build script runs `generate-og-images` before building the site.

## How Images Are Generated

### Blog Posts

For each blog post, the script:

1. Reads all blog post directories in `src/content/blog/`
2. Checks for existing `og-image.png`, `og-image.jpg`, etc.
3. For posts without OG images (and not marked as draft), it:
   - Extracts frontmatter (title, description)
   - Generates a 1200x630 PNG image with:
     - Flexoki dark theme background
     - Title in large, bold text
     - Description (if provided)
     - "Off by One" branding in the footer
4. Saves the image as `og-image.png` in the post's directory

### Static Pages

For static pages (About, Subscribe, etc.), the script:

1. Reads the list of pages from `getStaticPages()` in [generate-og-images.ts](./generate-og-images.ts)
2. For each defined page, it:
   - Uses the configured title and description
   - Generates a 1200x630 PNG image using the same template as blog posts
   - Saves the image to `public/static/og/{page-name}.png`

Static page OG images are always regenerated on each build to ensure they stay up to date.

## Customization

The OG image template is a React component defined in **[src/components/ui/hero-template.tsx](../src/components/ui/hero-template.tsx)**. This file is separate from the generation script to make customization easier.

Since it's a real TSX file, you can:
- Use JSX syntax for layout
- Add TypeScript types for props
- Use React patterns you're familiar with
- Get full IDE autocompletion and type checking

### Changing Colors

Edit the gradient in the background style:

```js
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
```

### Changing Layout

The template uses a React-like component structure. You can modify:
- Font sizes
- Spacing (padding, gap)
- Layout (flexbox properties)
- What information is displayed

### Changing Fonts

Currently uses Inter font. To use a different font:

1. Install the font package:
   ```bash
   npm install --save-dev @fontsource/your-font
   ```

2. Update the fonts array in the script:
   ```js
   fonts: [
     {
       name: 'Your Font',
       data: await readFile(join(__dirname, '../node_modules/@fontsource/your-font/files/...')),
       weight: 400,
       style: 'normal',
     },
   ]
   ```

## Adding Static Pages

To add a new static page to OG image generation:

1. **Define the page** in `getStaticPages()` in [generate-og-images.ts](./generate-og-images.ts):

```typescript
{
  name: 'contact',  // Used for filename: contact.png
  title: 'Contact Me',  // Displayed on the OG image
  description: 'Get in touch with me.',  // Optional subtitle
  outputPath: join(OG_DIR, 'contact.png'),
}
```

2. **Reference the image** in your page component (e.g., `src/pages/contact.astro`):

```astro
<PageHead slot="head" title="Contact" ogImage="/static/og/contact.png" />
```

3. **Run the build** to generate the image:

```bash
npm run build
```

The OG image will be created at `public/static/og/contact.png` and automatically included in your page's meta tags.

### Current Static Pages

The following static pages currently have OG images generated:
- **About** (`/static/og/about.png`)
- **Subscribe** (`/static/og/subscribe.png`)

## Image Specifications

- **Dimensions**: 1200x630 (optimal for Open Graph/social sharing)
- **Format**: PNG
- **Compression**: Level 9, Quality 90
- **Average size**:
  - Blog posts: ~60-80 KB
  - Static pages: ~8-11 KB

## Adding OG Images to Your Content

### Blog Posts

If you created your post with `npm run new-post`, the `ogImage` field is automatically added to your frontmatter.

For manually created posts, add the image reference to your post's frontmatter:

```yaml
---
title: 'My Post Title'
description: 'My post description'
date: 2025-10-24
ogImage: './og-image.png'
---
```

Then run `npm run generate-og-images` to generate the image.

**Note:** The `ogImage` field is separate from the `image` field:
- `ogImage`: Used for Open Graph/social media previews only
- `image`: Used for page banners and listing thumbnails

### Static Pages

For static pages, pass the `ogImage` prop to the `PageHead` component:

```astro
<PageHead slot="head" title="Page Title" ogImage="/static/og/page-name.png" />
```

The image path should match the `outputPath` defined in `getStaticPages()` (relative to the `public/` directory).

## Skipping Auto-Generation

### Blog Posts

If you want to skip auto-generation for a specific blog post:

1. Create an empty `og-image.png` file in the post directory, OR
2. Mark the post as `draft: true`, OR
3. Manually create your own OG image

### Static Pages

Static page OG images are always regenerated during the build process to ensure they stay current. To use a custom OG image for a static page, reference a different image path in the `PageHead` component instead of the generated one.

## Troubleshooting

### "No fonts are loaded" error

Make sure `@fontsource/inter` is installed:

```bash
npm install --save-dev @fontsource/inter
```

### OG images not appearing in social previews

1. Check the post's frontmatter has `ogImage: './og-image.png'`
2. Verify the og-image file exists in the post directory
3. Test with social media preview tools (Facebook Debugger, Twitter Card Validator)
4. Check file permissions

### Image quality issues

Adjust the Sharp compression settings in the script:

```js
.png({ quality: 90, compressionLevel: 9 })
```

Higher quality = larger file size.
