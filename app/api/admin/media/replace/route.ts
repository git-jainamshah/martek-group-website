import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'
import { invalidateRefCache } from '@/lib/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/media/replace — swap the file behind a linked media slot.
 * The public URL stays identical, so every place it's linked updates instantly.
 * The previous file is archived to /public/uploads/archive for rollback.
 * multipart form: targetPath (e.g. /assets/hero-loop.mp4), file
 */
export async function POST(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error

  const form = await req.formData()
  const targetPath = String(form.get('targetPath') || '')
  const file = form.get('file') as File | null
  if (!targetPath.match(/^\/(assets|uploads)\/[\w\-.() ]+$/) || !file) {
    return NextResponse.json({ error: 'Invalid target or missing file.' }, { status: 400 })
  }
  if (file.size > 200 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds 200 MB limit.' }, { status: 400 })

  const targetExt = path.extname(targetPath).toLowerCase()
  const newExt = path.extname(file.name).toLowerCase()
  const videos = ['.mp4', '.webm', '.mov']
  const sameKind = videos.includes(targetExt) === videos.includes(newExt)
  if (!sameKind) {
    return NextResponse.json({ error: 'Replacement must be the same media type (photo↔photo, video↔video).' }, { status: 400 })
  }
  if (targetExt !== newExt) {
    return NextResponse.json(
      { error: `Replacement must keep the same file format (${targetExt}) so existing links keep working.` },
      { status: 400 }
    )
  }

  const full = path.join(process.cwd(), 'public', targetPath.replace(/^\//, ''))
  if (!fs.existsSync(full)) return NextResponse.json({ error: 'Target file not found.' }, { status: 404 })

  // Archive current version for rollback
  const archiveDir = path.join(process.cwd(), 'public', 'uploads', 'archive')
  fs.mkdirSync(archiveDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  fs.copyFileSync(full, path.join(archiveDir, `${stamp}-${path.basename(targetPath)}`))

  const buf = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(full, buf)

  db().prepare(
    `UPDATE media SET size = ?, modified_at = datetime('now') WHERE rel_path = ?`
  ).run(buf.length, targetPath)

  invalidateRefCache()
  audit(auth.user.email, 'media_replace', targetPath)
  return NextResponse.json({ ok: true })
}
