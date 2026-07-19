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

  const input = 'ad-input'

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Management</h1>
          <p className="text-sm ad-mut mt-1">Who can sign in to this admin panel. Email is the username.</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="ad-btn">
          <UserPlus className="w-4 h-4" /> Add user
        </button>
      </div>

      {err && <div className="ad-alert err">{err}</div>}

      <div className="ad-table-wrap">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider ad-soft border-b border-[#E2D9C4]">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#E2D9C4] last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.first_name} {u.last_name}</div>
                  <div className="ad-soft text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3 ad-mut capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.active
                    ? u.must_change_password
                      ? <span className="ad-badge amber">Temp password</span>
                      : <span className="ad-badge green">Active</span>
                    : <span className="ad-badge grey">Revoked</span>}
                </td>
                <td className="px-4 py-3 ad-soft text-xs">{u.last_login || 'Never'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => act(u.id, 'reset-password')} title="Reset password (issues a new temp password)"
                      className="ad-icon-btn">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    {u.active ? (
                      <button onClick={() => act(u.id, 'revoke')} title="Revoke access"
                        className="ad-icon-btn danger">
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => act(u.id, 'restore')} title="Restore access"
                        className="ad-icon-btn">
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
        <div className="ad-overlay" onClick={() => setAdding(false)}>
          <div className="ad-modal p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold">Add user</div>
            <div className="space-y-3">
              <div className="space-y-1"><label className="text-xs ad-mut">First name</label>
                <input className={input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs ad-mut">Last name</label>
                <input className={input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs ad-mut">Email (becomes their username)</label>
                <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <p className="text-xs ad-soft">A temporary password is generated automatically. They&apos;ll be asked to create their own password on first sign-in.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setAdding(false)} className="ad-btn-ghost">Cancel</button>
              <button onClick={addUser} className="ad-btn">Add user</button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials popup */}
      {creds && (
        <div className="ad-overlay">
          <div className="ad-modal p-6 w-full max-w-sm space-y-4">
            <div className="text-lg font-bold">Share these details with {creds.firstName}</div>
            <p className="text-sm ad-mut">This temporary password is shown <b>once</b> - copy it now and pass it on. {creds.firstName} will be prompted to create a new password on first sign-in, and the temporary one is discarded.</p>
            <div className="bg-[#FBF6EC] border border-[#C9BEA3] rounded-lg p-4 space-y-2 font-mono text-sm">
              <div><span className="ad-soft">Username: </span>{creds.username}</div>
              <div><span className="ad-soft">Temp password: </span>{creds.tempPassword}</div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Sign in at ${window.location.origin}/admin/login\nUsername: ${creds.username}\nTemporary password: ${creds.tempPassword}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="flex items-center gap-2 ad-btn-ghost">
                <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => setCreds(null)} className="ad-btn">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
