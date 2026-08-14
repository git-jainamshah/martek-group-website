import { NextResponse } from 'next/server'
import { ensureDb } from '@/lib/admin/db'
import { q } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Names for the @mention picker.
 *
 * Separate from /api/admin/users, which is admin-only and returns password
 * state and audit fields. Anyone who can write a note needs to be able to tag a
 * colleague, so this exposes only what the picker renders: id, name, role.
 */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const users = await q(
    `SELECT id, first_name, last_name, role FROM users
      WHERE active = 1 ORDER BY lower(first_name), lower(last_name)`
  )
  return NextResponse.json({ users })
}
