/**
 * Minimal inline markup for authored copy.
 *
 * Posts are authored as plain strings, which keeps the content model simple but
 * meant an article could not link to another article mid-sentence. Contextual
 * internal links are how search engines work out which pages relate to each
 * other, so the gap was worth closing, but not worth a full markdown parser.
 *
 * Supported, deliberately, is exactly one construct:
 *
 *   [visible label](/blogs/some-slug)    internal
 *   [visible label](https://example.com) external
 *
 * Anything else, including a stray bracket, renders as literal text. There is
 * no HTML in the content model and this does not introduce any.
 *
 * This file is pure and React-free on purpose: `lib/blog` is imported by the
 * sitemap and by build scripts, which must not drag a component tree along.
 * The rendering half lives in components/blog/RichText.tsx.
 */

export const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Strip the markup so word counts, reading time and search snippets see prose. */
export function plainText(text: string): string {
  return text.replace(LINK_RE, '$1')
}
