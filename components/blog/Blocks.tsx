import type { Block } from '@/lib/blog'
import { ConsentFlow, CwvMeters, CadFormats, RedirectMap, RedesignRecovery, PlatformTradeoff, OaiMeasureFlow } from './Figures'

/** Renders one authored content block. Server component: no client JS needed. */
export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'h2':
      return <h2 id={b.id} className="bp-h2">{b.text}</h2>
    case 'h3':
      return <h3 className="bp-h3">{b.text}</h3>
    case 'lead':
      return <p className="bp-lead">{b.text}</p>
    case 'p':
      return <p className="bp-p">{b.text}</p>
    case 'ul':
      return <ul className="bp-ul">{b.items.map((i, n) => <li key={n}>{i}</li>)}</ul>
    case 'ol':
      return <ol className="bp-ol">{b.items.map((i, n) => <li key={n}>{i}</li>)}</ol>
    case 'steps':
      return (
        <ol className="bp-steps">
          {b.items.map((s, n) => (
            <li key={n}>
              <span className="bp-step-n">{n + 1}</span>
              <div>
                <b>{s.title}</b>
                <span>{s.body}</span>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'code':
      return (
        <figure className="bp-code">
          {b.caption && <figcaption>{b.caption}</figcaption>}
          <pre><code>{b.code}</code></pre>
        </figure>
      )
    case 'callout':
      return (
        <aside className={`bp-callout ${b.kind}`}>
          {b.title && <b>{b.title}</b>}
          <span>{b.text}</span>
        </aside>
      )
    case 'quote':
      return <blockquote className="bp-quote">{b.text}</blockquote>
    case 'table':
      return (
        <figure className="bp-tablewrap">
          <table className="bp-table">
            <thead><tr>{b.head.map((h, n) => <th key={n}>{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, n) => (
                <tr key={n}>{r.map((c, m) => <td key={m}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      )
    case 'figure':
      return (
        <figure className="bp-figure">
          {b.kind === 'consent-flow' && <ConsentFlow />}
          {b.kind === 'cwv-meters' && <CwvMeters />}
          {b.kind === 'cad-formats' && <CadFormats />}
          {b.kind === 'redirect-map' && <RedirectMap />}
          {b.kind === 'redesign-recovery' && <RedesignRecovery />}
          {b.kind === 'platform-tradeoff' && <PlatformTradeoff />}
          {b.kind === 'oai-measure-flow' && <OaiMeasureFlow />}
          <figcaption>{b.caption}</figcaption>
        </figure>
      )
    case 'faq':
      return (
        <div className="bp-faq">
          {b.items.map((f, n) => (
            <details key={n}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      )
    case 'divider':
      return <hr className="bp-hr" />
    default:
      return null
  }
}
