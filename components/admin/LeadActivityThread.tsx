'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fmtDateTime, fmtRelative } from '@/lib/admin/dates'

/**
 * Per-lead activity thread: comments, one level of replies, and @mentions.
 *
 * Mentions are stored as user IDs, not as the literal "@Name" text, so renaming
 * someone never breaks an existing tag and two people with the same first name
 * are never confused for each other. The typed "@Name" is only ever display.
 */

type Mention = { id: number; name: string }
type Note = {
  id: number
  parent_id: number | null
  author_name: string | null
  author_email: string | null
  body: string
  created_at: string
  mentions: Mention[]
}
type ThreadNote = Note & { replies: Note[] }
type Teammate = { id: number; first_name: string; last_name: string; role: string }

const fullName = (t: Teammate) => `${t.first_name} ${t.last_name}`.trim()

/** Initials avatar - cheap, and enough to tell people apart at a glance. */
function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'
  // Deterministic colour per person, so the same name is always the same swatch.
  const palette = ['#E07A5F', '#6B9080', '#8390C8', '#8B5A8C', '#C08A2E']
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, borderRadius: '50%', flex: 'none',
        background: palette[h % palette.length], color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.4, fontWeight: 700, letterSpacing: 0.2,
      }}
    >{initials}</span>
  )
}

