# Deployment Guide - Martek Group Website

## Quick Deployment with Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications. Follow these steps:

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up or login with GitHub, GitLab, or Bitbucket

2. **Import your project**
   - Click "New Project"
   - Import your Git repository (if you've pushed to GitHub/GitLab)
   - OR drag and drop your project folder
   - OR use Vercel CLI (see Option 2 below)

3. **Configure build settings**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install`

4. **Environment Variables** (if needed later)
   - Add any environment variables in the Vercel dashboard

5. **Deploy**
   - Click "Deploy"
   - Your site will be live in 1-2 minutes!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI globally**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd "/Users/jainam.shah/Documents/Jainam Personal Projects/Martek Group"
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new one
   - Confirm settings
   - Deploy!

### Option 3: Deploy via GitHub (Recommended for Continuous Deployment)

1. **Initialize Git repository** (if not already done)
   ```bash
   cd "/Users/jainam.shah/Documents/Jainam Personal Projects/Martek Group"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/martek-group-website.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Deploy!

## Other Deployment Options

### Netlify
1. Sign up at https://netlify.com
2. Drag and drop your project folder
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Deploy!

### Manual Build & Deploy

1. **Build the project**
   ```bash
   npm install
   npm run build
   npm start
   ```

2. **Or export static files** (if using static export)
   - Update `next.config.js` with `output: 'export'`
   - Run `npm run build`
   - Deploy the `out` folder to any static hosting

## Post-Deployment Checklist

- [ ] Update domain name in `app/sitemap.ts`
- [ ] Update domain name in `app/robots.ts`
- [ ] Update contact email/phone in Footer and Contact page
- [ ] Test all pages and forms
- [ ] Verify video banner loads correctly
- [ ] Test mobile responsiveness
- [ ] Set up form submission (API endpoint for contact form)

## Custom Domain Setup (Vercel)

1. Go to your project in Vercel dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. SSL certificate will be automatically provisioned

## Environment Variables

If you need to add environment variables (for API keys, etc.):

1. Go to Vercel dashboard > Your project > Settings > Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy your application

## Support

For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Next.js deployment: https://nextjs.org/docs/deployment
