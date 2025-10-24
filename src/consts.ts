import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Off by One',
  description:
    'astro-erudite is a opinionated, unstyled blogging template—built with Astro, Tailwind, and shadcn/ui.',
  href: 'https://justoffbyone.com',
  author: 'cduruk',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/posts',
    label: 'posts',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://linkedin.com/in/cduruk',
    label: 'LinkedIn',
  },
  {
    href: 'https://x.com/can',
    label: 'Twitter',
  },
  {
    href: 'mailto:can@duruk.net',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
