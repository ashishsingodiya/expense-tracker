# A Full-Stack Next.js Expense Tracker App

Modern expense tracking app with authentication, dashboards, and reports built on Next.js and Prisma.

Live demo: https://expenses.ashish.pro

## Screenshot

![Dashboard](docs/dashboard.jpeg)

## Features

- User authentication (register, login, logout) with sessions
- Create, view, update, and delete expenses
- Category and monthly spending reports
- Dashboard with totals and recent expenses

## Tech Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- PostgreSQL with Prisma ORM

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Set environment variables

Create a `.env` file with:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

3. Run the app

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Run the production build
- `pnpm lint` - Lint the codebase
- `pnpm type-check` - TypeScript type checks
- `pnpm format` - Format with Prettier
