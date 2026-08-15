import type { Block } from '@/lib/blog'
import CodeBlock from './CodeBlock'
import { richText } from './RichText'
import { BrandRow } from './Brands'
import { ConsentFlow, CwvMeters, CadFormats, RedirectMap, RedesignRecovery, PlatformTradeoff, OaiMeasureFlow, CpmVsCpc } from './Figures'

/** Renders one authored content block. Server component: no client JS needed. */
export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'h2':
      return <h2 id={b.id} className="bp-h2">{b.text}</h2>
    case 'h3':
      return <h3 className="bp-h3">{b.text}</h3>
    case 'lead':
      return <p className="bp-lead">{richText(b.text)}</p>
    case 'p':
      return <p className="bp-p">{richText(b.text)}</p>
    case 'ul':
      return <ul className="bp-ul">{b.items.map((i, n) => <li key={n}>{richText(i)}</li>)}</ul>
    case 'ol':
      return <ol className="bp-ol">{b.items.map((i, n) => <li key={n}>{richText(i)}</li>)}</ol>
    case 'steps':
      return (
        <ol className="bp-steps">
          {b.items.map((s, n) => (
            <li key={n}>
              <span className="bp-step-n">{n + 1}</span>
              <div>
                <b>{s.title}</b>
                <span>{richText(s.body)}</span>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'code':
      return <CodeBlock code={b.code} lang={b.lang} caption={b.caption} />
    case 'callout':
      return (
        <aside className={`bp-callout ${b.kind}`}>
          {b.title && <b>{b.title}</b>}
          <span>{richText(b.text)}</span>
        </aside>
      )
    case 'quote':
      return <blockquote className="bp-quote">{b.text}</blockquote>
    case 'table':
      return (
        <figure className="bp-tablewrap">
          <table className="bp-table">
            <thead><tr>{b.head.map((h, n) => <th key={n}>{richText(h)}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, n) => (
                <tr key={n}>{r.map((c, m) => <td key={m}>{richText(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {b.caption && <figcaption>{richText(b.caption)}</figcaption>}
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
          {b.kind === 'cpm-vs-cpc' && <CpmVsCpc />}
          <figcaption>{b.caption}</figcaption>
        </figure>
      )
    case 'faq':
      return (
        <div className="bp-faq">
          {b.items.map((f, n) => (
            <details key={n}>
              <summary>{richText(f.q)}</summary>
              <p>{richText(f.a)}</p>
            </details>
          ))}
        </div>
      )
    case 'sources':
      return (
        <aside className="bp-sources">
          <div className="bp-sources-title">{b.title ?? 'Reference'}</div>
          <ul>
            {b.items.map((s, n) => (
              <li key={n}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                {s.note && <span className="bp-sources-note">{s.note}</span>}
              </li>
            ))}
          </ul>
        </aside>
      )
    case 'brands':
      return <BrandRow items={b.items} />
    case 'divider':
      return <hr className="bp-hr" />
    default:
      return null
  }
}
