# Agent Guidelines

## General Best Practices

- Maintain existing Markdown formatting when editing documentation (respect heading levels, tables, and blockquotes).
- Prefer fenced code blocks with explicit language identifiers when adding examples.
- Run available package scripts (e.g., `npm run build`, `npm run lint`) before claiming tests have passed.

## Git Workflow

**Always work on a new branch and create a PR:**

1. **Create a new branch** at the start of any non-trivial work:
   ```bash
   git checkout -b descriptive-branch-name
   ```

2. **Make commits** as you complete discrete pieces of work:
   - Write clear, descriptive commit messages
   - Include the Claude Code co-author footer
   - Break work into logical commits (e.g., separate commits for import, grammar fixes, link updates)

3. **Push branch and create PR** when work is complete:
   ```bash
   git push -u origin branch-name
   gh pr create --title "..." --body "..."
   ```
   - Write a comprehensive PR description summarizing all changes
   - Include context about what was done and why
   - List key changes as bullet points

4. **Wait for user approval** before merging:
   - Do not merge PRs automatically
   - When user requests merge, use: `gh pr merge <number> --rebase --delete-branch`
   - Repository may require rebase merges (not squash or merge commits)

**Exception:** Small documentation updates or typo fixes may be committed directly to `main` at your discretion.

## Blog Post Creation

- Always use `npm run new-post` rather than manually creating post directories.
- This ensures proper directory structure, frontmatter formatting, and auto-generates OG images.
- The script supports both interactive prompts and CLI flags (`npm run new-post -- --title "..." --description "..." --tags foo,bar`).
- Provide required fields via flags when running non-interactively; otherwise the script will prompt for missing values.
- **Use existing tags whenever possible** - check existing posts in `src/content/blog/` before creating new tags. Common tags include: `business`, `margins`, `tech-industry`, `social-media`, `security`, `engineering-management`, `hiring`, `programming`.

### Importing Posts from External Sources

When importing blog posts from external sites (e.g., Margins, Substack):

1. **Fetch content**: Use `WebFetch` tool to extract the full article text, preserving structure
2. **Download images**: Use `curl` to download all images to the post directory
3. **Create post directory**: `mkdir -p src/content/blog/post-slug/`
4. **Create index.mdx**: Include frontmatter with:
   - Original publication date (preserve historical context)
   - Appropriate tags
   - Note about original publication source using a Callout component
5. **Generate OG image**: Run `npm run generate-og-images` after creating the post
6. **Add reference links**: Link to relevant Wikipedia articles, source materials, and referenced content

### YAML Frontmatter Validation

**Always validate YAML frontmatter for proper quote escaping:**

When frontmatter fields contain apostrophes or contractions (e.g., "don't", "can't", "you'll"):
- **Use double quotes** for the entire string value (preferred for readability)
- **Or double the apostrophe** if using single quotes (`''` becomes the escape sequence)

**Examples:**
```yaml
# ✅ Correct - use double quotes
description: "Why you don't want to make this mistake"

# ✅ Also correct - but harder to read
description: 'Why you don''t want to make this mistake'

# ❌ Incorrect - will break YAML parsing
description: 'Why you don't want to make this mistake'
```

**Why this matters:**
- Invalid YAML causes MDX files to fail parsing during Astro build
- The error prevents the entire post from loading
- Particularly important for `title` and `description` fields

**When to check:**
- When importing posts with user-written descriptions
- When titles or descriptions contain possessives or contractions
- Before running the build process

### Meta Descriptions & SEO

- Meta descriptions must be between **110-160 characters** for optimal SEO
- Be concise but descriptive
- Include key terms without keyword stuffing
- After updating a description, regenerate the OG image with `npm run generate-og-images`

### Embedding Social Media Content

**Twitter/X Embeds:**
- Use the official Twitter embed code from the tweet
- Center embeds using a flex container:
  ```html
  <div style="display: flex; justify-content: center; margin: 2rem 0;">
    <blockquote class="twitter-tweet">...</blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
  ```
- Place embeds contextually where they're first referenced in the text

## Asset Generation & Templates

- When modifying OG image designs or favicon designs, edit the React templates in `src/components/ui/`:
  - `hero-template.tsx` - Blog post and static page OG images
  - `favicon-template.tsx` - Favicons and logo
  - `default-og-template.tsx` - Default fallback OG image
- Don't edit the generation scripts in `scripts/` unless changing the generation process itself.
- OG images are auto-generated during build via `npm run build`.
- Manual generation is available via `npm run generate-og-images`.
  - Pass `--slug slug-one,slug-two` to regenerate specific posts (combine with `--all-posts` to overwrite existing assets).
  - Use `--tasks static` or `--no-static` to control whether static page OGs are rebuilt.

## Color Scheme

- Maintain Flexoki color scheme consistency across all visual assets.
- Refer to existing template files for correct color values:
  - Brand red: `#AF3029`
  - Highlight red: `#FC4B44`
  - Background (dark): `#100F0F`
  - Foreground (light): `#F2F0E5` / `#FFFCF0`
  - Muted text: `#878580`
  - Border: `#343331`

## Copy-Editing & Grammar

When copy-editing blog posts, check for:

- **Missing conjunctions**: "car see" → "car and see"
- **Missing articles**: "Model T is" → "The Model T is", "Google founders'" → "the Google founders'"
- **Missing prepositions**: "because how" → "because of how"
- **Missing verbs**: "to build possible" → "to build became possible"
- **Duplicate words**: "that, many times, that" → "that, many times,"
- **Duplicate prepositions**: "for enough for people" → "for enough people"

After making grammar fixes:
- Create a commit detailing all corrections made
- Be specific about what was fixed (e.g., "Add missing conjunction", "Remove duplicate preposition")

## Build Process

- The build process automatically runs `generate-og-images` before `astro check` and `astro build`.
- Always run `npm run build` to verify changes don't break the build pipeline.
- Check the build output for any errors or warnings before committing.
