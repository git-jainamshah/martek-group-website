'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * Code block with a copy button.
 *
 * Client component because copying needs the Clipboard API. The code itself is
 * passed in as a plain string from the server-rendered post, so the markup is
 * still in the HTML for search engines and for anyone with JS disabled - only
 * the button needs JavaScript.
 */
export default function CodeBlock({
  code, lang, caption,
}: { code: string; lang?: string; caption?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear the pending reset on unmount so it cannot fire into a dead component.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* Clipboard API needs a secure context and can be blocked by permissions.
         Fall back to the old selection method so the button still works. */
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* nothing more to try */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <figure className="bp-codewrap">
      <div className="bp-codebar">
        {lang && <span className="bp-codelang">{lang}</span>}
        <button
          type="button"
          className={`bp-copy${copied ? ' done' : ''}`}
          onClick={copy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bp-code"><code>{code}</code></pre>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
