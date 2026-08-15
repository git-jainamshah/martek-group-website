import Link from 'next/link'
import { LINK_RE } from '@/lib/blog/richtext'

/**
 * Renders the inline link markup described in lib/blog/richtext.ts.
 *
 * Internal links use next/link so navigation stays client-side; external links
 * get rel="noopener noreferrer". Labels and hrefs are both treated as text and
 * escaped by React, so authored copy can never inject markup.
 */
export function richText(text: string): React.ReactNode {
  if (!text.includes('](')) return text

  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  LINK_RE.lastIndex = 0

  while ((m = LINK_RE.exec(text)) !== null) {
    const [full, label, href] = m
    if (m.index > last) out.push(text.slice(last, m.index))

    if (href.startsWith('/')) {
      out.push(<Link key={m.index} href={href}>{label}</Link>)
    } else if (/^https?:\/\//.test(href)) {
      out.push(
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
      )
    } else {
      // Not a shape we recognise. Leave the author's text exactly as written
      // rather than silently dropping it.
      out.push(full)
    }
    last = m.index + full.length
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}
