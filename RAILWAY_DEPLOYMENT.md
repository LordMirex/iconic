# PostgreSQL Migration & Railway Deployment Guide

## Overview
The Iconic celebrity booking platform has been migrated from SQLite to PostgreSQL to enable deployment on Railway with persistent data storage.

## Migration Changes

### Database Changes
- **From**: SQLite with `better-sqlite3`
- **To**: PostgreSQL with `pg` and `@neondatabase/serverless`

### Updated Files
1. `package.json` - Updated dependencies and build scripts
2. `shared/schema.ts` - Converted table definitions to PostgreSQL
3. `server/db.ts` - PostgreSQL connection with SSL support
4. `server/storage.ts` - PostgreSQL-compatible queries
5. `drizzle.config.ts` - PostgreSQL dialect configuration
6. `railway.json` - Railway deployment configuration
7. `nixpacks.toml` - Build configuration for Node.js 20

## Railway Deployment Instructions

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository connected to Railway

### Step 1: Create PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. Copy the `DATABASE_URL` connection string

### Step 2: Configure Environment Variables
In your Railway service settings, add:
```
DATABASE_URL=<your-postgresql-connection-string>
NODE_ENV=production
```

### Step 3: Deploy Application
1. Connect your GitHub repository to Railway
2. Railway will automatically:
   - Detect the `nixpacks.toml` configuration
   - Install dependencies with `npm ci`
   - Build the application with `npm run build`
   - Start the server with `npm start`

### Step 4: Initialize Database
On first deployment, the application will automatically:
- Run database migrations via Drizzle ORM
- Seed the database with:
  - 30 celebrities across different categories
  - 45+ events (concerts, meet & greets, visitations)
  - Fan card tiers (Gold, Platinum, Black)
  - Demo fan card for testing

## Development Setup

### Local Development with PostgreSQL

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
echo "DATABASE_URL=postgresql://username:password@localhost:5432/iconic" > .env
```

3. Push database schema:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

5. Open Drizzle Studio (optional):
```bash
npm run db:studio
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio database viewer

## Database Schema

### Tables
- **users** - Admin/manager users
- **celebrities** - Celebrity profiles with extended information
- **events** - Bookable events (concerts, meet & greets, etc.)
- **fan_cards** - Fan membership cards (Gold, Platinum, Black tiers)
- **bookings** - Event bookings linked to fan cards
- **fan_card_tiers** - Tier definitions and pricing

### Key Features
- Automatic timestamp management with `defaultNow()`
- Serial primary keys for auto-incrementing IDs
- Boolean fields for flags (is_admin, is_featured)
- Proper timestamp types for dates
- Unique constraints on usernames, slugs, and card codes

## Troubleshooting

### Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running on Railway
- Ensure SSL configuration is appropriate for your environment

### Migration Issues
- Run `npm run db:push` to sync schema changes
- Check Drizzle logs for schema drift warnings

### Build Failures
- Verify Node.js version is 20+ (specified in `nixpacks.toml`)
- Check that all dependencies are listed in `package.json`
- Review Railway build logs for specific errors

## Security Notes

### SSL Configuration
The application uses SSL for production PostgreSQL connections. Railway and many managed PostgreSQL services use self-signed certificates, which requires `rejectUnauthorized: false` in the SSL configuration.

### Environment Variables
Never commit `.env` files or expose `DATABASE_URL` in public repositories. These are excluded in `.gitignore`.

## Support
For issues or questions, please open an issue on the GitHub repository.
