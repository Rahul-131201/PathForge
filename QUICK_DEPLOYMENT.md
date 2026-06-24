# 🚀 Quick Deployment Checklist

Follow this checklist to deploy PathForge in 30 minutes.

---

## ✅ Phase 1: Prepare Your Code (5 minutes)

- [ ] Run `pnpm build` locally - should complete with zero errors
- [ ] Run `pnpm start` locally - should run on port 3000
- [ ] Commit all changes to GitHub: `git push origin main`
- [ ] Verify TypeScript errors are fixed: `pnpm type-check`

**Status:** If all checks pass, move to Phase 2.

---

## ✅ Phase 2: Create Production Secrets (10 minutes)

### 2.1 Generate AUTH_SECRET
```powershell
# Windows
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 -InputObject (0..255) | ForEach-Object { [byte]$_ }) -join ''))
```

**Copy this value** - you'll need it soon.

### 2.2 Set Up Database (Neon)
1. Go to [neon.tech](https://neon.tech) → Create account
2. Create project → Copy "Pooled" connection string
3. **Save this as:** `DATABASE_URL`

### 2.3 Set Up GitHub OAuth
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App
3. **Callback URL:** `https://your-domain.com/api/auth/callback/github`
4. **Copy:** Client ID + Client Secret

### 2.4 Set Up Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. **Add redirect URI:** `https://your-domain.com/api/auth/callback/google`
5. **Copy:** Client ID + Client Secret

### 2.5 Set Up AI APIs
1. **Groq:** [console.groq.com](https://console.groq.com) → Create API Key
2. **Google Gemini:** [aistudio.google.com](https://aistudio.google.com) → Get API Key

**You should now have these values:**
```
✓ DATABASE_URL
✓ AUTH_SECRET
✓ GITHUB_CLIENT_ID
✓ GITHUB_CLIENT_SECRET
✓ GOOGLE_CLIENT_ID
✓ GOOGLE_CLIENT_SECRET
✓ GROQ_API_KEY
✓ GOOGLE_GENERATIVE_AI_API_KEY
```

---

## ✅ Phase 3: Deploy on Vercel (10 minutes) - RECOMMENDED

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. **Root Directory:** Select `pathforge`

### 3.2 Add Environment Variables
1. Go to **Settings → Environment Variables**
2. Add all 8 variables from Phase 2:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | From Neon |
| `AUTH_SECRET` | Generated secret |
| `AUTH_URL` | `https://your-project.vercel.app` |
| `GITHUB_CLIENT_ID` | From GitHub |
| `GITHUB_CLIENT_SECRET` | From GitHub |
| `GOOGLE_CLIENT_ID` | From Google |
| `GOOGLE_CLIENT_SECRET` | From Google |
| `GROQ_API_KEY` | From Groq |
| `GOOGLE_GENERATIVE_AI_API_KEY` | From Google |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `PathForge` |

### 3.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site is live at `https://your-project.vercel.app`

---

## ✅ Phase 4: Test Your Deployment (5 minutes)

1. **Visit your deployed URL**
   - Open `https://your-project.vercel.app`
   - Should see the PathForge homepage

2. **Test Authentication**
   - Click "Sign In"
   - Try GitHub login
   - Try Google login
   - Should work without errors

3. **Test Database**
   - Create an account
   - Create a roadmap
   - Should save to database

4. **Test AI Feature**
   - Generate a roadmap
   - Should use Groq API
   - Should display results

---

## 🔄 Auto-Deployments

Vercel automatically deploys when you:

```bash
# Make changes
git add .
git commit -m "feature: description"
git push origin main

# Automatically deploys to Vercel!
```

No manual deployment needed after first setup.

---

## 📊 Monitor Your Deployment

### Vercel Dashboard:
- **Deployments:** See all deployment history
- **Analytics:** View traffic & performance
- **Logs:** Check for errors
- **Settings:** Manage environment variables

### Common Commands:
```bash
# Check build locally
pnpm build

# Test production build
pnpm start

# Check for errors
pnpm type-check
```

---

## 🆘 Troubleshooting

### Deployment fails
```bash
# 1. Check locally first
pnpm clean
pnpm install
pnpm build

# 2. Check for errors
pnpm type-check

# 3. Push fixes
git push origin main
```

### Authentication not working
- Verify callback URLs match your domain
- Check environment variables are set
- Confirm OAuth secrets are correct

### Database errors
- Check `DATABASE_URL` format
- Verify Neon database exists
- Run: `pnpm db:push` in local terminal

### AI not responding
- Verify API keys are valid
- Check Groq/Google console for rate limits
- Fallback should work (Gemini)

---

## 📱 Custom Domain (Optional)

1. In Vercel: **Settings → Domains**
2. Add your custom domain
3. Follow DNS setup instructions
4. Update environment variables:
   ```env
   AUTH_URL="https://your-custom-domain.com"
   NEXT_PUBLIC_APP_URL="https://your-custom-domain.com"
   ```

---

## 💡 Pro Tips

1. **Use Preview URLs** for testing PRs
   - Every PR gets a preview deployment
   - Test before merging

2. **Enable Analytics**
   - See real usage data
   - Identify performance issues

3. **Set Up Git Hooks** (optional)
   ```bash
   # Auto-format code before commits
   pnpm install -D husky lint-staged
   ```

4. **Monitor Logs**
   - Check for 500 errors
   - Watch for API rate limits

---

## ✨ You're Done!

Your PathForge application is now deployed and accessible to the world. 🎉

### Next Steps:
1. Share your domain with users
2. Monitor performance
3. Gather feedback
4. Plan feature updates

### Support:
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org](https://nextjs.org)
- **Drizzle Docs:** [orm.drizzle.team](https://orm.drizzle.team)

---

## 📞 Need Help?

If something goes wrong:

1. Check Vercel logs: **Deployments → Select deployment → Logs**
2. Check local errors: `pnpm build`
3. Verify environment variables are set
4. Check if services are online (Neon, Groq, Google)

**Most issues are:** Wrong environment variables, missing OAuth setup, or database connection issues.
