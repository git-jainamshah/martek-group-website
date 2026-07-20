import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit, purgeExpiredDeletedLeads } from '@/lib/admin/db'
import { q, run } from '@/lib/admin/pg'
import { requireLeadsEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Bulk lead operations:
 *  { action: 'delete',  ids: number[] }  - move to the Delete Folder (soft delete)
 *  { action: 'restore', ids: number[] }  - recover from the Delete Folder
 *  { action: 'destroy', ids: number[] }  - PERMANENT delete (Delete Folder items only)
 *
 * Items in the Delete Folder are purged automatically after 60 days.
 */
export async function POST(req: NextRequest) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  await ensureDb()
  await purgeExpiredDeletedLeads()

  const { action, ids } = await req.json().catch(() => ({}))
  const idList: number[] = Array.isArray(ids) ? ids.map(Number).filter((n) => Number.isInteger(n)) : []
  if (!idList.length) return NextResponse.json({ error: 'No records selected.' }, { status: 400 })
  if (idList.length > 500) return NextResponse.json({ error: 'Too many records at once (max 500).' }, { status: 400 })

  const placeholders = idList.map((_, i) => `$${i + 1}`).join(',')

  if (action === 'delete') {
    const rows = await q<{ id: number }>(
      `UPDATE leads SET deleted_at = now(), updated_at = now()
       WHERE id IN (${placeholders}) AND deleted_at IS NULL RETURNING id`,
      idList
    )
    await audit(auth.user.email, 'leads_bulk_delete', `${rows.length} record(s): ${rows.map((r) => r.id).join(',')}`)
    return NextResponse.json({ ok: true, count: rows.length })
  }

  if (action === 'restore') {
    const rows = await q<{ id: number }>(
      `UPDATE leads SET deleted_at = NULL, updated_at = now()
       WHERE id IN (${placeholders}) AND deleted_at IS NOT NULL RETURNING id`,
      idList
    )
    await audit(auth.user.email, 'leads_bulk_restore', `${rows.length} record(s)`)
    return NextResponse.json({ ok: true, count: rows.length })
  }

  if (action === 'destroy') {
    // Only records already in the Delete Folder can be destroyed
    const targets = await q<{ id: number }>(
      `SELECT id FROM leads WHERE id IN (${placeholders}) AND deleted_at IS NOT NULL`,
      idList
    )
    for (const t of targets) {
      await run('DELETE FROM leads_marketing WHERE lead_id = $1', [t.id])
      await run('DELETE FROM leads_offline WHERE lead_id = $1', [t.id])
      await run('DELETE FROM leads WHERE id = $1', [t.id])
    }
    await audit(auth.user.email, 'leads_bulk_destroy', `${targets.length} record(s) permanently deleted`)
    return NextResponse.json({ ok: true, count: targets.length })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
