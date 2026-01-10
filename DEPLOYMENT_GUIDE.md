# Deployment Guide - Vercel

This guide will help you deploy the CX Management Platform to Vercel and share it with your client.

## Step 1: Initialize Git Repository

First, let's set up version control:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CX Management Platform"
```

## Step 2: Create GitHub Repository

### Option A: Private Repository (Recommended for client work)
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it: `cx-management-platform` (or your preferred name)
4. **Select "Private"** (important for client work)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Option B: Public Repository
- Same steps, but select "Public" instead

## Step 3: Connect Local Repository to GitHub

After creating the GitHub repo, you'll see instructions. Run these commands (replace with your repo URL):

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/cx-management-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to Vercel

### Method 1: Via Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub account)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. **Important:** Add these environment variables (if needed):
   - Usually not needed since Firebase config is in code
6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. You'll get a live URL like: `https://cx-management-platform.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: cx-management-platform
# - Directory: ./
# - Override settings? No
```

## Step 5: Configure Firebase for Production

Your Firebase project should already work with the deployed URL, but you may need to:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `cx-management-add3c`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain (e.g., `cx-management-platform.vercel.app`)
5. Firebase automatically allows `localhost` and your Firebase domain

## Step 6: Share with Client

Once deployed, you'll have a live URL. Share:
- The live URL
- The `CLIENT_TESTING_GUIDE.md` document (or copy its contents into an email)

## Quick Deployment Checklist

- [ ] Git repository initialized
- [ ] Code pushed to GitHub (private repo recommended)
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Firebase authorized domains updated
- [ ] Test the live URL
- [ ] Share URL and testing guide with client

## Troubleshooting

### Build Errors
- Make sure all dependencies are in `package.json`
- Check that `vite.config.js` exists (Vite should auto-generate it)

### Firebase Errors
- Verify Firebase config in `src/config/firebase.js`
- Check authorized domains in Firebase Console
- Ensure Firestore rules allow read/write (for testing)

### Environment Variables
- If you need to hide Firebase keys (optional), use Vercel's environment variables
- For now, Firebase config in code is fine for a prototype

## Post-Deployment

After deployment:
1. Test all features on the live site
2. Verify sign-up works (both customer and admin)
3. Test file uploads
4. Check real-time updates
5. Share the link with client

---

**Note:** Vercel provides free hosting with automatic HTTPS. The free tier is perfect for client demos and testing.

