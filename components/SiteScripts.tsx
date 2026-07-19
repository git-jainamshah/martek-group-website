/**
 * Server components that inject admin-managed tag managers + custom scripts.
 *
 * Performance rules (by design):
 *  - A tag manager's loader is ONLY rendered if it's linked & enabled for the
 *    current environment. No GTM linked → zero GTM bytes. No Tealium linked →
 *    nothing remotely touching Tealium is emitted.
 *  - Custom scripts render in admin-defined drag order, and each one is placed
 *    before or after the tag-manager loaders per its "timing" setting.
 *  - Everything fails silently to defaults if the DB is unavailable, so the
 *    public site never breaks because of the admin layer.
 */

type ScriptRow = {
  id: number; title: string; code: string; location: string
  timing: string; sort_order: number; enabled: number; environment: string
}
type TagManagerRow = { id: number; provider: string; container_id: string; environment: string; enabled: number }

export function currentEnvironment(): 'production' | 'qa' | 'dev' {
  const explicit = process.env.MARTEK_ENV?.trim().toLowerCase()
  if (explicit === 'production' || explicit === 'qa' || explicit === 'dev') return explicit
  const vercel = process.env.VERCEL_ENV
  if (vercel === 'production') return 'production'
  if (vercel === 'preview') return 'qa'
  return process.env.NODE_ENV === 'production' ? 'production' : 'dev'
}

function load(): { scripts: ScriptRow[]; tagManagers: TagManagerRow[] } {
  try {
    const { db } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const env = currentEnvironment()
    const scripts = (db()
      .prepare(`SELECT * FROM scripts WHERE enabled = 1 AND (environment = 'all' OR environment = ?) ORDER BY sort_order, id`)
      .all(env)) as ScriptRow[]
    const tagManagers = (db()
      .prepare('SELECT * FROM tag_managers WHERE enabled = 1 AND environment = ?')
      .all(env)) as TagManagerRow[]
    return { scripts, tagManagers }
  } catch {
    return { scripts: [], tagManagers: [] }
  }
}

function gtmLoader(id: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`
}

function tealiumLoader(path: string): string {
  return `(function(a,b,c,d){a='https://tags.tiqcdn.com/utag/${path}/utag.js';b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);})();`
}

function Inline({ rows }: { rows: { key: string; code: string; title: string }[] }) {
  return (
    <>
      {rows.map((r) => (
        <script key={r.key} data-managed={r.title} dangerouslySetInnerHTML={{ __html: stripTags(r.code) }} />
      ))}
    </>
  )
}

/** Accept either raw JS or a pasted <script>…</script> block. */
function stripTags(code: string): string {
  const m = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
  return m ? m[1] : code
}

function groupFor(location: 'head' | 'body' | 'footer') {
  const { scripts, tagManagers } = load()
  const inLoc = scripts.filter((s) => s.location === location)
  const before = inLoc.filter((s) => s.timing === 'before_tm')
  const after = inLoc.filter((s) => s.timing === 'after_tm')
  // Tag manager loaders live in the "head" group (loaded as early as possible)
  const tms = location === 'head' ? tagManagers : []
  return { before, after, tms }
}

function ScriptGroup({ location }: { location: 'head' | 'body' | 'footer' }) {
  const { before, after, tms } = groupFor(location)
  if (!before.length && !after.length && !tms.length) return null
  return (
    <>
      <Inline rows={before.map((s) => ({ key: `s${s.id}`, code: s.code, title: s.title }))} />
      {tms.map((t) => (
        <script
          key={`tm${t.id}`}
          data-managed={`${t.provider}:${t.container_id}`}
          dangerouslySetInnerHTML={{
            __html: t.provider === 'gtm' ? gtmLoader(t.container_id) : tealiumLoader(t.container_id),
          }}
        />
      ))}
      <Inline rows={after.map((s) => ({ key: `s${s.id}`, code: s.code, title: s.title }))} />
    </>
  )
}

/** Rendered inside <head>. */
export function HeadScripts() {
  return <ScriptGroup location="head" />
}

/** Rendered at the very top of <body>: GTM noscript + "body start" group. */
export function BodyStartScripts() {
  const { tms } = groupFor('head')
  const gtm = tms.find((t) => t.provider === 'gtm')
  return (
    <>
      {gtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtm.container_id}`}
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      <ScriptGroup location="body" />
    </>
  )
}

/** Rendered just before </body>. */
export function FooterScripts() {
  return <ScriptGroup location="footer" />
}
