/**
 * Single source of truth for social profiles.
 * Update the URLs here and the header, mobile drawer, footer,
 * contact page, and SEO structured data all pick them up.
 */
export interface SocialLink {
  name: 'Instagram' | 'LinkedIn' | 'X' | 'Facebook'
  label: string
  href: string
}

export const SOCIALS: SocialLink[] = [
  { name: 'Instagram', label: '@martek.studio', href: 'https://www.instagram.com/martek.studio' },
  { name: 'LinkedIn', label: '/company/martek-studio', href: 'https://www.linkedin.com/company/martek-studio' },
  { name: 'X', label: '@martekgroup', href: 'https://x.com/martekgroup' },
  { name: 'Facebook', label: '/martekgroup', href: 'https://www.facebook.com/martekgroup' },
]
