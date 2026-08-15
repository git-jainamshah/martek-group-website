import Link from 'next/link'
import { LINK_RE, MONEY_RE } from '@/lib/blog/richtext'
import { Money } from './Money'

/**
 * Renders the inline markup described in lib/blog/richtext.ts: links and
 * prices, and nothing else.
 *
 * Internal links use next/link so navigation stays client-side; external links
 * get rel="noopener noreferrer". Labels and hrefs are both treated as text and
 * escaped by React, so authored copy can never inject markup.
 */

/** Split on {{1500}} price tokens, leaving everything else untouched. */
function withMoney(text: string, keyPrefix: string): React.ReactNode {
  if (!text.includes('{{')) return text
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  MONEY_RE.lastIndex = 0
  while ((m = MONEY_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(<Money key={`${keyPrefix}m${m.index}`} cad={Number(m[1])} />)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function richText(text: string): React.ReactNode {
  if (!text.includes('](')) return withMoney(text, 'x')

  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  LINK_RE.lastIndex = 0

  while ((m = LINK_RE.exec(text)) !== null) {
    const [full, label, href] = m
    if (m.index > last) out.push(withMoney(text.slice(last, m.index), `a${m.index}`))

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

  if (last < text.length) out.push(withMoney(text.slice(last), 'z'))
  return out
}
