# Environment Variables Setup Guide

Complete instructions for setting up all required environment variables for production deployment.

---

## 🔑 All Required Variables

```env
# ─── Database ────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# ─── Authentication ──────────────────────────────────────────────────────
AUTH_SECRET="generated-secret-key"
AUTH_URL="https://your-domain.com"

# ─── OAuth - GitHub ──────────────────────────────────────────────────────
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# ─── OAuth - Google ──────────────────────────────────────────────────────
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ─── AI APIs ─────────────────────────────────────────────────────────────
GROQ_API_KEY="your-groq-api-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

# ─── App Configuration ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="PathForge"
```

---

## 🗄️ 1. Database Setup (Neon)

### Create Free Neon Database:

1. **Sign up at [neon.tech](https://neon.tech)**
   - Click "Start Free"
   - Use email or GitHub account

2. **Create Project**
   - Click "New Project"
   - Give it a name (e.g., `pathforge`)
   - Select Region (choose closest to you)
   - Click "Create Project"

3. **Get Connection String**
   - On dashboard, find your project
   - Click "Connection Details"
   - Copy the **Connection String** (use the "Pooled" version for production)
   - Looks like: `postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require`

4. **Set Database URL**
   ```env
   DATABASE_URL="postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

5. **Initialize Database**
   ```bash
   # Run migrations
   pnpm db:push
   
   # (Optional) Seed with sample data
   pnpm db:seed
   ```

---

## 🔐 2. Authentication (NextAuth)

### Generate AUTH_SECRET:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 -InputObject (0..255) | ForEach-Object { [byte]$_ }) -join ''))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

Or use this online tool: [generate-secret.vercel.app](https://generate-secret.vercel.app)

**Result:** Paste the generated string as:
```env
AUTH_SECRET="your-generated-secret-here"
```

### Set AUTH_URL:

Replace with your deployed domain:
```env
# Development
AUTH_URL="http://localhost:3000"

# Production
AUTH_URL="https://your-domain.com"
```

---

## 🔑 3. GitHub OAuth Setup

### Create GitHub OAuth App:

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name:** `PathForge`
   - **Homepage URL:** `https://your-domain.com`
   - **Authorization callback URL:** `https://your-domain.com/api/auth/callback/github`
4. Click "Register application"
5. Copy:
   - **Client ID** → `GITHUB_CLIENT_ID`
   - **Client Secret** → `GITHUB_CLIENT_SECRET` (Generate a new one)

**Environment Variables:**
```env
GITHUB_CLIENT_ID="Ov23li..."
GITHUB_CLIENT_SECRET="abc123..."
```

---

## 🔑 4. Google OAuth Setup

### Create Google OAuth Credentials:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable APIs:
   - Go to **APIs & Services** → **Enabled APIs**
   - Search "Google+ API" and enable it
4. Create Credentials:
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google (dev)
     https://your-domain.com/api/auth/callback/google (prod)
     ```
5. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

**Environment Variables:**
```env
GOOGLE_CLIENT_ID="123456-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

---

## 🤖 5. AI APIs Setup

### Groq API (Primary):

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free tier available)
3. Click "Create API Key"
4. Copy the key

**Environment Variables:**
```env
GROQ_API_KEY="gsk_..."
```

**Available Models:**
- `mixtral-8x7b-32768` (Recommended - fast & capable)
- `llama-2-70b-chat`
- `llama-3.1-70b-versatile`

### Google Gemini API (Fallback):

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API Key"
3. Click "Create API Key in new project"
4. Copy the key

**Environment Variables:**
```env
GOOGLE_GENERATIVE_AI_API_KEY="AIza..."
```

**Free Tier Limits:**
- 15 requests/minute
- 1,500 requests/day
- Model: `gemini-2.5-flash`

---

## 📱 6. App Configuration

```env
# Use your deployed domain
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# App name (shown in UI)
NEXT_PUBLIC_APP_NAME="PathForge"
```

---

## 📋 Complete Production Setup Example

```env
# Database (Neon)
DATABASE_URL="postgresql://neondb_owner:abc123@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Auth
AUTH_SECRET="B9nK8wZ2xL7qM5pT3jR9vS4nY8hU2kW7="
AUTH_URL="https://pathforge.vercel.app"

# GitHub OAuth
GITHUB_CLIENT_ID="Ov23lisABC123"
GITHUB_CLIENT_SECRET="abc123def456ghi789"

# Google OAuth
GOOGLE_CLIENT_ID="123456-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xyz789"

# AI APIs
GROQ_API_KEY="gsk_abc123xyz789"
GOOGLE_GENERATIVE_AI_API_KEY="AIzaXyz789Abc123"

# App Config
NEXT_PUBLIC_APP_URL="https://pathforge.vercel.app"
NEXT_PUBLIC_APP_NAME="PathForge"
```

---

## 🔄 Setting Variables in Deployment Platforms

### Vercel:

1. Go to your project
2. **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** (e.g., `DATABASE_URL`)
   - **Value:** (e.g., `postgresql://...`)
   - **Environments:** Select `Production`, `Preview`, `Development`
4. Click "Save"

### Railway:

1. Click your app
2. Go to **Variables** tab
3. Click "New Variable"
4. Paste each `KEY=VALUE` pair
5. Click "Save"

### Render:

1. Click your service
2. Go to **Environment** tab
3. Add each variable in the form
4. Click "Save Changes"

---

## ✅ Verification Checklist

After setting all variables:

- [ ] Database URL is correct and accessible
- [ ] AUTH_SECRET is set (not empty)
- [ ] AUTH_URL matches deployment domain
- [ ] GitHub OAuth credentials are valid
- [ ] Google OAuth credentials are valid
- [ ] Groq API key is active
- [ ] Google Gemini API key is active
- [ ] NEXT_PUBLIC_APP_URL matches deployment domain
- [ ] All variables are set in deployment platform
- [ ] `pnpm build` succeeds locally
- [ ] Application starts with `pnpm start`

---

## 🆘 Common Issues

### "Database connection refused"
- Check `DATABASE_URL` is correct
- Verify IP whitelist in Neon dashboard
- Ensure SSL mode is enabled

### "OAuth callback URL mismatch"
- Check GitHub/Google callback URLs match your domain
- Format must be: `https://your-domain.com/api/auth/callback/{provider}`

### "AI model not found"
- Verify API key is valid
- Check model name is correct
- Ensure API key has permissions

### "AUTH_SECRET not set"
- Generate new secret using command above
- Set in deployment platform
- Restart application

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`**
   ```bash
   # Verify in .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Regenerate keys before production**
   - Don't use development keys
   - Create separate production OAuth apps
   - Use different Groq/Google API keys

3. **Rotate keys regularly**
   - Change AUTH_SECRET every 3-6 months
   - Regenerate OAuth secrets annually
   - Monitor API key usage

4. **Restrict OAuth apps**
   - Limit redirect URIs to your domain
   - Use production domains only
   - Disable unused providers

---

## 📞 Useful Links

- **Neon Database:** [neon.tech](https://neon.tech)
- **GitHub OAuth:** [docs.github.com/en/developers/apps](https://docs.github.com/en/developers/apps)
- **Google OAuth:** [cloud.google.com/docs/authentication](https://cloud.google.com/docs/authentication)
- **Groq API:** [console.groq.com](https://console.groq.com)
- **NextAuth.js:** [nextauth.js.org](https://nextauth.js.org)
