# Martek Group Website

A modern, responsive business website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ SEO optimized with meta tags and structured data
- ✅ Modern UI with smooth animations
- ✅ Contact form with validation
- ✅ Service packages and pricing
- ✅ Fast loading with Next.js optimization
- ✅ Accessible and user-friendly

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form handling and validation
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── pricing/        # Pricing page
│   ├── services/       # Services page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   └── ...
└── public/            # Static assets
```

## Key Pages

- **Home** (`/`) - Main landing page with hero, services, and CTA
- **Services** (`/services`) - Detailed service descriptions
- **Pricing** (`/pricing`) - Package options and pricing
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information

## Customization

### Update Contact Information

Edit the contact details in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `components/ContactForm.tsx`

### Modify Services

Update service information in:
- `components/Services.tsx`
- `components/ServiceDetail.tsx`

### Adjust Colors

Modify the color scheme in `tailwind.config.ts` under the `theme.extend.colors` section.

## SEO Features

- Meta tags for all pages
- Structured data (JSON-LD)
- Semantic HTML
- Open Graph tags
- Twitter Card tags
- Sitemap ready (add sitemap generation)

## Form Submission

The contact form currently logs to console. To enable actual form submission:

1. Create an API route at `app/api/contact/route.ts`
2. Update the form submission in `components/ContactForm.tsx`
3. Add email service (e.g., SendGrid, Resend) or database storage

## Deployment

The site can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any hosting service that supports Node.js

## Support

For questions or support, contact info@martekgroup.com

## License

© 2024 Martek Group. All rights reserved.
