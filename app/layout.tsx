import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import LayoutWrapper from '@/components/LayoutWrapper'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
})

export const metadata: Metadata = {
  title: 'Martek Group - Digital Solutions & Engineering Services',
  description: 'Comprehensive digital services including web development, data analytics, social media marketing, SEO, and engineering drawings. Transform your business with our expert solutions.',
  keywords: 'web development, digital branding, data analytics, social media marketing, SEO, engineering drawings, mechanical engineering, civil engineering, digital marketing',
  authors: [{ name: 'Martek Group' }],
  openGraph: {
    title: 'Martek Group - Digital Solutions & Engineering Services',
    description: 'Transform your business with our comprehensive digital and engineering services.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martek Group - Digital Solutions & Engineering Services',
    description: 'Transform your business with our comprehensive digital and engineering services.',
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
    <html lang="en" suppressHydrationWarning>
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
      <body className={ubuntu.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
