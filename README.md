# PathForge

PathForge is an AI-powered learning roadmap generator that creates personalized, step-by-step study plans based on your goal, skill level, and available time. Built with Next.js 16, React 19, Drizzle ORM on Neon Postgres, and Groq (with Gemini fallback).

---

## Tech Stack

| Library / Service | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack React framework, SSR, API routes |
| React 19 + TypeScript 5 | UI library with full type safety |
| Tailwind CSS v4 | Utility-first styling, dark theme |
| Framer Motion | Animations and page transitions |
| Drizzle ORM | Type-safe SQL query builder |
| Neon Postgres | Serverless PostgreSQL database |
| NextAuth v5 | Authentication (GitHub, Google, Credentials) |
| Vercel AI SDK + Groq | AI roadmap generation (primary: llama-3.1-70b, fallback: Gemini) |
| @xyflow/react | Interactive roadmap graph |
| Three.js / R3F | 3D hero scene |
| Lenis | Smooth scroll |
| Sonner | Toast notifications |
| Zod | Schema validation |

---

## Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **pnpm** — `npm install -g pnpm`
- A **Neon** account (free) — [neon.tech](https://neon.tech)
- A **Groq** API key (free) — [console.groq.com](https://console.groq.com)
- A **Google Cloud** project for OAuth (free) — [console.cloud.google.com](https://console.cloud.google.com)
- A **GitHub** OAuth App (free) — [github.com/settings/developers](https://github.com/settings/developers)
- A **Google AI Studio** API key (free tier, fallback only) — [aistudio.google.com](https://aistudio.google.com)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pathforge.git
cd pathforge

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in all values (see Free Services Setup below)

# 4. Push the schema to your Neon database
pnpm db:push

# 5. (Optional) Seed the database with 3 sample public roadmaps
pnpm db:seed

# 6. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Free Services Setup

### 1. Neon Postgres (Database)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click **New Project** → give it a name → click **Create Project**
3. On the project dashboard, click **Connection Details**
4. Copy the **Connection String** (it starts with `postgresql://`)
5. Paste it as `DATABASE_URL` in your `.env.local`

> **Tip:** Use the **pooled** connection string for production.

### 2. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select an existing one)
3. Click **Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
6. Copy **Client ID** → `GOOGLE_CLIENT_ID`
7. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

### 3. GitHub OAuth

1. Go to [GitHub → Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** PathForge (or anything)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy **Client ID** → `GITHUB_CLIENT_ID`
6. Click **Generate a new client secret** → `GITHUB_CLIENT_SECRET`

### 4. Groq API Key (Primary AI)

1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key → `GROQ_API_KEY`

> **Free tier:** 30 requests/minute. Sufficient for development and personal use. Powers fast AI roadmap generation using `mixtral-8x7b-32768`.

### 5. Google AI Studio (Fallback Only)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key → `GOOGLE_GENERATIVE_AI_API_KEY`

> **Purpose:** Fallback AI model if Groq is unavailable. Free tier: 15 requests/minute, 1,500 requests/day on `gemini-2.5-flash`.

### 6. NextAuth Secret

Generate a secure secret with:

```bash
openssl rand -base64 32
```

Paste the output as `AUTH_SECRET` in `.env.local`.

---

## Deployment

### Deploy to Vercel (Recommended)

Vercel has the best support for Next.js App Router, Server Actions, and Edge Runtime.

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In the **Environment Variables** section, add all variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g. `https://pathforge.vercel.app`)
5. Set `AUTH_URL` to your Vercel domain too
6. Click **Deploy**

For OAuth to work in production, update your callback URLs in Google Cloud Console and GitHub to use your production domain.

### Deploy to Cloudflare Pages

> **Note:** Cloudflare Pages supports Next.js via the `@cloudflare/next-on-pages` adapter, but Server Actions and the Node.js runtime require extra configuration. **Vercel is the simpler path** for this app.

If you still want Cloudflare:

```bash
pnpm add -D @cloudflare/next-on-pages
```

Then follow the [Cloudflare Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the development server (Turbopack) |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm db:push` | Push schema changes to the database (no migration file) |
| `pnpm db:generate` | Generate a new Drizzle migration file |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |
| `pnpm db:seed` | Insert 3 sample public roadmaps into the database |

---

## Project Structure

```
pathforge/
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Authenticated app shell
│   │   │   ├── dashboard/      # Main dashboard page
│   │   │   └── roadmap/[id]/   # Roadmap viewer
│   │   ├── (marketing)/        # Public-facing pages
│   │   │   ├── explore/        # Explore & discover roadmaps
│   │   │   └── page.tsx        # Landing page
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth handlers
│   │   │   ├── explore/        # Pagination endpoint
│   │   │   ├── og/             # Dynamic OG image generation
│   │   │   └── roadmap/        # Generate & progress APIs
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── layout.tsx          # Root layout
│   │   ├── manifest.ts         # PWA manifest
│   │   ├── robots.ts           # robots.txt
│   │   └── sitemap.ts          # Dynamic sitemap
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── explore/            # Explore page components
│   │   ├── landing/            # Marketing page sections
│   │   ├── onboarding/         # Onboarding wizard steps
│   │   ├── roadmap/            # Roadmap viewer & graph
│   │   ├── shared/             # Reusable UI components & skeletons
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── explore.ts          # Explore types & helpers
│   │   └── utils.ts            # cn() and utilities
│   ├── server/
│   │   ├── ai/                 # AI generation logic (Groq primary + Gemini fallback)
│   │   ├── auth/               # NextAuth configuration
│   │   ├── db/
│   │   │   ├── index.ts        # Drizzle client
│   │   │   ├── schema.ts       # Database schema
│   │   │   └── seed.ts         # Sample data seed script
│   │   └── explore.ts          # Server-side explore queries
│   └── types/                  # Shared TypeScript types
├── public/
│   └── manifest.json           # PWA manifest (static)
├── drizzle/                    # Generated migration files
├── drizzle.config.ts           # Drizzle Kit configuration
├── next.config.ts              # Next.js configuration
└── .env.example                # Environment variable template
```

---

## Contributing

Contributions are welcome!

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Follow the code style:** TypeScript strict mode, Tailwind CSS v4 utility classes, Drizzle for all DB access.

3. **Keep components small:** Prefer splitting into smaller focused components over large files.

4. **Run checks before opening a PR:**
   ```bash
   pnpm type-check
   pnpm lint
   pnpm build
   ```

5. **Open a Pull Request** with a clear description of what was changed and why.

### Reporting Issues

Please open a GitHub Issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Your Node.js version and OS

---

## License

MIT — feel free to use, fork, and build on top of PathForge.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
