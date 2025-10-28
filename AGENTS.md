# Agent Guidelines

## General Best Practices

- Maintain existing Markdown formatting when editing documentation (respect heading levels, tables, and blockquotes).
- Prefer fenced code blocks with explicit language identifiers when adding examples.
- Run available package scripts (e.g., `npm run build`, `npm run lint`) before claiming tests have passed.

## Blog Post Creation

- Always use `npm run new-post` rather than manually creating post directories.
- This ensures proper directory structure, frontmatter formatting, and auto-generates OG images.
- The script will prompt for title, description, tags, and draft status.

## Asset Generation & Templates

- When modifying OG image designs or favicon designs, edit the React templates in `src/components/ui/`:
  - `hero-template.tsx` - Blog post and static page OG images
  - `favicon-template.tsx` - Favicons and logo
  - `default-og-template.tsx` - Default fallback OG image
- Don't edit the generation scripts in `scripts/` unless changing the generation process itself.
- OG images are auto-generated during build via `npm run build`.
- Manual generation is available via `npm run generate-og-images`.

## Color Scheme

- Maintain Flexoki color scheme consistency across all visual assets.
- Refer to existing template files for correct color values:
  - Brand red: `#AF3029`
  - Highlight red: `#FC4B44`
  - Background (dark): `#100F0F`
  - Foreground (light): `#F2F0E5` / `#FFFCF0`
  - Muted text: `#878580`
  - Border: `#343331`

## Build Process

- The build process automatically runs `generate-og-images` before `astro check` and `astro build`.
- Always run `npm run build` to verify changes don't break the build pipeline.
- Check the build output for any errors or warnings before committing.
