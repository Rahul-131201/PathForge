# Pathforge Setup and Run Guide

## Frontend URL
The platform is accessible at:
- **Local:** [http://localhost:3001](http://localhost:3001)
- **Note:** If port 3000 is occupied, Next.js automatically switches to 3001.

## Startup Commands

### Run Development Server
```bash
npm run dev
```

### Database Management
- **Generate Migrations:** `npm run db:generate`
- **Push Schema:** `npm run db:push`
- **Seed Database:** `npm run db:seed`
- **Drizzle Studio:** `npm run db:studio`

## Default Credentials
- **Authentication:** No default credentials. Please use the **Sign Up** feature to create an account.
- **NextAuth:** Supports GitHub and Google login if configured in `.env`.

## Environment Configuration
Ensure your `.env` or `.env.local` file is populated with:
- `DATABASE_URL` (Neon PostgreSQL)
- `AUTH_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (Optional)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Optional)
- `GROQ_API_KEY` or `GOOGLE_API_KEY` for AI features.
