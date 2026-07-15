# ToursBU

**Travel Together. Explore More.**

ToursBU is a scalable SaaS platform for student travel management. Students discover trips, reserve seats, and make payments online. Administrators manage every operational aspect from a powerful dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | NestJS, Prisma ORM, PostgreSQL (Supabase) |
| Auth | Better Auth (Session, Google OAuth, Email OTP) |
| Payments | Razorpay |
| Email | Resend |
| Storage | Supabase Storage |
| Deployment | Vercel (frontend), Railway (backend) |

## Monorepo Structure

```
ToursBU/
├── apps/web        → Next.js 15 frontend
├── apps/api        → NestJS backend (scaffolded)
├── packages/types  → Shared TypeScript types
├── packages/utils  → Shared utilities
├── packages/config → Shared configuration
├── packages/ui     → Shared UI (future)
├── prisma/         → Database schema
└── docs/           → Documentation
```

## Quick Start

```bash
# Install dependencies
npm install

# Run frontend
npm run dev:web

# Run full monorepo
npm run dev
```

## Documentation

See the [docs/](./docs/) directory for detailed documentation:

- [Architecture](./docs/architecture.md)
- [Database](./docs/database.md)
- [API](./docs/api.md)
- [Frontend](./docs/frontend.md)
- [Backend](./docs/backend.md)
- [Authentication](./docs/auth.md)
- [Booking Flow](./docs/booking-flow.md)
- [Payment Flow](./docs/payment-flow.md)
- [Deployment](./docs/deployment.md)
- [Design System](./docs/design-system.md)
- [Contributing](./docs/contributing.md)
- [Roadmap](./docs/roadmap.md)

## License

Private — All rights reserved.
