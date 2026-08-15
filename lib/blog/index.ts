import type { Post } from './types'
import { consentModeV2 } from './posts/consent-mode-v2'
import { coreWebVitals } from './posts/core-web-vitals'
import { cadFileFormats } from './posts/cad-file-formats'
import { cheapestDigitalSetup } from './posts/cheapest-digital-setup'
import { websiteCostComparison } from './posts/website-cost-comparison'
import { redesignWithoutLosingSeo } from './posts/redesign-without-losing-seo'
import { wordpressWebflowCustom } from './posts/wordpress-webflow-custom'

export type { Post, Block } from './types'
export { tocOf, blockText } from './types'

/** All published posts, newest first. */
export const POSTS: Post[] = [
  consentModeV2,
  coreWebVitals,
  cadFileFormats,
  cheapestDigitalSetup,
  websiteCostComparison,
  redesignWithoutLosingSeo,
  wordpressWebflowCustom,
].sort(
  (a, b) => (a.date < b.date ? 1 : -1)
)

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)

export const postSlugs = () => POSTS.map((p) => p.slug)

/**
 * Sort posts by popularity. Real view counts come from the DB; `seedViews`
 * provides a sensible order until a post has been read enough to rank itself.
 */
export function sortByPopularity(posts: Post[], views: Record<string, number> = {}) {
  return [...posts].sort((a, b) => (views[b.slug] ?? 0) + b.seedViews - ((views[a.slug] ?? 0) + a.seedViews))
}

/** Other posts to suggest at the end of an article. */
export function relatedPosts(slug: string, limit = 2, views: Record<string, number> = {}) {
  return sortByPopularity(POSTS.filter((p) => p.slug !== slug), views).slice(0, limit)
}

export const formatPostDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}
