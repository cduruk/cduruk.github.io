# Hero Image Generation

This directory contains a TypeScript script to automatically generate hero/banner images for blog posts.

## How It Works

The script ([generate-hero-images.ts](./generate-hero-images.ts)) scans all blog posts in `src/content/blog/` and generates banner images for any posts that don't already have one.

It uses:
- **Satori**: Converts React/TSX components to SVG
- **Resvg**: Converts SVG to PNG
- **Sharp**: Optimizes the final PNG
- **tsx**: TypeScript execution for Node.js

## Usage

### Manual Generation

To generate images manually:

```bash
npm run generate-images
```

### Automatic Generation

Images are automatically generated during the build process:

```bash
npm run build
```

The build script runs `generate-images` before building the site.

## How Images Are Generated

The script:

1. Reads all blog post directories
2. Checks for existing `banner.png`, `banner.jpg`, etc.
3. For posts without banners (and not marked as draft), it:
   - Extracts frontmatter (title, description, date, tags)
   - Generates a 1200x630 PNG image with:
     - Purple gradient background
     - Title in large, bold text
     - Description (if provided)
     - Date and tags in the footer
4. Saves the image as `banner.png` in the post's directory

## Customization

The hero image template is a React component defined in **[src/components/ui/hero-template.tsx](../src/components/ui/hero-template.tsx)**. This file is separate from the generation script to make customization easier.

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

## Adding Images to Posts

Once generated, add the image to your post's frontmatter:

```yaml
---
title: 'My Post Title'
description: 'My post description'
date: 2025-10-24
image: './banner.png'
---
```

## Skipping Auto-Generation

If you want to skip auto-generation for a specific post:

1. Create an empty `banner.png` file in the post directory, OR
2. Mark the post as `draft: true`, OR
3. Manually create your own banner image

## Troubleshooting

### "No fonts are loaded" error

Make sure `@fontsource/inter` is installed:

```bash
npm install --save-dev @fontsource/inter
```

### Images not appearing

1. Check the post's frontmatter has `image: './banner.png'`
2. Verify the banner file exists in the post directory
3. Check file permissions

### Image quality issues

Adjust the Sharp compression settings in the script:

```js
.png({ quality: 90, compressionLevel: 9 })
```

Higher quality = larger file size.
