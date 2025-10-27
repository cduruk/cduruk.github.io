# Blog Post Scripts

This directory contains TypeScript scripts for managing blog posts.

## Scripts

- **[new-post.ts](./new-post.ts)**: Interactive CLI for creating new blog posts
- **[generate-og-images.ts](./generate-og-images.ts)**: Automatically generates Open Graph (social media preview) images

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

This directory also contains a script to automatically generate Open Graph (social media preview) images for blog posts.

## How It Works

The script ([generate-og-images.ts](./generate-og-images.ts)) scans all blog posts in `src/content/blog/` and generates `og-image.png` files for any posts that don't already have one.

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

### Automatic Generation

OG images are automatically generated during the build process:

```bash
npm run build
```

The build script runs `generate-og-images` before building the site.

## How Images Are Generated

The script:

1. Reads all blog post directories
2. Checks for existing `og-image.png`, `og-image.jpg`, etc.
3. For posts without OG images (and not marked as draft), it:
   - Extracts frontmatter (title, description)
   - Generates a 1200x630 PNG image with:
     - Flexoki dark theme background
     - Title in large, bold text
     - Description (if provided)
     - "Off by One" branding in the footer
4. Saves the image as `og-image.png` in the post's directory

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

## Image Specifications

- **Dimensions**: 1200x630 (optimal for Open Graph/social sharing)
- **Format**: PNG
- **Compression**: Level 9, Quality 90
- **Average size**: ~60-80 KB

## Adding OG Images to Posts

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

## Skipping Auto-Generation

If you want to skip auto-generation for a specific post:

1. Create an empty `og-image.png` file in the post directory, OR
2. Mark the post as `draft: true`, OR
3. Manually create your own OG image

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
