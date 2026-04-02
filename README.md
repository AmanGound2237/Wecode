# Wecode

An AI-focused practice platform inspired by LeetCode, with ML, DL, and data-centric challenges.

## Quick start

```bash
npm install
npm run dev
```

Then open the app at localhost:3000.

## Environment variables

Copy the example environment file and update it with your PostgreSQL connection string.

```bash
copy .env.example .env
```

Required variables:

- DATABASE_URL
- SESSION_PASSWORD
- ADMIN_EMAILS
- APP_URL
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- EMAIL_FROM

## Prisma

The Prisma schema is defined in prisma/schema.prisma. Run migrations after setting DATABASE_URL.

```bash
npx prisma migrate dev
```

Seed starter problems after migrating:

```bash
npm run db:seed
```

## Notes

- The Python runner API is currently stubbed at src/app/api/run/route.ts.
- Auth is wired with email/password via API routes under src/app/api/auth.
- Password reset tokens are stored in the database; run a migration after updating prisma/schema.prisma.
- The Python runner can use Docker locally. In Render, set RUNNER_MODE=local.

## Deploy on Render (Docker)

1) Create a new Web Service and choose Docker.
2) Set environment variables from .env.
3) Set RUNNER_MODE=local and RUNNER_PYTHON_CMD=python3.
4) Render will build and start the app using the Dockerfile.
