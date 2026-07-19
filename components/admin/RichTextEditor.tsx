'use client'

import { useEffect, useRef } from 'react'
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading2, Heading3, Pilcrow, RemoveFormatting, Link as LinkIcon,
} from 'lucide-react'

const COLORS = ['#1A1A1E', '#C8141B', '#6B9080', '#8390C8', '#8B5A8C', '#8a6116', '#6E6A62']
const SIZES: [string, string][] = [['2', 'Small'], ['3', 'Normal'], ['4', 'Large'], ['5', 'X-Large']]

/**
 * Lightweight dependency-free rich text editor (contentEditable + execCommand).
 * Emits HTML via onChange; sanitized again server-side on save.
 */
export default function RichTextEditor({ initialHtml, onChange }: { initialHtml: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== initialHtml) {
      ref.current.innerHTML = initialHtml
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exec = (cmd: string, val?: string) => {
    ref.current?.focus()
    document.execCommand(cmd, false, val)
    onChange(ref.current?.innerHTML ?? '')
  }

  const Btn = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" className="ad-rte-btn" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {children}
    </button>
  )

  return (
    <div>
      <div className="ad-rte-toolbar">
        <Btn title="Bold" onClick={() => exec('bold')}><Bold size={15} /></Btn>
        <Btn title="Italic" onClick={() => exec('italic')}><Italic size={15} /></Btn>
        <Btn title="Underline" onClick={() => exec('underline')}><Underline size={15} /></Btn>
        <Btn title="Strikethrough" onClick={() => exec('strikeThrough')}><Strikethrough size={15} /></Btn>
        <div className="ad-rte-sep" />
        <Btn title="Heading" onClick={() => exec('formatBlock', 'h2')}><Heading2 size={15} /></Btn>
        <Btn title="Sub-heading" onClick={() => exec('formatBlock', 'h3')}><Heading3 size={15} /></Btn>
        <Btn title="Paragraph" onClick={() => exec('formatBlock', 'p')}><Pilcrow size={15} /></Btn>
        <div className="ad-rte-sep" />
        <Btn title="Bulleted list" onClick={() => exec('insertUnorderedList')}><List size={15} /></Btn>
        <Btn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={15} /></Btn>
        <div className="ad-rte-sep" />
        <select className="ad-rte-btn" title="Text size" defaultValue="3"
          onChange={(e) => exec('fontSize', e.target.value)}>
          {SIZES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 4px' }}>
          {COLORS.map((c) => (
            <button key={c} type="button" title={`Text color ${c}`}
              onMouseDown={(e) => e.preventDefault()} onClick={() => exec('foreColor', c)}
              style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '2px solid #fff', boxShadow: '0 0 0 1px var(--rule-strong)', cursor: 'pointer' }} />
          ))}
        </div>
        <div className="ad-rte-sep" />
        <Btn title="Add link" onClick={() => { const url = prompt('Link URL:'); if (url) exec('createLink', url) }}><LinkIcon size={15} /></Btn>
        <Btn title="Clear formatting" onClick={() => exec('removeFormat')}><RemoveFormatting size={15} /></Btn>
      </div>
      <div
        ref={ref}
        className="ad-rte"
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? '')}
        onBlur={() => onChange(ref.current?.innerHTML ?? '')}
      />
    </div>
  )
}
