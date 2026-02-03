# Contributing to Martek Group Website

Thank you for your interest in contributing to the Martek Group website! This document provides guidelines and workflows for making changes.

## 🔄 Version Control Workflow

This project uses Git for version control with automatic tracking to GitHub. All changes are automatically synced when you push.

### Making Changes

1. **Check current status**
   ```bash
   git status
   ```

2. **Stage your changes**
   ```bash
   # Stage specific files
   git add path/to/file.tsx
   
   # Or stage all changes
   git add .
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Brief description of your changes"
   ```

4. **Push to GitHub**
   ```bash
   git push
   ```
   
   That's it! Your changes are now on GitHub and tracked in version control.

### Viewing History

```bash
# View commit history
git log --oneline

# View detailed commit history
git log -p

# View changes in a specific file
git log -p path/to/file.tsx
```

### Undoing Changes

```bash
# Undo uncommitted changes to a file
git checkout -- path/to/file.tsx

# Undo all uncommitted changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Rolling Back to Previous Versions

```bash
# View commit history to find the commit you want
git log --oneline

# Create a new branch from a specific commit (safe approach)
git checkout -b rollback-branch <commit-hash>

# Or revert to a specific commit (creates a new commit)
git revert <commit-hash>

# Or hard reset to a specific commit (destructive!)
git reset --hard <commit-hash>
git push --force  # Use with caution!
```

## 📁 Large Files (Videos)

**Important:** Video files over 100 MB cannot be pushed to GitHub due to file size limits.

### Current Setup

The following files are in `.gitignore` and won't be tracked:
- `public/assets/homepage-banner-bg.mp4`
- Other `*-bg.mp4` files if they're too large

### Adding Your Own Videos

1. Place your video files in `public/assets/`
2. Keep file sizes under 100 MB if you want to track them in git
3. Or keep them local only (they're already in `.gitignore`)

### For Large Video Files

If you need to use videos larger than 100 MB:

**Option 1: Use a CDN or External Hosting**
- Upload to services like Cloudflare R2, AWS S3, or Bunny CDN
- Update component references to use external URLs

**Option 2: Install Git LFS (Large File Storage)**
```bash
# Install Git LFS (macOS)
brew install git-lfs

# Initialize in repository
git lfs install

# Track video files
git lfs track "*.mp4"

# Commit the changes
git add .gitattributes
git commit -m "Add Git LFS tracking for videos"
```

## 🏗️ Development Workflow

### Creating a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit regularly**
   ```bash
   git add .
   git commit -m "Add feature X"
   ```

3. **Push your feature branch**
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create a Pull Request on GitHub**
   - Go to the repository on GitHub
   - Click "Pull requests" → "New pull request"
   - Select your feature branch
   - Add description and submit

5. **After review, merge to main**
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push
   ```

### Working with Others

```bash
# Pull latest changes before starting work
git pull

# If there are conflicts, resolve them and commit
git add .
git commit -m "Merge conflicts resolved"
git push
```

## 🐛 Bug Fixes

1. Create a bugfix branch:
   ```bash
   git checkout -b bugfix/description-of-bug
   ```

2. Fix the bug and commit:
   ```bash
   git add .
   git commit -m "Fix: description of what was fixed"
   ```

3. Push and create PR:
   ```bash
   git push -u origin bugfix/description-of-bug
   ```

## 📋 Commit Message Guidelines

Use clear, descriptive commit messages:

- **feat:** New feature
  - `feat: add dark mode toggle`
- **fix:** Bug fix
  - `fix: correct navigation link on mobile`
- **docs:** Documentation changes
  - `docs: update README with setup instructions`
- **style:** Code style changes (formatting, etc.)
  - `style: format code with prettier`
- **refactor:** Code refactoring
  - `refactor: simplify hero component logic`
- **test:** Adding or updating tests
  - `test: add unit tests for contact form`
- **chore:** Maintenance tasks
  - `chore: update dependencies`

## 🔍 Code Review Checklist

Before pushing changes, verify:

- [ ] Code runs without errors (`npm run dev`)
- [ ] No console errors in browser
- [ ] Changes work on mobile, tablet, and desktop
- [ ] Code is properly formatted
- [ ] No sensitive information (API keys, tokens) in code
- [ ] All new components have proper TypeScript types
- [ ] Images and assets are optimized

## 🚀 Deployment

This repository is set up for automatic deployment:

### Vercel (Recommended)
- Connect your GitHub repository to Vercel
- Every push to `main` automatically deploys
- Pull requests create preview deployments

### Manual Deployment
```bash
# Build the project
npm run build

# Test the production build locally
npm start

# Deploy to your hosting service
```

## 🆘 Getting Help

If you encounter issues:

1. Check existing [GitHub Issues](https://github.com/git-jainamshah/martek-group-website/issues)
2. Read the [README.md](README.md) for setup instructions
3. Contact the team at info@martekgroup.com

## 📝 Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Use functional components with hooks
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

## 🎨 Design Guidelines

- Maintain consistent spacing and typography
- Test dark and light modes
- Ensure accessibility (semantic HTML, alt text, etc.)
- Keep animations smooth and purposeful
- Optimize images and videos before adding

---

**Thank you for contributing to the Martek Group website! 🚀**
