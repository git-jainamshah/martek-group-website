# 🚀 Quick Reference Guide - Marrelay Website

Your go-to guide for common tasks and commands.

---

## 📋 View All Versions (Like a Table)

### Quick Version Table
```bash
./view-versions.sh
```

This shows you exactly what you asked for:

```
Sr#   Version   Commit     Date                 Summary
────────────────────────────────────────────────────────────────
1     v1.0.0    90ea98c    3 weeks ago          Initial commit - Marrelay...
2     v1.0.1    1258458    24 hours ago         Add complete features
3     v1.0.2    e715635    37 minutes ago       Initial commit
...
```

### 🎨 NEW! Customization Options

**Show last 5 commits only:**
```bash
./view-versions.sh -n 5
```

**Show all commits:**
```bash
./view-versions.sh --all
```

**Detailed view with author and file stats:**
```bash
./view-versions.sh --detailed
```

**Compact minimal view:**
```bash
./view-versions.sh --compact
```

**Interactive customization tool:**
```bash
./customize-versions.sh
```
This lets you:
- Change color scheme (blue/green/purple/rainbow)
- Change table style (default/compact/detailed/minimal)
- Toggle author display
- Set default number of commits to show
- Preview changes before saving

### Detailed Changelog
```bash
cat CHANGELOG.md
```

Or open `CHANGELOG.md` file to see:
- Version numbers (v1.0.1, v1.0.2, etc.)
- Full descriptions of each change
- Date stamps
- Detailed breakdown of features added

---

## 🔄 Making Changes & Pushing to GitHub

### Super Easy Way (One Command)
```bash
./git-push.sh "Your commit message here"
```

**Example:**
```bash
./git-push.sh "Updated homepage banner"
```

This will automatically:
1. ✅ Stage all your changes
2. ✅ Commit with your message
3. ✅ Push to GitHub
4. ✅ Show you the latest 5 versions

### Manual Way (Traditional Git)
```bash
# See what changed
git status

# Stage your changes
git add .

# Commit with a message
git commit -m "Your message here"

# Push to GitHub
git push
```

---

## 📊 Viewing Project History

### All Commands at a Glance

| What You Want to See | Command |
|---------------------|---------|
| **Version table** | `./view-versions.sh` |
| **Changelog** | `cat CHANGELOG.md` |
| **Simple list** | `git log --oneline` |
| **Detailed logs** | `git log` |
| **Visual tree** | `git log --graph --oneline --all` |
| **Who changed what** | `git blame filename.tsx` |
| **Changes in a file** | `git log -p filename.tsx` |

### Specific Commit Details
```bash
# See full details of a specific version
git show <commit-hash>

# Example:
git show 90ea98c
```

### Compare Versions
```bash
# See differences between two versions
git diff <old-commit> <new-commit>

# Example:
git diff 90ea98c 1258458
```

---

## ⏪ Rolling Back to Previous Versions

### Safe Way (View Old Version Without Changing)
```bash
# Just look at an old version (safe, doesn't change anything)
git checkout <commit-hash>

# Example:
git checkout 90ea98c

# Return to latest version
git checkout main
```

### Undo Last Commit (Keep Changes)
```bash
# Undo commit but keep your file changes
git reset --soft HEAD~1
```

### Hard Rollback (Destructive - Be Careful!)
```bash
# Go back to a specific version (loses all changes after it)
git reset --hard <commit-hash>
git push --force

# ⚠️ WARNING: This deletes all commits after that point!
```

### Safe Rollback (Recommended)
```bash
# Creates a new commit that reverses old changes
git revert <commit-hash>
git push
```

---

## 🌐 Syncing with GitHub

### Pull Latest Changes
```bash
# Get latest from GitHub
git pull
```

### Push Your Changes
```bash
# Send your changes to GitHub
git push
```

### Check Sync Status
```bash
# Are you ahead, behind, or in sync?
git status
```

---

## 🛠️ Development Commands

### Start Development Server
```bash
npm run dev
```
Opens at http://localhost:3000

### Install Dependencies
```bash
npm install
```

### Build for Production
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

---

## 📁 Common File Operations

### View File at Specific Version
```bash
git show <commit-hash>:path/to/file.tsx
```

### Restore Deleted File
```bash
# Find when it was deleted
git log --all --full-history -- path/to/file.tsx

# Restore it
git checkout <commit-hash>~1 -- path/to/file.tsx
```

### Undo Changes to a File (Before Commit)
```bash
git checkout -- path/to/file.tsx
```

---

## 🔍 Search and Find

### Find When Something Changed
```bash
# Search commit messages
git log --grep="homepage"

# Search code changes
git log -S"function name"

# Find who changed a line
git blame path/to/file.tsx
```

### List Files Changed in a Commit
```bash
git show --name-only <commit-hash>
```

---

## 🎯 Branching (For Features)

### Create New Feature Branch
```bash
git checkout -b feature/my-new-feature
```

### List All Branches
```bash
git branch -a
```

### Switch Between Branches
```bash
git checkout main
git checkout feature/my-new-feature
```

### Merge Feature Back to Main
```bash
git checkout main
git merge feature/my-new-feature
git push
```

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
npx kill-port 3000
# OR
PORT=3001 npm run dev
```

### Merge Conflicts
```bash
# After pulling, if conflicts occur:
# 1. Open conflicted files
# 2. Resolve conflicts manually
# 3. Then:
git add .
git commit -m "Resolve merge conflicts"
git push
```

### Accidentally Committed Wrong Files
```bash
# Undo last commit, keep files
git reset --soft HEAD~1

# Remove specific file from staging
git reset HEAD path/to/file.tsx
```

### Clean Git Cache
```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## 📧 Need Help?

- **Documentation**: See README.md
- **Contributing Guide**: See CONTRIBUTING.md
- **Changelog**: See CHANGELOG.md
- **Support**: info@marrelay.com
- **GitHub Issues**: https://github.com/git-jainamshah/martek-group-website/issues

---

## 🎨 Quick Tips

1. **Always commit often** - Small commits are better than big ones
2. **Write clear commit messages** - Future you will thank you
3. **Pull before you push** - Avoid conflicts
4. **Use feature branches** - Keep main clean
5. **Test before committing** - Make sure it works
6. **Check `git status`** - Know what you're committing

---

**Pro Tip:** Bookmark this file! Press `Cmd/Ctrl + D` in your editor.

---

## 🔐 NEW! Secret Version Control Dashboard

Access a beautiful web-based version control dashboard:

```bash
# Start dev server (if not running)
npm run dev

# Then navigate to:
http://localhost:3000/site-vc
```

**Default Password:** `martek2024!secure`

**Features:**
- 📊 Visual table of all versions
- 🎨 Timeline view mode
- 🔍 Real-time search & filter
- ⏪ One-click rollback with backup
- 📈 Statistics dashboard
- 📱 Mobile responsive
- 🎯 View detailed commit info

**See [VC_DASHBOARD.md](VC_DASHBOARD.md) for full documentation**

---

## 🎉 Most Used Commands

```bash
# The Big 4 (You'll use these constantly)
http://localhost:3000/site-vc   # Visual dashboard (NEW!)
./view-versions.sh              # Terminal version table
./git-push.sh "Your message"    # Save & push changes
npm run dev                     # Start dev server

# The Essential 5
git status                      # Check what changed
git pull                        # Get latest
git log --oneline              # View history
cat CHANGELOG.md               # See all versions
git checkout <commit>          # View old version
```

---

**Happy Coding! 🚀**

*Last Updated: February 2, 2026*
