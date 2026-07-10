'use client'

import { useEffect } from 'react'

/** Applies a per-service accent class to <body> (mirrors each reference page's :root accent override). */
export default function AccentSetter({ accentClass }: { accentClass: string }) {
  useEffect(() => {
    document.body.classList.add(accentClass)
    return () => {
      document.body.classList.remove(accentClass)
    }
  }, [accentClass])
  return null
}
