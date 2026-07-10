import { SOCIALS } from '@/lib/social'

const icons: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="10" cy="10" r="3.4" />
      <circle cx="14.4" cy="5.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M6 8.5 V14 M6 5.6 V5.7 M9.5 14 V10.6 Q9.5 8.6 11.4 8.6 T13.4 10.6 V14" strokeLinecap="round" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 4 L16 16 M16 4 L4 16" strokeLinecap="round" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12.5 3.5 H10.8 Q8.6 3.5 8.6 5.8 V8 H6.8 V10.6 H8.6 V16.5 M8.6 10.6 H12" strokeLinecap="round" />
    </svg>
  ),
}

/** Icon links row — `nav` (desktop header) or `drawer` (mobile menu) styling. */
export default function SocialLinks({ variant }: { variant: 'nav' | 'drawer' }) {
  return (
    <div className={variant === 'nav' ? 'nav-social' : 'm-social'}>
      {SOCIALS.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
          {icons[s.name]}
        </a>
      ))}
    </div>
  )
}
