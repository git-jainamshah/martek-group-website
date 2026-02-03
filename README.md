# 🚀 Martek Group Website

A modern, professional business website built with cutting-edge web technologies. Features a responsive design, dark mode support, dynamic animations, and comprehensive project showcases.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Quick Start](#-quick-start-one-command-setup)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Manual Setup](#-manual-setup)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Version Control](#-version-control)

## ⚡ Quick Start (One Command Setup)

Clone and set up the entire project with a single command:

```bash
git clone https://github.com/git-jainamshah/martek-group-website.git && cd martek-group-website && chmod +x setup.sh && ./setup.sh
```

This will:
- ✅ Clone the repository
- ✅ Check for Node.js and npm
- ✅ Install all dependencies automatically
- ✅ Start the development server
- ✅ Open your browser to http://localhost:3000

### Alternative: Quick Start Script

If you prefer to run the setup separately:

```bash
# Clone the repository
git clone https://github.com/git-jainamshah/martek-group-website.git
cd martek-group-website

# Run the automated setup
./setup.sh
```

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 14.2** - React framework with App Router for server-side rendering and optimal performance
- **React 18.3** - Component-based UI library with hooks and modern features
- **TypeScript 5.3** - Type-safe development with enhanced IDE support

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework for rapid UI development
- **Framer Motion 11.0** - Production-ready animation library for smooth transitions
- **Lucide React 0.344** - Beautiful, consistent icon library with 1000+ icons
- **next-themes 0.4.6** - Perfect dark mode support with system preference detection

### Forms & Validation
- **React Hook Form 7.50** - Performant form handling with built-in validation

### Development Tools
- **ESLint 8.56** - Code quality and consistency
- **PostCSS 8.4** - CSS transformations and optimizations
- **Autoprefixer 10.4** - Automatic vendor prefixing for cross-browser compatibility

## ✨ Features

### 🎨 Design & UX
- ✅ Fully responsive design (mobile, tablet, desktop, 4K)
- ✅ Dark mode / Light mode toggle with persistent preferences
- ✅ Smooth animations and transitions using Framer Motion
- ✅ Modern glassmorphism and gradient effects
- ✅ Video backgrounds and dynamic visual elements
- ✅ Animated grid backgrounds and spotlight effects
- ✅ Scroll-to-top button for better navigation

### 📄 Pages & Content
- ✅ Homepage with hero section and service overview
- ✅ Services page with detailed offerings
- ✅ Projects showcase with case studies
- ✅ Individual project pages (Analytics, Engineering, Web Development)
- ✅ About page with company information
- ✅ Pricing packages with detailed comparisons
- ✅ Contact form with validation
- ✅ Privacy policy and Terms of service
- ✅ Blog section
- ✅ Custom 404 error page

### 🚀 Performance & SEO
- ✅ SEO optimized with meta tags and Open Graph
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ Automatic sitemap generation
- ✅ Robots.txt configuration
- ✅ Fast loading with Next.js optimization
- ✅ Image optimization and lazy loading
- ✅ Code splitting and tree shaking

### 💼 Business Features
- ✅ Contact form with React Hook Form validation
- ✅ Service package comparisons
- ✅ Project portfolio with modals
- ✅ Client testimonials section
- ✅ Call-to-action sections throughout
- ✅ Efficiency charts and statistics
- ✅ Project timelines and case studies

## 📦 Manual Setup

If the automated setup doesn't work, follow these steps:

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/git-jainamshah/martek-group-website.git
   cd martek-group-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages listed in `package.json`

3. **Add video assets (optional)**
   
   > **Note:** Large video files (>100MB) are not included in the repository due to GitHub's file size limits.
   > The homepage banner video (`homepage-banner-bg.mp4`) should be placed in `public/assets/` if you want to use it.
   > Alternatively, use a smaller video file or host videos on a CDN.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

### Other Commands

```bash
# Run ESLint to check code quality
npm run lint

# Format code (if you add Prettier)
npm run format
```

## 📁 Project Structure

```
martek-group-website/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── abstracts/                # Abstracts/summaries page
│   ├── blogs/                    # Blog listing page
│   ├── case-studies/             # Case studies page
│   ├── contact/                  # Contact page with form
│   ├── pricing/                  # Pricing packages page
│   ├── privacy/                  # Privacy policy page
│   ├── projects/                 # Project showcase pages
│   │   ├── analytics-tagging/    # Analytics project details
│   │   ├── engineering-drawings/ # Engineering project details
│   │   └── web-development/      # Web dev project details
│   ├── services/                 # Services page
│   ├── terms/                    # Terms of service page
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage
│   ├── not-found.tsx             # Custom 404 page
│   ├── robots.ts                 # Robots.txt generation
│   └── sitemap.ts                # Sitemap generation
│
├── components/                   # Reusable React components
│   ├── AnimatedGridBackground.tsx    # Animated grid effect
│   ├── BottomSection.tsx            # Bottom CTA section
│   ├── BrightGridBackground.tsx     # Light theme grid
│   ├── ContactForm.tsx              # Contact form with validation
│   ├── CTASection.tsx               # Call-to-action component
│   ├── DarkTechBackground.tsx       # Dark theme background
│   ├── EfficiencyChart.tsx          # Data visualization chart
│   ├── Footer.tsx                   # Site footer
│   ├── Hero.tsx                     # Homepage hero section
│   ├── ModeToggle.tsx               # Dark/light mode switcher
│   ├── Navbar.tsx                   # Navigation bar
│   ├── PageHero.tsx                 # Reusable page hero component
│   ├── PresentationStats.tsx        # Statistics display
│   ├── PricingPackages.tsx          # Pricing comparison cards
│   ├── ProjectCard.tsx              # Project preview card
│   ├── ProjectModal.tsx             # Project detail modal
│   ├── ProjectTimeline.tsx          # Project timeline view
│   ├── ScrollToTop.tsx              # Scroll to top button
│   ├── ServiceDetail.tsx            # Service detail cards
│   ├── Services.tsx                 # Services overview
│   ├── SpotlightRevealBackground.tsx # Spotlight effect
│   ├── Testimonials.tsx             # Client testimonials
│   ├── theme-provider.tsx           # Theme context provider
│   ├── VideoBackground.tsx          # Video background component
│   └── WhyChooseUs.tsx              # Features section
│
├── public/                       # Static assets
│   └── assets/                   # Images, videos, logos
│       ├── analytics-bg.mp4              # Background video
│       ├── blogs-banner-bg.jpg           # Blog banner
│       ├── business-services-banner-bg.jpg
│       ├── contact-us-banner-bg.jpg
│       ├── contact-us-form.jpg
│       ├── engineering-drawings-bg.mp4
│       ├── homepage-banner-bg.mp4
│       ├── martek-group-header.png       # Logo header
│       ├── martek-offical-logo.png       # Full logo
│       ├── martek-only-logo.png          # Icon logo
│       ├── office-dark-hero.png
│       ├── sample-project-bg.jpg
│       └── web-dev-bg.mp4
│
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .vercelignore                 # Vercel deployment ignore
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── setup.sh                      # Automated setup script
├── start-local.sh                # Local development script
├── DEPLOYMENT.md                 # Deployment instructions
├── QUICK_DEPLOY.md               # Quick deployment guide
└── README.md                     # This file
```

## 💻 Development

### Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view in your browser. The page auto-updates as you edit files.

### Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

### Key Development Files

- **Styling**: Edit `tailwind.config.ts` for theme customization
- **Global CSS**: Modify `app/globals.css` for site-wide styles
- **Navigation**: Update `components/Navbar.tsx` for menu items
- **Contact Info**: Edit `components/Footer.tsx` and `app/contact/page.tsx`
- **Services**: Modify `components/Services.tsx` and `app/services/page.tsx`

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (already set up!)
2. Visit [vercel.com](https://vercel.com)
3. Import your repository: `git-jainamshah/martek-group-website`
4. Vercel will auto-detect Next.js and configure everything
5. Click "Deploy"

Your site will be live in minutes with automatic deployments on every push!

### Alternative Platforms

- **Netlify**: Connect GitHub repo and deploy
- **AWS Amplify**: Use the Amplify Console
- **Cloudflare Pages**: Import from GitHub
- **Self-hosted**: Use `npm run build` and `npm start` on your server

## 🔄 Version Control

This project uses Git for version control. All changes are automatically tracked with a complete version history.

### 📋 View Version History (Quick Table)

**View all versions in a nice table format:**
```bash
./view-versions.sh
```

This displays:
- Serial number for each version
- Version number (v1.0.X format)
- Commit hash
- Date of change
- Quick summary of changes

**Advanced viewing options:**
```bash
./view-versions.sh -n 5          # Show last 5 commits
./view-versions.sh --all         # Show all commits
./view-versions.sh --detailed    # Show with author & file stats
./view-versions.sh --compact     # Minimal view
./view-versions.sh --help        # See all options
```

**🎨 Customize the appearance:**
```bash
./customize-versions.sh
```
Interactive tool to customize:
- Color schemes (blue, green, purple, rainbow)
- Table styles (default, compact, detailed, minimal)
- Display options (show/hide authors, file stats)
- Default number of commits to display

**View detailed changelog:**
```bash
cat CHANGELOG.md
```

Or open `CHANGELOG.md` in your editor to see the full version history with detailed descriptions.

### 📊 Git Commands for Version History

```bash
# View commit history (one line per commit)
git log --oneline

# View detailed commit history
git log

# View changes in a specific file
git log -p path/to/file.tsx

# View who changed what in a file
git blame path/to/file.tsx

# View commit graph (visual tree)
git log --oneline --graph --all
```

### Rolling Back Changes

```bash
# Undo uncommitted changes to a file
git checkout -- path/to/file.tsx

# Undo last commit (keeps changes)
git reset --soft HEAD~1

# View all commits and choose one to revert to
git log --oneline
git checkout <commit-hash>
```

### Creating Backups

```bash
# Create a new branch for backup
git branch backup-branch-name

# List all branches
git branch -a
```

### Syncing with GitHub

```bash
# Pull latest changes from GitHub
git pull origin main

# Push your changes to GitHub
git push origin main

# Check sync status
git status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Customization Guide

### Changing Colors

Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Adding New Pages

1. Create a new folder in `app/`: `app/new-page/`
2. Add `page.tsx` in that folder
3. Update navigation in `components/Navbar.tsx`

### Modifying Contact Form

Edit `components/ContactForm.tsx` to:
- Add/remove form fields
- Change validation rules
- Update submission logic

### Updating Services

Edit `components/Services.tsx` and `app/services/page.tsx` to:
- Add new services
- Update descriptions
- Change pricing

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📧 Support

For questions, issues, or support:
- 📧 Email: info@martekgroup.com
- 🐛 Issues: [GitHub Issues](https://github.com/git-jainamshah/martek-group-website/issues)
- 📖 Documentation: [Next.js Docs](https://nextjs.org/docs)

## 📄 License

© 2024 Martek Group. All rights reserved.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

🌟 Don't forget to star this repo if you find it helpful!
