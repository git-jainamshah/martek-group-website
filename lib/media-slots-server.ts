/**
 * Server-side slot resolution (kept separate from lib/media-slots.ts so the
 * pure slot registry stays importable from client components).
 */
import { SLOT_DEFS } from './media-slots'

export type SlotValues = Record<string, string>

/** Server-side: resolved slot map (defaults + database overrides). */
export async function getSlots(): Promise<SlotValues> {
  const values: SlotValues = {}
  for (const s of SLOT_DEFS) values[s.key] = s.defaultPath
  try {
    const { getSetting } = require('./admin/db') as typeof import('./admin/db')
    const overrides = await getSetting<SlotValues>('media_slots')
    if (overrides) {
      for (const [k, v] of Object.entries(overrides)) {
        if (values[k] !== undefined && typeof v === 'string' && v.startsWith('/')) values[k] = v
      }
    }
  } catch { /* no DB - defaults */ }
  return values
}

export async function getSlot(key: string): Promise<string> {
  const all = await getSlots()
  return all[key] ?? SLOT_DEFS.find((s) => s.key === key)?.defaultPath ?? ''
}
