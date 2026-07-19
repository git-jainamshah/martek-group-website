import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'
import { isLinked, hasWritableStorage, READONLY_STORAGE_MSG } from '@/lib/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** DELETE /api/admin/media/:id - blocked when the file is linked on the site */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error

  const row = await q1<any>('SELECT * FROM media WHERE id = $1', [Number(params.id)])
  if (!row) return NextResponse.json({ error: 'Media not found.' }, { status: 404 })

  const links = isLinked(row.rel_path)
  if (links.length > 0) {
    return NextResponse.json(
      {
        error: `"${row.filename}" is linked on the production site and can't be deleted. Unlink or replace it first.`,
        links,
      },
      { status: 409 }
    )
  }

  if (!hasWritableStorage()) {
    return NextResponse.json({ error: READONLY_STORAGE_MSG }, { status: 501 })
  }

  const full = path.join(process.cwd(), 'public', row.rel_path.replace(/^\//, ''))
  if (fs.existsSync(full)) fs.unlinkSync(full)
  await run('DELETE FROM media WHERE id = $1', [row.id])
  await audit(auth.user.email, 'media_delete', row.rel_path)
  return NextResponse.json({ ok: true })
}
