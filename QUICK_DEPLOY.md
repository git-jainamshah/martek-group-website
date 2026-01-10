# Quick Deploy Guide 🚀

## Easiest Method: Vercel Dashboard (No Node.js Required!)

Since Node.js isn't installed locally, here's the fastest way to deploy:

### Step 1: Prepare Your Project for GitHub

1. **Initialize Git** (if you haven't already):
   ```bash
   cd "/Users/jainam.shah/Documents/Jainam Personal Projects/Martek Group"
   git init
   git add .
   git commit -m "Initial commit - Martek Group website"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub (github.com)
   - Follow GitHub's instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/martek-group-website.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub account for easiest integration)
3. **Click "New Project"**
4. **Import your GitHub repository** (the one you just created)
5. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
6. **Click "Deploy"**
7. **Wait 1-2 minutes** - Your site will be live!

### Alternative: Drag & Drop (Even Faster!)

If you don't want to use GitHub:

1. **Go to**: https://vercel.com/new
2. **Drag your entire project folder** to the upload area
3. **Wait for deployment** - Vercel will handle everything!

## Your Site Will Be Live At:
`https://your-project-name.vercel.app`

## What's Already Done ✅

- ✅ Ubuntu font configured
- ✅ Logo integrated from assets
- ✅ Video banner integrated
- ✅ Navigation updated (ABSTRACTS, BUSINESS SERVICES, BLOGS, BOOK NOW)
- ✅ Hero section matching PDF design
- ✅ All pages created
- ✅ Mobile responsive
- ✅ SEO optimized

## After Deployment

1. **Update Contact Info**: 
   - Edit `components/Footer.tsx` and `app/contact/page.tsx`
   - Replace placeholder emails/phones

2. **Set Up Custom Domain** (Optional):
   - Vercel dashboard > Settings > Domains
   - Add your domain (e.g., martekgroup.com)

3. **Test Everything**:
   - Video banner loads
   - Logo displays correctly
   - All navigation links work
   - Contact form works (needs API setup for emails)

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

Your website is ready to deploy! 🎉
