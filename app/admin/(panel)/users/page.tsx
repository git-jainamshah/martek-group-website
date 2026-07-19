'use client'

import { useEffect, useState } from 'react'
import { UserPlus, KeyRound, UserX, UserCheck, Copy } from 'lucide-react'

type User = {
  id: number; first_name: string; last_name: string; email: string; role: string
  active: number; must_change_password: number; created_at: string; last_login: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [creds, setCreds] = useState<{ firstName: string; username: string; tempPassword: string } | null>(null)
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false)

  const load = () => fetch('/api/admin/users').then((r) => r.json()).then((d) => setUsers(d.users || []))
  useEffect(() => { load() }, [])

  async function addUser() {
    setErr('')
    const res = await fetch('/api/admin/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    const d = await res.json()
    if (!res.ok) return setErr(d.error || 'Could not add user.')
    setAdding(false)
    setForm({ firstName: '', lastName: '', email: '' })
    setCreds({ firstName: d.firstName, username: d.username, tempPassword: d.tempPassword })
    load()
  }

  async function act(id: number, action: string) {
    setErr('')
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
    })
    const d = await res.json()
    if (!res.ok) return setErr(d.error || 'Action failed.')
    if (action === 'reset-password') {
      setCreds({ firstName: d.firstName, username: d.username, tempPassword: d.tempPassword })
    }
    load()
  }

  const input = 'bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-neutral-400'

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Management</h1>
          <p className="text-sm text-neutral-400 mt-1">Who can sign in to this admin panel. Email is the username.</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-lg px-4 py-2 hover:bg-neutral-200">
          <UserPlus className="w-4 h-4" /> Add user
        </button>
      </div>

      {err && <div className="text-sm rounded-lg px-4 py-3 border bg-red-950/50 border-red-900 text-red-300">{err}</div>}

      <div className="border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.first_name} {u.last_name}</div>
                  <div className="text-neutral-500 text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-400 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.active
                    ? u.must_change_password
                      ? <span className="text-xs px-2 py-1 rounded-full border border-amber-800 bg-amber-950 text-amber-300">Temp password</span>
                      : <span className="text-xs px-2 py-1 rounded-full border border-emerald-800 bg-emerald-950 text-emerald-300">Active</span>
                    : <span className="text-xs px-2 py-1 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-400">Revoked</span>}
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs">{u.last_login || 'Never'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => act(u.id, 'reset-password')} title="Reset password (issues a new temp password)"
                      className="p-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-900">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    {u.active ? (
                      <button onClick={() => act(u.id, 'revoke')} title="Revoke access"
                        className="p-2 rounded-lg border border-red-900 text-red-400 hover:bg-red-950">
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => act(u.id, 'restore')} title="Restore access"
                        className="p-2 rounded-lg border border-emerald-900 text-emerald-400 hover:bg-emerald-950">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setAdding(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold">Add user</div>
            <div className="space-y-3">
              <div className="space-y-1"><label className="text-xs text-neutral-400">First name</label>
                <input className={input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs text-neutral-400">Last name</label>
                <input className={input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs text-neutral-400">Email (becomes their username)</label>
                <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <p className="text-xs text-neutral-500">A temporary password is generated automatically. They&apos;ll be asked to create their own password on first sign-in.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setAdding(false)} className="text-sm px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">Cancel</button>
              <button onClick={addUser} className="text-sm px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200">Add user</button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials popup */}
      {creds && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="text-lg font-bold">Share these details with {creds.firstName}</div>
            <p className="text-sm text-neutral-400">This temporary password is shown <b>once</b> — copy it now and pass it on. {creds.firstName} will be prompted to create a new password on first sign-in, and the temporary one is discarded.</p>
            <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 space-y-2 font-mono text-sm">
              <div><span className="text-neutral-500">Username: </span>{creds.username}</div>
              <div><span className="text-neutral-500">Temp password: </span>{creds.tempPassword}</div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Sign in at ${window.location.origin}/admin/login\nUsername: ${creds.username}\nTemporary password: ${creds.tempPassword}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">
                <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => setCreds(null)} className="text-sm px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
