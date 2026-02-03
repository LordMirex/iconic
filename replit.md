# Celebrity Fan Management Platform

## Overview

This is a multi-tenant celebrity management and fan engagement SaaS platform called **StarPass**. The platform enables talent managers to create and manage celebrity pages, while fans can purchase membership cards, book events, and access exclusive content.

**Core Features:**
- Celebrity profile pages with custom branding
- Tiered fan card system (Gold, Platinum, Black)
- Event booking and ticket management
- Fan dashboard for managing memberships and bookings
- Manager portal for talent administration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight React router)
- **State Management:** TanStack React Query for server state
- **Styling:** Tailwind CSS with shadcn/ui component library
- **Animations:** Framer Motion for page transitions and interactions
- **Forms:** React Hook Form with Zod validation

### Backend Architecture
- **Runtime:** Node.js with Express 5
- **Language:** TypeScript (ESM modules)
- **API Pattern:** RESTful endpoints defined in shared route definitions
- **Build Tool:** Vite for frontend, esbuild for server bundling

### Data Layer
- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Schema Location:** `shared/schema.ts` contains all table definitions
- **Validation:** Drizzle-Zod for generating insert/select schemas from database tables
- **Migrations:** Drizzle Kit with `db:push` command

### Key Design Patterns
- **Shared Types:** Database schemas and API route definitions are shared between client and server via `@shared/*` path alias
- **Storage Interface:** `IStorage` interface abstracts database operations, implemented by `DatabaseStorage` class
- **Type-Safe API:** Route definitions include Zod schemas for request/response validation

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui)
│   ├── hooks/           # Custom React hooks for data fetching
│   ├── pages/           # Route components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database access layer
│   └── db.ts            # Database connection
├── shared/              # Shared code between client/server
│   ├── schema.ts        # Drizzle table definitions
│   └── routes.ts        # API route contracts
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL:** Primary database via `DATABASE_URL` environment variable
- **Connection:** pg Pool with Drizzle ORM wrapper

### UI Component Library
- **shadcn/ui:** Pre-built accessible components using Radix UI primitives
- **Configuration:** `components.json` defines component paths and Tailwind settings

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `framer-motion` - Animation library
- `react-hook-form` / `@hookform/resolvers` - Form handling
- `wouter` - Client-side routing
- `lucide-react` - Icon library

### Development Tools
- **Vite:** Frontend dev server with HMR
- **Replit Plugins:** Runtime error overlay, cartographer, dev banner (development only)