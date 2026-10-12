# ecommerce-platform

A production-grade full-stack e-commerce platform inspired by Amazon, built with React, Node.js, Express, TypeScript, and PostgreSQL.

## Overview

This monorepo includes:

- `apps/web`: React + Vite + TypeScript + Tailwind storefront
- `apps/api`: Express + TypeScript + Prisma + PostgreSQL backend
- `prisma`: schema, migrations, seed scripts
- `docs`: API and deployment documentation

## Architecture

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Zustand, Axios, React Hook Form, Zod
- Backend: Express, TypeScript, Prisma, PostgreSQL, JWT auth, Redis, Razorpay, Stripe, Nodemailer
- Security: bcrypt password hashing, JWT refresh rotation, rate limiting, CORS, Helmet
- Admin: protected dashboard routes and protected admin APIs

## Local development

1. Copy `.env.example` to `.env` and set secrets.
2. Start PostgreSQL and Redis with Docker:
   ```bash
   docker compose up -d db redis
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

## Backend commands

```bash
cd apps/api
npm install
npm run dev
```

## Frontend commands

```bash
cd apps/web
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Database

The project uses PostgreSQL and Prisma. Prisma schema is located in `prisma/schema.prisma`.

## Important notes

- Never commit real secrets or production credentials.
- Razorpay and Stripe keys should be configured in `.env`.
- Cloudinary credentials are required for product image uploads.
- Email provider credentials are required for order confirmation and password reset workflows.

## Project structure

```text
ecommerce-platform/
  apps/
    api/
    web/
  prisma/
  docs/
  docker-compose.yml
  .env.example
  README.md
  package.json
```
