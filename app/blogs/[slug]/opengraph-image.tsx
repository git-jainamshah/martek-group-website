import { ImageResponse } from 'next/og'
import { getPost, postSlugs } from '@/lib/blog'

/**
 * Per-article social card.
 *
 * Every post used to share one generic site header, which meant nine different
 * articles looked identical in a Slack unfurl, a LinkedIn share or a Google
 * Discover card. Generating one per post costs nothing at request time (these
 * are static, produced at build via generateStaticParams) and gives each
 * article its own recognisable card.
 *
 * Deliberately typographic: no network fonts and no remote images, so the
 * route cannot fail at build because a font CDN was slow.
 */

export const alt = 'Marrelay article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }))
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  const title = post?.cardTitle ?? post?.title ?? 'Marrelay'
  const category = post?.category ?? 'Article'
  const minutes = post?.readMinutes

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0E0E12',
          padding: '72px 80px',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#E4572E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, letterSpacing: -0.3 }}>Marrelay</div>
          <div style={{ display: 'flex', fontSize: 20, color: '#8A8A99' }}>Digital studio, Toronto</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#E4572E',
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 52 ? 62 : 74,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: -1.6,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: '#8A8A99' }}>
          <div style={{ display: 'flex', width: 40, height: 3, background: '#E4572E' }} />
          <div style={{ display: 'flex' }}>marrelay.com</div>
          {minutes ? <div style={{ display: 'flex' }}>{`· ${minutes} min read`}</div> : null}
        </div>
      </div>
    ),
    size
  )
}
