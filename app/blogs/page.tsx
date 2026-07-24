import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS, sortByPopularity, formatPostDate } from '@/lib/blog'
import { getViewCounts } from '@/lib/blog/views-server'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical guides on analytics, web performance, and engineering/CAD for small and mid-size businesses. Written to be used, not skimmed.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    title: 'Marrelay - Blog',
    description: 'Practical guides on analytics, web performance, and engineering/CAD for small and mid-size businesses.',
    url: '/blogs',
  },
}

export default async function BlogsPage() {
  const views = await getViewCounts()
  const sorted = sortByPopularity(POSTS, views)
  const [featured, ...rest] = sorted

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <span className="here">Blog</span>
      </div>

      <header className="bl-head" data-reveal>
        <div className="kicker">Field notes</div>
        <h1>
          Guides we wish <span className="serif-it">someone</span> had written for us.
        </h1>
        <p className="lede">
          No fluff, no gated PDFs. Step-by-step guides on analytics, site performance, and engineering files, written
          for the person who has to make the decision.
        </p>
      </header>

      {featured && (
        <Link href={`/blogs/${featured.slug}`} className="bl-featured" data-reveal>
          <div className="bl-featured-body">
            <div className="bl-meta">
              <span className="bl-cat">{featured.category}</span>
              <span>Most read</span>
              <span>·</span>
              <span>{featured.readMinutes} min</span>
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className="bl-more">
              Read the guide
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" />
              </svg>
            </span>
          </div>
        </Link>
      )}

      <div className="bl-grid" data-reveal>
        {rest.map((p) => (
          <Link key={p.slug} href={`/blogs/${p.slug}`} className="bl-card">
            <span className="bl-cat">{p.category}</span>
            <h3>{p.cardTitle ?? p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="bl-card-foot">
              {formatPostDate(p.date)} · {p.readMinutes} min read
            </span>
          </Link>
        ))}
      </div>

      <p className="bl-note">
        More guides are on the way. Got a question you want answered properly?{' '}
        <Link href="/contact">Ask us</Link> and we may write it up.
      </p>
    </div>
  )
}
