# AI-Edu Impact Survey

## Production setup

1. Copy `.env.example` to `.env.local` and set a unique `AUTH_SECRET` (at least 32 characters) and production MongoDB URI.
2. Provision researcher accounts directly in the database. Public sign-up intentionally creates only student accounts.
3. Install dependencies and run `npm run build`; deploy only after it passes.
4. Configure HTTPS at the hosting layer. Session cookies become `Secure` automatically when `NODE_ENV=production`.

The application no longer seeds or displays synthetic responses in production. When MongoDB is unavailable, survey submission fails safely rather than pretending data was saved.
