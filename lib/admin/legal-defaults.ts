/**
 * Seed HTML for the editable Terms & Privacy pages - imported from the
 * original hardcoded pages. After first run, the database is the source of truth.
 */

export const TERMS_DEFAULT_HTML = `
<h2>Agreement to Terms</h2>
<p>By accessing and using the Martek Group website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
<h2>Services</h2>
<p>Martek Group provides digital services including web development, data analytics, social media marketing, SEO, and engineering drawings. All services are subject to separate service agreements.</p>
<h2>Payment Terms</h2>
<p>Payment terms will be specified in individual service agreements. Generally, payments are due according to the agreed-upon schedule in your project contract.</p>
<h2>Intellectual Property</h2>
<p>All content on this website, including designs, text, graphics, and logos, is the property of Martek Group and is protected by copyright and trademark laws.</p>
<h2>Limitation of Liability</h2>
<p>Martek Group shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website.</p>
<h2>Contact Us</h2>
<p>For questions about these terms, please contact us at <a href="mailto:info@martekgroup.com">info@martekgroup.com</a>.</p>
`.trim()

export const PRIVACY_DEFAULT_HTML = `
<h2>Introduction</h2>
<p>At Martek Group, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>
<h2>Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
<li>Name and contact information (email, phone number)</li>
<li>Company information</li>
<li>Project details you share with us</li>
<li>Website usage data</li>
</ul>
<h2>How We Use Your Information</h2>
<p>We use your information to:</p>
<ul>
<li>Provide and improve our services</li>
<li>Respond to your inquiries and requests</li>
<li>Send relevant updates about your projects</li>
<li>Improve our website experience</li>
</ul>
<h2>Data Protection</h2>
<p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
<h2>Contact Us</h2>
<p>If you have questions about this privacy policy, please contact us at <a href="mailto:info@martekgroup.com">info@martekgroup.com</a>.</p>
`.trim()

/** "July 19, 2026, Sunday" */
export function formatLegalDate(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  return `${date}, ${weekday}`
}

/** Very small allowlist-based sanitizer for admin-authored rich text. */
export function sanitizeHtml(html: string): string {
  return String(html)
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*(iframe|object|embed|form|input|link|meta)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '')
}
