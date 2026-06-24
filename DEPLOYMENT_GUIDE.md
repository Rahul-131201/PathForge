# PathForge Deployment Guide

This guide covers free deployment options for PathForge with complete setup instructions.

---

## 🚀 Option 1: Vercel (Recommended - Free & Easiest)

**Why Vercel?** Built specifically for Next.js. Zero-config deployment, automatic SSL, global CDN, free tier.

### Step-by-Step:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (easiest)

2. **Connect GitHub Repository**
   - Click "New Project"
   - Import your GitHub repository
   - Select `pathforge` as the root directory

3. **Set Environment Variables**
   - Go to **Settings → Environment Variables**
   - Add all variables from `.env.local` (see **Environment Variables Setup** below)
   - **Important:** Do NOT use hardcoded URLs. Use Vercel's auto-generated URL.

4. **Configure Build Settings**
   - Framework: `Next.js`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

5. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2-3 minutes
   - Access at: `https://your-project.vercel.app`

### Update Your Environment Variables for Production:

```env
# Change these values:
AUTH_URL="https://your-project.vercel.app"  # Update from localhost
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"

# Keep API keys the same (regenerated ones)
DATABASE_URL="postgresql://..."
GROQ_API_KEY="gsk_..."
GOOGLE_GENERATIVE_AI_API_KEY="AIza..."
```

---

## 🚀 Option 2: Railway (Free & Simple)

**Why Railway?** Good for full-stack apps. Free tier with $5/month credit. Easy PostgreSQL setup.

### Step-by-Step:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select your repository

3. **Add PostgreSQL Database**
   - Click "Add"
   - Select "PostgreSQL"
   - Railway auto-creates a database

4. **Set Environment Variables**
   - Click on your app
   - Go to **Variables**
   - Add all environment variables

5. **Configure Deployment**
   - Root Directory: `pathforge`
   - Start Command: `npm run start`
   - Build Command: `npm run build`

6. **Deploy**
   - Click "Deploy"
   - Access at your Railway URL

---

## 🚀 Option 3: Render (Free Tier Available)

**Why Render?** Similar to Railway. Good free tier. Automatic builds from GitHub.

### Step-by-Step:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

3. **Configure Service**
   - Name: `pathforge`
   - Environment: `Node`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Instance Type: `Free` (for testing)

4. **Add PostgreSQL Database**
   - Create new PostgreSQL instance
   - Add connection string to environment variables

5. **Set Environment Variables**
   - Go to **Environment** tab
   - Add all variables from setup guide below

6. **Deploy**
   - Click "Deploy Service"
   - Access at your Render URL

---

## 📋 Pre-Deployment Checklist

- [ ] Regenerate all API keys (Groq, Google, GitHub, etc.)
- [ ] Remove `.env.local` from git history
- [ ] Add `.env.local` to `.gitignore`
- [ ] Run `pnpm build` locally - zero errors
- [ ] Update `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test database connections in production
- [ ] Set up monitoring/logging
- [ ] Configure domain name (if not using platform's subdomain)
- [ ] Enable HTTPS (all platforms do this by default)

---

## 🔒 Security Checklist

- [ ] All API keys are regenerated
- [ ] No secrets in source code
- [ ] Environment variables set in deployment platform
- [ ] Database backups enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled (optional)

---

## 📊 Monitoring & Logs

### Vercel:
- Go to **Analytics** for traffic stats
- **Functions** tab for API logs
- **Deployments** for history

### Railway:
- Click app → **Logs** tab
- **Metrics** for performance

### Render:
- Click service → **Logs** for output
- **Events** for deployment history

---

## 💰 Estimated Costs

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | Generous (12 deployments/day) | $20/month |
| **Railway** | $5/month credit | Pay as you go |
| **Render** | Limited (updates every 15 min) | $7/month |
| **Neon DB** | Free tier (3GB) | $0.3/GB/month |

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check locally first
pnpm clean
pnpm install
pnpm build
```

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check IP whitelist in database settings
- Ensure SSL mode is enabled

### Authentication Not Working
- Verify OAuth redirect URLs match deployment URL
- Check `AUTH_SECRET` is set
- Ensure `AUTH_URL` matches your domain

### API Keys Not Working
- Confirm keys are valid (test in local dev first)
- Check environment variables are set correctly
- Verify keys haven't expired or been revoked

---

## 🚀 Zero-Downtime Updates

To update your deployed app:

```bash
# 1. Make changes locally
git add .
git commit -m "feature: add new feature"

# 2. Push to GitHub
git push

# 3. Deployment platforms auto-deploy
# Vercel: automatic
# Railway: automatic (if configured)
# Render: automatic (if configured)
```

All platforms support automatic deployments on GitHub push.

---

## 📞 Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Neon Docs:** [neon.tech/docs](https://neon.tech/docs)
