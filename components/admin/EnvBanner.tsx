import { isProduction, envLabel, envColor, dbFingerprint, APP_ENV } from '@/lib/env'

/**
 * Environment ribbon for the admin panel.
 *
 * Renders nothing on production, so the live panel is untouched. On QA and DEV
 * it is impossible to miss which environment you are editing, and it names the
 * database so you can confirm at a glance that QA is not pointed at production
 * data.
 */
export default function EnvBanner() {
  if (isProduction) return null

  return (
    <div
      role="status"
      style={{
        background: envColor,
        color: '#FBF6EC',
        padding: '7px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        fontFamily: 'var(--mono, monospace)',
        fontSize: 11.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        position: 'sticky',
        top: 0,
        zIndex: 60,
      }}
    >
      <strong style={{ fontWeight: 700 }}>{envLabel} environment</strong>
      <span style={{ opacity: 0.85, textTransform: 'none', letterSpacing: 0 }}>
        Changes here do not affect the live site.
      </span>
      <span
        style={{ marginLeft: 'auto', opacity: 0.8, textTransform: 'none', letterSpacing: 0 }}
        title="Database this deployment is connected to"
      >
        db: {dbFingerprint()}
      </span>
    </div>
  )
}

/** Small inline chip, used where a full-width ribbon would not fit. */
export function EnvChip() {
  if (isProduction) return null
  return (
    <span
      style={{
        background: envColor,
        color: '#FBF6EC',
        borderRadius: 999,
        padding: '2px 9px',
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'var(--mono, monospace)',
      }}
    >
      {APP_ENV}
    </span>
  )
}
