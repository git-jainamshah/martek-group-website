import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { audit } from '@/lib/admin/db'
import { q, run } from '@/lib/admin/pg'
import { requireUser, requireEditor } from '@/lib/admin/auth'
import { findAssetReferences, syncMediaIndex, invalidateRefCache, hasWritableStorage, READONLY_STORAGE_MSG } from '@/lib/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /api/admin/media - full media list with link info */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error

  await syncMediaIndex()
  const refs = findAssetReferences()
  const rows = await q('SELECT * FROM media ORDER BY modified_at DESC')

  const media = rows.map((r: any) => ({
    id: r.id,
    filename: r.filename,
    relPath: r.rel_path,
    kind: r.kind,
    mime: r.mime,
    size: Number(r.size),
    addedAt: r.added_at,
    modifiedAt: r.modified_at,
    links: refs.get(r.rel_path) ?? [],
  }))

  return NextResponse.json({ media, storageWritable: hasWritableStorage() })
}

/** POST /api/admin/media - upload a new file (multipart form: file) into /public/uploads */
export async function POST(req: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error

  if (!hasWritableStorage()) {
    return NextResponse.json({ error: READONLY_STORAGE_MSG }, { status: 501 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  if (file.size > 200 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds 200 MB limit.' }, { status: 400 })

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadsDir, { recursive: true })

  const safeName = file.name.replace(/[^\w\-. ]/g, '_')
  let target = path.join(uploadsDir, safeName)
  let finalName = safeName
  let n = 1
  while (fs.existsSync(target)) {
    const ext = path.extname(safeName)
    finalName = `${path.basename(safeName, ext)}-${n}${ext}`
    target = path.join(uploadsDir, finalName)
    n++
  }

  const buf = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(target, buf)

  const ext = path.extname(finalName).toLowerCase()
  const kind = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'photo'
  await run(
    `INSERT INTO media (filename, rel_path, kind, mime, size) VALUES ($1, $2, $3, $4, $5)`,
    [finalName, `/uploads/${finalName}`, kind, file.type || null, buf.length]
  )

  invalidateRefCache()
  await audit(auth.user.email, 'media_upload', finalName)
  return NextResponse.json({ ok: true, relPath: `/uploads/${finalName}` })
}
