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
  { name: 'Instagram', label: '@marrelay', href: 'https://www.instagram.com/marrelay' },
  { name: 'LinkedIn', label: '/company/marrelay', href: 'https://www.linkedin.com/company/marrelay' },
  { name: 'X', label: '@marrelay', href: 'https://x.com/marrelay' },
  { name: 'Facebook', label: '/marrelay', href: 'https://www.facebook.com/marrelay' },
]
