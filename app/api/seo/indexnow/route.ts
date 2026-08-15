import { NextResponse } from 'next/server'
import { POSTS } from '@/lib/blog'
import { isProduction, SITE_URL } from '@/lib/env'

/**
 * IndexNow submission.
 *
 * Bing (and Yandex, Seznam, Naver) accept a direct ping when a URL changes,
 * instead of waiting to rediscover it on their own schedule. Google does not
 * participate, so this is specifically a Bing play: it is the difference
 * between a new article being indexed in hours rather than weeks.
 *
 * The protocol is deliberately simple. We host a text file at
 * /<key>.txt containing the key, which proves we control the domain, then POST
 * a list of URLs alongside that key.
 *
 * This runs on demand rather than on a schedule. Posts are authored in code,
 * so the only time URLs change is a deploy, and hitting this once afterwards
 * is both sufficient and easier to reason about than a cron job that fires
 * whether or not anything changed.
 *
 *   curl -X POST "https://www.marrelay.com/api/seo/indexnow?secret=..."
 */

const KEY = '5148fbc520316c3b053893b1e7a969c4'
const ENDPOINT = 'https://api.indexnow.org/IndexNow'

export const dynamic = 'force-dynamic'

function urls(): string[] {
  return [
    `${SITE_URL}/blogs`,
    ...POSTS.map((p) => `${SITE_URL}/blogs/${p.slug}`),
  ]
}

export async function POST(req: Request) {
  // Staging must never announce itself: qa and dev are noindex, and telling
  // Bing about them would undo that.
  if (!isProduction) {
    return NextResponse.json({ ok: false, reason: 'not production' }, { status: 403 })
  }

  const secret = process.env.INDEXNOW_SECRET?.trim()
  const given = new URL(req.url).searchParams.get('secret')?.trim()
  if (!secret || given !== secret) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  const urlList = urls()
  const host = new URL(SITE_URL).host

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  })

  // 200 and 202 both mean accepted. 422 usually means the key file did not
  // resolve, which is worth surfacing rather than swallowing.
  return NextResponse.json(
    { ok: res.ok, status: res.status, submitted: urlList.length, urls: urlList },
    { status: res.ok ? 200 : 502 }
  )
}
