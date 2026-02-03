# 🔐 Version Control Dashboard

A secret, password-protected web interface for managing your project versions with visual controls and rollback features.

## 🌐 Access the Dashboard

Navigate to: **http://localhost:3000/site-vc**

Or in production: **https://yourdomain.com/site-vc**

## 🔑 Login Credentials

**Default Password:** `martek2024!secure`

⚠️ **IMPORTANT:** Change this password before deploying to production!

### How to Change the Password

1. Open `app/api/git-versions/route.ts`
2. Find the line: `const ADMIN_PASSWORD = 'martek2024!secure';`
3. Change it to your own secure password
4. Save the file

**Or** use environment variables (recommended for production):
1. Create a `.env.local` file in the root directory
2. Add: `ADMIN_VC_PASSWORD=your_secure_password_here`
3. Update the API route to use: `process.env.ADMIN_VC_PASSWORD`

## ✨ Features

### 📊 Dashboard Overview
- **Total Versions:** See count of all commits
- **Current Branch:** View which branch you're on
- **Latest Version:** Quick view of most recent commit
- **Search & Filter:** Search by message, author, or commit hash

### 📋 Two View Modes

#### 1. Table View
Clean, organized table showing:
- Serial number
- Version number (v1.0.X format)
- Commit hash
- Date (relative and absolute)
- Author name
- Commit message
- Action buttons

#### 2. Timeline View
Beautiful card-based timeline showing:
- Version cards with full details
- Visual timeline layout
- Easy-to-scan format
- Quick action buttons

### 🔍 Version Details
Click the 👁️ (eye) icon to see:
- Full commit hash
- Complete author information
- Exact date and time
- Full commit message
- Quick rollback option

### ⏪ Rollback Feature

**How it works:**
1. Click the 🔄 (rollback) button on any version
2. Confirm your action
3. System automatically creates a backup branch
4. Rolls back to selected version
5. Shows confirmation with backup branch name

**Safety Features:**
- Automatic backup branch creation (`backup-{timestamp}`)
- Double confirmation required
- Clear warning messages
- Backup branch preserved for recovery

### 🎨 Beautiful UI
- Dark mode by default
- Glassmorphism effects
- Smooth animations
- Responsive design
- Professional color scheme
- Loading states
- Error handling

## 🚀 Usage Examples

### View Recent Changes
1. Login to dashboard
2. Scroll through versions in table or timeline view
3. Click any version to see details

### Search for Specific Changes
1. Use search box at top
2. Type: commit message, author name, or commit hash
3. Results filter in real-time

### Rollback to Previous Version
1. Find the version you want
2. Click the rollback button (🔄)
3. Confirm the action
4. Wait for confirmation
5. Refresh to see updated versions

### Emergency Recovery
If rollback goes wrong:
1. Check the backup branch name from confirmation message
2. Run: `git checkout backup-{timestamp}`
3. Or switch branches through the dashboard

## 🛡️ Security Features

### Password Protection
- Login required for all operations
- Invalid attempts rejected
- Session-based authentication
- No public access

### Git Safety
- Backup branch created before rollback
- Confirmation required for destructive actions
- All operations logged
- Read-only viewing by default

### Best Practices
1. **Change default password** before production
2. **Use environment variables** for password storage
3. **Enable HTTPS** in production
4. **Restrict access** to trusted IPs if possible
5. **Monitor access logs** regularly

## 🎯 Common Tasks

### Check Latest Changes
```
1. Go to /site-vc
2. Login
3. View top of the list
```

### Find Who Made a Change
```
1. Search for the feature name
2. Check author column
3. View details for more info
```

### Undo Last Commit
```
1. Click rollback on 2nd-to-last version
2. Confirm
3. Latest commit is undone
```

### Compare Versions
```
1. View details of version A
2. Note the commit hash
3. View details of version B
4. Use git diff in terminal:
   git diff <hash-A> <hash-B>
```

## ⚠️ Important Notes

### Before Rollback
- ✅ Ensure you have no uncommitted changes
- ✅ Backup is created automatically
- ✅ You can recover using backup branch
- ✅ Remote repository not affected until you push

### After Rollback
- ⚠️ Local changes are reverted
- ⚠️ You'll need to force push to update remote
- ⚠️ Team members should pull latest changes
- ⚠️ Backup branch remains for recovery

### Production Considerations
- 🔒 Change default password immediately
- 🔒 Use environment variables
- 🔒 Enable HTTPS
- 🔒 Add IP restrictions
- 🔒 Monitor access logs
- 🔒 Set up alerts for rollbacks

## 🔧 Troubleshooting

### "Invalid Password" Error
- Check you're using correct password
- Password is case-sensitive
- Default: `martek2024!secure`

### "Failed to fetch versions" Error
- Ensure dev server is running
- Check terminal for API errors
- Verify git is installed and working

### Rollback Not Working
- Ensure no uncommitted changes
- Check you have write permissions
- Verify git repository is valid
- Check terminal for errors

### Can't Access Dashboard
- Ensure dev server is running
- Navigate to exactly `/site-vc`
- Clear browser cache
- Check for JavaScript errors

## 📖 API Endpoints

The dashboard uses these endpoints (all require password):

### `POST /api/git-versions`

**Actions:**

1. **getVersions** - Fetch all versions
```json
{
  "password": "your_password",
  "action": "getVersions"
}
```

2. **getCommitDetails** - Get specific commit info
```json
{
  "password": "your_password",
  "action": "getCommitDetails",
  "commitHash": "abc1234"
}
```

3. **rollback** - Rollback to version
```json
{
  "password": "your_password",
  "action": "rollback",
  "commitHash": "abc1234"
}
```

4. **getCurrentStatus** - Get git status
```json
{
  "password": "your_password",
  "action": "getCurrentStatus"
}
```

## 🎨 Customization

### Change Color Scheme
Edit `app/site-vc/page.tsx`:
- Search for color classes (e.g., `bg-blue-600`)
- Replace with your preferred colors
- Available: red, green, yellow, purple, pink, etc.

### Add More Features
Consider adding:
- Branch switching UI
- Diff viewer
- Commit comparison
- Tag management
- Merge conflict resolution
- File browser

### Modify Table Columns
Edit the table in `page.tsx`:
- Add/remove columns in `<thead>`
- Update data in `<tbody>`
- Adjust width classes

## 📱 Mobile Support

The dashboard is fully responsive:
- Works on phones and tablets
- Touch-friendly buttons
- Optimized layouts
- Smooth scrolling

## 🌟 Pro Tips

1. **Quick Search:** Use Cmd/Ctrl + F to search within the page
2. **Keyboard Navigation:** Tab through buttons
3. **Bookmark It:** Save `/site-vc` for quick access
4. **Multiple Tabs:** Open in new tab to compare versions
5. **Share Link:** Send link to team (they'll need password)

## 📝 Changelog

### v1.0.0 - Initial Release
- Password-protected access
- Version table view
- Timeline view
- Search and filter
- Rollback with backup
- Version details modal
- Responsive design

---

## 🆘 Need Help?

- Check the main README.md for git commands
- See QUICK_REFERENCE.md for terminal commands
- Contact admin if locked out
- Check browser console for errors

---

**🔒 Keep your password secure and change it regularly!**

**⚠️ Never commit passwords to git - use .env.local**

**✅ Always create backups before major rollbacks**
