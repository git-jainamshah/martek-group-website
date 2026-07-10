export default function TrustRow() {
  return (
    <section className="trust">
      <div className="wrap">
        <p className="trust-label">How we work · fixed quotes · weekly demos · no lock-in</p>
        <div className="logo-row" data-reveal-stagger>
          <div className="lg mono">FIXED-PRICE QUOTES</div>
          <div className="lg">Friday demos</div>
          <div className="lg bold">you own it all</div>
          <div className="lg serif-it" style={{ fontFamily: 'var(--display)', fontStyle: 'italic' }}>
            NDA-friendly
          </div>
          <div className="lg mono">REPLIES &lt; 2 HRS</div>
        </div>
      </div>
    </section>
  )
}
