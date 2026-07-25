import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS, getPost, postSlugs, tocOf, relatedPosts, formatPostDate } from '@/lib/blog'
import { getViewCounts } from '@/lib/blog/views-server'
import { BlockView } from '@/components/blog/Blocks'
import ArticleClient, { ArticleCta } from '@/components/blog/ArticleClient'

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.marrelay.com'

export const revalidate = 300

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: 'Article not found' }
  const url = `/blogs/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `Marrelay - ${post.title}`,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: `Marrelay - ${post.title}`, description: post.description },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const views = await getViewCounts()
  const related = relatedPosts(post.slug, 2, views)
  const toc = tocOf(post)

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [`${SITE}/assets/martek-group-header.png`],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Organization', name: 'Marrelay', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Marrelay',
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/martek-mark.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blogs/${post.slug}` },
    articleSection: post.category,
    wordCount: post.readMinutes * 220,
    inLanguage: 'en',
    keywords: post.tags.join(', '),
  }

  // Breadcrumbs help Google show the Home > Blog > Article path in results.
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blogs` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blogs/${post.slug}` },
    ],
  }

  const faqBlock = post.blocks.find((b) => b.t === 'faq')
  const faqLd =
    faqBlock && faqBlock.t === 'faq'
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqBlock.items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          })),
        }
      : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <ArticleClient slug={post.slug} title={post.title} category={post.category} readMinutes={post.readMinutes} />

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/blogs">Blog</Link>
          <span className="sep">/</span>
          <span className="here">{post.category}</span>
        </div>

        <header className="bp-head">
          <div className="bp-meta">
            <span className="bp-cat">{post.category}</span>
            <span>{formatPostDate(post.date)}</span>
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </div>
          <h1>{post.title}</h1>
          <p className="bp-excerpt">{post.excerpt}</p>
          <div className="bp-author">
            <span className="bp-avatar" aria-hidden="true">M</span>
            <span>
              <b>{post.author.name}</b>
              <small>{post.author.role}</small>
            </span>
          </div>
        </header>

        <div className="bp-layout">
          <aside className="bp-toc" aria-label="On this page">
            <div className="bp-toc-inner">
              <b>On this page</b>
              <nav>
                {toc.map((h) => (
                  <a key={h.id} href={`#${h.id}`}>{h.text}</a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="bp-article">
            {post.blocks.map((b, i) => <BlockView key={i} b={b} />)}

            <div className="bp-tags">
              {post.tags.map((t) => <span key={t}>{t}</span>)}
            </div>

            <section className="bp-cta">
              <h3>Want this handled for you?</h3>
              <p>
                We are a founder-led studio in Toronto. If you would rather not do this yourself, we set it up properly,
                at a fixed price, and hand you everything.
              </p>
              <ArticleCta slug={post.slug} title={post.title} />
            </section>
          </article>
        </div>

        {related.length > 0 && (
          <section className="bp-related">
            <div className="kicker">Keep reading</div>
            <div className="bp-related-grid">
              {related.map((r) => (
                <Link key={r.slug} href={`/blogs/${r.slug}`} className="bp-card">
                  <span className="bp-card-cat">{r.category}</span>
                  <h3>{r.cardTitle ?? r.title}</h3>
                  <p>{r.excerpt}</p>
                  <span className="bp-card-meta">{r.readMinutes} min read</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