/** Render @Name fragments in bold so tags are visible in the posted note. */
function Body({ text, mentions }: { text: string; mentions: Mention[] }) {
  if (!mentions.length) return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
  // Longest names first, so "@Jainam Shah" wins over a shorter "@Jainam".
  const names = mentions.map((m) => m.name).sort((a, b) => b.length - a.length)
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(@(?:${escaped.join('|')}))`, 'g'))
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((p, i) =>
        p.startsWith('@') && names.includes(p.slice(1))
          ? <b key={i} style={{ color: 'var(--brand-ink)' }}>{p}</b>
          : <span key={i}>{p}</span>
      )}
    </span>
  )
}

/** Textarea with an @mention picker. Returns body text + resolved user IDs. */
function Composer({
  placeholder, teammates, busy, submitLabel, autoFocus, onSubmit, onCancel,
}: {
  placeholder: string
  teammates: Teammate[]
  busy: boolean
  submitLabel: string
  autoFocus?: boolean
  onSubmit: (body: string, mentionIds: number[]) => void
  onCancel?: () => void
}) {
  const [text, setText] = useState('')
  const [tagged, setTagged] = useState<Teammate[]>([])
  const [query, setQuery] = useState<string | null>(null)
  const [hi, setHi] = useState(0)
  const ref = useRef<HTMLTextAreaElement>(null)

  const matches = useMemo(() => {
    if (query === null) return []
    const qy = query.toLowerCase()
    return teammates.filter((t) => fullName(t).toLowerCase().includes(qy)).slice(0, 5)
  }, [query, teammates])

  // Only treat "@" as a tag when it starts a word and has no space yet.
  function onChange(v: string) {
    setText(v)
    const upto = v.slice(0, ref.current?.selectionStart ?? v.length)
    const m = upto.match(/(?:^|\s)@([\w'-]*)$/)
    setQuery(m ? m[1] : null)
    setHi(0)
  }

  function pick(t: Teammate) {
    const el = ref.current
    const caret = el?.selectionStart ?? text.length
    const before = text.slice(0, caret).replace(/(?:^|\s)@([\w'-]*)$/, (s) => s.replace(/@[\w'-]*$/, ''))
    const next = `${before}@${fullName(t)} ${text.slice(caret)}`
    setText(next)
    setTagged((prev) => (prev.some((p) => p.id === t.id) ? prev : [...prev, t]))
    setQuery(null)
    requestAnimationFrame(() => el?.focus())
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (query !== null && matches.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % matches.length); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h - 1 + matches.length) % matches.length); return }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(matches[hi]); return }
      if (e.key === 'Escape') { setQuery(null); return }
    }
    // Cmd/Ctrl+Enter posts, matching every other comment box people use.
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit() }
  }

  function submit() {
    const body = text.trim()
    if (!body || busy) return
    // Only send tags whose "@Name" survived editing.
    const ids = tagged.filter((t) => body.includes(`@${fullName(t)}`)).map((t) => t.id)
    onSubmit(body, ids)
    setText(''); setTagged([]); setQuery(null)
  }

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        ref={ref} rows={3} className="ad-input" placeholder={placeholder} value={text}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown}
      />
      {query !== null && matches.length > 0 && (
        <div className="ad-mention-pop" role="listbox">
          {matches.map((t, i) => (
            <button
              key={t.id} type="button" role="option" aria-selected={i === hi}
              className={`ad-mention-item${i === hi ? ' on' : ''}`}
              onMouseEnter={() => setHi(i)} onMouseDown={(e) => { e.preventDefault(); pick(t) }}
            >
              <Avatar name={fullName(t)} size={22} />
              <span style={{ fontWeight: 600 }}>{fullName(t)}</span>
              <span className="ad-soft" style={{ fontSize: 11, marginLeft: 'auto' }}>{t.role}</span>
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <span className="ad-soft" style={{ fontSize: 11 }}>
          Type <b>@</b> to tag someone
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {onCancel && <button className="ad-btn-ghost" onClick={onCancel}>Cancel</button>}
          <button className="ad-btn" disabled={busy || !text.trim()} onClick={submit}>
            {busy ? 'Posting…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LeadActivityThread({
  leadId, canEdit, intakeNote,
}: { leadId: number; canEdit: boolean; intakeNote?: string | null }) {
  const [thread, setThread] = useState<ThreadNote[]>([])
  const [teammates, setTeammates] = useState<Teammate[]>([])
  const [busy, setBusy] = useState(false)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [err, setErr] = useState('')
  const [meta, setMeta] = useState<{ lastActivityAt: string | null; oldestOpenMention: { at: string; who: string } | null }>(
    { lastActivityAt: null, oldestOpenMention: null }
  )

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/leads/${leadId}/notes`, { cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not load the activity thread.')
      setThread(d.thread || [])
      setMeta({ lastActivityAt: d.lastActivityAt ?? null, oldestOpenMention: d.oldestOpenMention ?? null })
    } catch (e: any) {
      setErr(e.message)
    }
  }, [leadId])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    fetch('/api/admin/teammates', { cache: 'no-store' })
      .then((r) => r.json()).then((d) => setTeammates(d.users || [])).catch(() => {})
  }, [])

  async function post(body: string, mentions: number[], parentId: number | null) {
    setBusy(true); setErr('')
    try {
      const r = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, mentions, parentId }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setErr(d.error || `Could not post the note (error ${r.status}).`); return }
      setReplyTo(null)
      await load()
    } catch {
      setErr('Could not reach the server. Your note was not saved.')
    } finally {
      setBusy(false)   // always recovers, even if the response is unparseable
    }
  }

  const NoteCard = ({ n, isReply }: { n: Note; isReply?: boolean }) => (
    <div className={`ad-note${isReply ? ' reply' : ''}`}>
      <Avatar name={n.author_name || n.author_email || '?'} size={isReply ? 22 : 26} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <b style={{ fontSize: 12.5 }}>{n.author_name || n.author_email}</b>
          <span className="ad-soft" style={{ fontSize: 11 }} title={fmtDateTime(n.created_at)}>
            {fmtRelative(n.created_at)}
          </span>
        </div>
        <div style={{ fontSize: 13, marginTop: 3 }}>
          <Body text={n.body} mentions={n.mentions} />
        </div>
        {!isReply && canEdit && (
          <button className="ad-link-btn" onClick={() => setReplyTo(replyTo === n.id ? null : n.id)}>
            {replyTo === n.id ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="ad-kicker" style={{ margin: '18px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Notes &amp; Activity</span>
        {meta.lastActivityAt && (
          <span className="ad-soft" style={{ fontSize: 11, textTransform: 'none', letterSpacing: 0 }}>
            last update {fmtRelative(meta.lastActivityAt)}
          </span>
        )}
      </div>

      {/* The accountability line: who was asked, and how long ago. */}
      {meta.oldestOpenMention && (
        <div className="ad-waiting">
          Waiting on <b>{meta.oldestOpenMention.who}</b> since {fmtRelative(meta.oldestOpenMention.at)}
        </div>
      )}

      {err && <div className="ad-alert err" style={{ marginBottom: 10 }}>{err}</div>}

      {canEdit ? (
        <div style={{ marginBottom: 14 }}>
          <Composer
            placeholder="Add an update - call outcome, next step, who to follow up..."
            teammates={teammates} busy={busy} submitLabel="Add note"
            onSubmit={(b, m) => post(b, m, null)}
          />
        </div>
      ) : (
        <p className="ad-soft" style={{ fontSize: 12, marginBottom: 10 }}>
          View-only access - you can read the activity log but not add notes.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {intakeNote && (
          <div style={{ background: '#fffdf7', border: '1px solid var(--rule)', borderRadius: 10, padding: '10px 12px' }}>
            <div className="ad-soft" style={{ fontSize: 11, marginBottom: 4 }}>Original note (at intake)</div>
            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{intakeNote}</div>
          </div>
        )}

        {thread.map((n) => (
          <div key={n.id} className="ad-note-group">
            <NoteCard n={n} />
            {n.replies.map((r) => <NoteCard key={r.id} n={r} isReply />)}
            {replyTo === n.id && (
              <div style={{ marginLeft: 34, marginTop: 8 }}>
                <Composer
                  placeholder={`Reply to ${n.author_name || 'this note'}...`}
                  teammates={teammates} busy={busy} submitLabel="Reply" autoFocus
                  onSubmit={(b, m) => post(b, m, n.id)}
                  onCancel={() => setReplyTo(null)}
                />
              </div>
            )}
          </div>
        ))}

        {thread.length === 0 && !intakeNote && (
          <p className="ad-soft" style={{ fontSize: 13 }}>No notes yet. Add the first update to start the activity log.</p>
        )}
      </div>
    </>
  )
}
