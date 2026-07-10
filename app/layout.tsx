import type { Metadata } from 'next'
import { Instrument_Serif, Fraunces, DM_Sans, JetBrains_Mono, Poppins } from 'next/font/google'
import './globals.css'
import './martek.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Martek Group · A small studio that ships big things',
  description: 'We design, build and grow products for founders who sweat the details. Web development, data analytics, social, SEO & ads, and engineering — one team, end to end.',
  keywords: 'web development, digital branding, data analytics, social media marketing, SEO, engineering drawings, mechanical engineering, civil engineering, digital marketing',
  authors: [{ name: 'Martek Group' }],
  openGraph: {
    title: 'Martek Group · A small studio that ships big things',
    description: 'We design, build and grow products for founders who sweat the details. One team, end to end.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martek Group · A small studio that ships big things',
    description: 'We design, build and grow products for founders who sweat the details. One team, end to end.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${fraunces.variable} ${dmSans.variable} ${jetbrains.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="canonical" href="https://www.martekgroup.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Martek Group",
              "description": "Comprehensive digital solutions and engineering services",
              "url": "https://www.martekgroup.com",
              "serviceType": [
                "Web Development",
                "Digital Branding",
                "Data Analytics",
                "Social Media Marketing",
                "SEO",
                "Engineering Drawings"
              ],
              "areaServed": "Worldwide",
            }),
          }}
        />
      </head>
      <body className="dot-bg">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
