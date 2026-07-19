import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'
import { isLinked } from '@/lib/admin/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** DELETE /api/admin/media/:id — blocked when the file is linked on the site */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error

  const row = db().prepare('SELECT * FROM media WHERE id = ?').get(Number(params.id)) as any
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

  const full = path.join(process.cwd(), 'public', row.rel_path.replace(/^\//, ''))
  if (fs.existsSync(full)) fs.unlinkSync(full)
  db().prepare('DELETE FROM media WHERE id = ?').run(row.id)
  audit(auth.user.email, 'media_delete', row.rel_path)
  return NextResponse.json({ ok: true })
}
