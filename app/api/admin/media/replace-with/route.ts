import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'
import { invalidateRefCache, hasWritableStorage, READONLY_STORAGE_MSG } from '@/lib/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/media/replace-with — replace a linked media slot with an
 * EXISTING library file (must be unlinked, same type + format).
 * The target URL stays the same; the old file is archived.
 * body: { targetPath: string, sourceId: number }
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error

  if (!hasWritableStorage()) {
    return NextResponse.json({ error: READONLY_STORAGE_MSG }, { status: 501 })
  }

  const { targetPath, sourceId } = await req.json().catch(() => ({}))
  if (!String(targetPath || '').match(/^\/(assets|uploads)\/[\w\-.() ]+$/) || !sourceId) {
    return NextResponse.json({ error: 'Invalid target or source.' }, { status: 400 })
  }

  const source = await q1<any>('SELECT * FROM media WHERE id = $1', [Number(sourceId)])
  if (!source) return NextResponse.json({ error: 'Source media not found.' }, { status: 404 })
  if (source.rel_path === targetPath) {
    return NextResponse.json({ error: 'Source and target are the same file.' }, { status: 400 })
  }
  // Reusing media that's already linked elsewhere is allowed — media is not
  // one-time-use. The UI warns when the TARGET file is shared across pages.

  const targetExt = path.extname(targetPath).toLowerCase()
  const sourceExt = path.extname(source.rel_path).toLowerCase()
  if (targetExt !== sourceExt) {
    return NextResponse.json(
      { error: `The chosen file is ${sourceExt.toUpperCase().slice(1)} but this slot needs ${targetExt.toUpperCase().slice(1)} so existing links keep working.` },
      { status: 400 }
    )
  }

  const root = process.cwd()
  const targetFull = path.join(root, 'public', String(targetPath).replace(/^\//, ''))
  const sourceFull = path.join(root, 'public', String(source.rel_path).replace(/^\//, ''))
  if (!fs.existsSync(targetFull) || !fs.existsSync(sourceFull)) {
    return NextResponse.json({ error: 'File missing on disk.' }, { status: 404 })
  }

  // Archive current version, then copy the library file over the slot
  const archiveDir = path.join(root, 'public', 'uploads', 'archive')
  fs.mkdirSync(archiveDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  fs.copyFileSync(targetFull, path.join(archiveDir, `${stamp}-${path.basename(targetPath)}`))
  fs.copyFileSync(sourceFull, targetFull)

  const st = fs.statSync(targetFull)
  await run('UPDATE media SET size = $1, modified_at = now() WHERE rel_path = $2', [st.size, targetPath])

  invalidateRefCache()
  await audit(auth.user.email, 'media_replace_with', `${source.rel_path} → ${targetPath}`)
  return NextResponse.json({ ok: true })
}
