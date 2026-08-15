import Link from 'next/link'
import { POSTS, sortByPopularity, formatPostDate } from '@/lib/blog'
import { getViewCounts } from '@/lib/blog/views-server'
import { plainText } from '@/lib/blog/richtext'

/**
 * Tail-end blog strip for the homepage. Auto-sorted by real view counts
 * (falling back to seed order until posts accumulate reads).
 */
export default async function HomeBlogStrip({ limit = 3 }: { limit?: number }) {
  const views = await getViewCounts()
  const posts = sortByPopularity(POSTS, views).slice(0, limit)
  if (posts.length === 0) return null

  return (
    <section className="home-blog" data-reveal>
      <div className="wrap">
        <div className="home-blog-head">
          <div>
            <div className="kicker">From the blog</div>
            <h2>
              Guides worth <span className="serif-it">your time</span>.
            </h2>
          </div>
          <Link href="/blogs" className="home-blog-all">
            All articles
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" />
            </svg>
          </Link>
        </div>

        <div className="home-blog-grid">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blogs/${p.slug}`} className="bl-card">
              <span className="bl-cat">{p.category}</span>
              <h3>{p.cardTitle ?? p.title}</h3>
              <p>{plainText(p.excerpt)}</p>
              <span className="bl-card-foot">
                {formatPostDate(p.date)} · {p.readMinutes} min read
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
