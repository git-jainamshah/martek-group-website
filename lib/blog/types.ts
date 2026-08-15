/**
 * Blog content model.
 *
 * Posts are authored as typed content blocks rather than raw HTML so every article
 * renders with consistent styling, gets a table of contents for free (from `h2`
 * blocks), and stays safe to render.
 */

import type { BrandKey } from '@/components/blog/Brands'
import { plainText } from './richtext'

export type Block =
  | { t: 'h2'; id: string; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string }
  | { t: 'lead'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'steps'; items: { title: string; body: string }[] }
  | { t: 'code'; lang?: string; caption?: string; code: string }
  | { t: 'callout'; kind: 'tip' | 'warn' | 'note'; title?: string; text: string }
  | { t: 'quote'; text: string }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'figure'; kind: 'consent-flow' | 'cwv-meters' | 'cad-formats' | 'redirect-map' | 'redesign-recovery' | 'platform-tradeoff' | 'oai-measure-flow' | 'cpm-vs-cpc'; caption: string }
  | { t: 'faq'; items: { q: string; a: string }[] }
  /* External references. Rendered with the source name so a reader can see it
     points at primary documentation rather than another blog. */
  | { t: 'sources'; title?: string; items: { label: string; url: string; note?: string }[] }
  /* A row of platform marks, used to show at a glance which tools a section
     covers. `key` selects a mark we are licensed/permitted to display. */
  | { t: 'brands'; items: { key: BrandKey; label: string }[] }
  | { t: 'divider' }

export type Post = {
  slug: string
  title: string
  /** Short, punchy title for cards and nav. */
  cardTitle?: string
  /**
   * Title used in the <title> tag and search results, when the on-page H1 is
   * too long to survive there. Google truncates around 60 characters, so a
   * 78-character headline gets cut mid-phrase in the SERP. Keeping this
   * separate lets the article keep the headline it deserves while the search
   * listing stays whole. Falls back to `title`.
   */
  seoTitle?: string
  excerpt: string
  /** Used for <meta description> - keep at or under 160 chars. */
  description: string
  category: string
  /** ISO date, e.g. 2026-07-24 */
  date: string
  updated?: string
  readMinutes: number
  author: { name: string; role: string }
  tags: string[]
  /** Fallback ordering before real view counts exist (higher = more prominent). */
  seedViews: number
  blocks: Block[]
}

/** Text of the block, used for reading-time and search snippets. */
export function blockText(b: Block): string {
  return plainText(rawBlockText(b))
}

function rawBlockText(b: Block): string {
  switch (b.t) {
    case 'h2':
    case 'h3':
    case 'p':
    case 'lead':
    case 'quote':
      return b.text
    case 'ul':
    case 'ol':
      return b.items.join(' ')
    case 'steps':
      return b.items.map((i) => `${i.title} ${i.body}`).join(' ')
    case 'code':
      return b.caption ?? ''
    case 'callout':
      return `${b.title ?? ''} ${b.text}`
    case 'table':
      return [b.head.join(' '), ...b.rows.map((r) => r.join(' '))].join(' ')
    case 'figure':
      return b.caption
    case 'faq':
      return b.items.map((i) => `${i.q} ${i.a}`).join(' ')
    default:
      return ''
  }
}

/** Headings that become the table of contents. */
export function tocOf(post: Post) {
  return post.blocks.filter((b): b is Extract<Block, { t: 'h2' }> => b.t === 'h2')
}
