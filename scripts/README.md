# Open Graph Image Generation

This directory contains a TypeScript script to automatically generate Open Graph (social media preview) images for blog posts.

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

Once generated, add the image to your post's frontmatter:

```yaml
---
title: 'My Post Title'
description: 'My post description'
date: 2025-10-24
ogImage: './og-image.png'
---
```

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
