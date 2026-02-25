# Webshop MVP (Next.js + Prisma + Stripe)

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (Neon/Supabase)
- Stripe Checkout (Test mode)

## Why products disappear on Netlify
In Netlify, local SQLite (`file:./dev.db`) is not suitable because the filesystem is ephemeral between deploys/functions.
Use an external PostgreSQL database and fetch products at request time.

Applied fixes:
- Added server-side product diagnostics logs:
  - `src/lib/store.ts`
  - `src/app/api/products/route.ts`
- Forced request-time rendering for product pages:
  - `src/app/[locale]/products/page.tsx` -> `export const dynamic = "force-dynamic"`
  - `src/app/[locale]/page.tsx` -> `export const dynamic = "force-dynamic"`
- Switched Prisma datasource provider to `postgresql`.

## Environment Variables
Set these in local `.env` and Netlify:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_APP_URL="https://YOUR_SITE.netlify.app"
```

## Local setup
```bash
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

## Scripts
- `npm run db:migrate` local dev migration
- `npm run db:deploy` apply migrations in production
- `npm run db:push` quick schema sync
- `npm run db:seed` seed demo data
- `npm run db:studio` Prisma Studio
- `npm run build` production build

## Product diagnostics logs
Check Netlify server logs for:
- `[products] query success` -> query returned count
- `[products] query failed` -> DB/ENV connection issue
- `[products] count success|failed`
- `[api/products] request|response`

Diagnostic endpoint:
- `GET /api/products?page=1&limit=24`

## Netlify configuration
`netlify.toml` build command:
- `npm install && npx prisma generate && npx prisma db push && npm run build`

Plugin:
- `@netlify/plugin-nextjs`

## Netlify setup steps
1. Connect your GitHub repository to Netlify.
2. In `Site settings -> Environment variables`, add all ENV values above.
3. In `Deploys`, click `Trigger deploy -> Clear cache and deploy site`.
4. After deploy, test:
   - `/api/products`
   - `/ar/products` and `/en/products`
5. If products still disappear, open server logs and inspect `[products] query failed`.

## Stripe webhook local test
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Demo accounts
- Admin: `admin@webshop.local` / `Admin123!`
- User: `user@webshop.local` / `User123!`
