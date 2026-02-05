# Render.com Zero-Setup Deployment Guide

## Overview
The Iconic celebrity booking platform now supports **zero-configuration deployment** on Render.com using Infrastructure as Code (Blueprint). Simply connect your GitHub repository and click deploy - everything else happens automatically!

## What Happens Automatically

When you deploy using the Render Blueprint (`render.yaml`), Render will automatically:

1. **Provision a PostgreSQL database** (free tier)
   - Database name: `iconic`
   - User: `iconic`
   - SSL connection enabled

2. **Create and configure the web service**
   - Install dependencies: `npm install`
   - Build the application: `npm run build`
   - Start the server: `npm run start`

3. **Set environment variables**
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL` (automatically linked to the database)
   - `ADMIN_PASSWORD` (auto-generated secure value)
   - `JWT_SECRET` (auto-generated secure value)

4. **Initialize the database on first run**
   - Create all tables (users, celebrities, events, fan_cards, bookings, fan_card_tiers)
   - Seed with demo data:
     - 30 celebrities across different categories
     - 45+ events (concerts, meet & greets, visitations)
     - Fan card tiers (Gold, Platinum, Black)
     - Demo admin user

## Deployment Instructions

### Method 1: One-Click Blueprint Deploy (Recommended)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com) and sign in

2. **Deploy from Blueprint**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the `iconic` repository
   - Render will automatically detect `render.yaml`

3. **Review and Deploy**
   - Review the services that will be created
   - Click "Apply" to deploy
   - Wait for deployment to complete (3-5 minutes)

4. **Access Your App**
   - Once deployed, click on the web service URL
   - The app is ready to use with all data seeded!

### Method 2: Manual Setup (Alternative)

If you prefer manual configuration:

1. **Create PostgreSQL Database**
   - New → Database → PostgreSQL
   - Name: `iconic-db`
   - Plan: Free

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repository
   - Name: `iconic`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<link-to-database>
   ADMIN_PASSWORD=<your-secure-password>
   JWT_SECRET=<your-secure-jwt-secret>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - First deployment will auto-initialize the database

## Key Features

### Automatic Database Initialization
On first startup, the app automatically:
- Checks if database tables exist
- Creates all required tables if missing
- Seeds demo data if database is empty
- All subsequent startups skip initialization if data exists

### Graceful Build Process
- Build succeeds even without database connection
- Database connection established at runtime
- No manual migration commands needed

### Persistent Data
- PostgreSQL database with persistent storage
- Data survives across deployments
- Database automatically backs up (Render feature)

## Environment Variables

### Auto-Generated (Blueprint)
- `ADMIN_PASSWORD` - Secure random admin password
- `JWT_SECRET` - Secure random JWT signing key

### Auto-Configured (Blueprint)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 5000

### Manual Setup (if not using Blueprint)
You'll need to set these manually:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_secure_jwt_secret_here
```

## Development Setup

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
# Create .env file
DATABASE_URL=postgresql://username:password@localhost:5432/iconic
NODE_ENV=development
```

3. **Start development server**:
```bash
npm run dev
```

The app will automatically initialize the database on first run.

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run db:push` - Push schema changes to database (manual)
- `npm run db:studio` - Open Drizzle Studio database viewer

## Database Schema

### Tables Created Automatically
- **users** - Admin/manager authentication
- **celebrities** - Celebrity profiles with bio, images, social media
- **events** - Bookable events (concerts, meet & greets, etc.)
- **fan_cards** - Fan membership cards with tiers
- **bookings** - Event bookings linked to fan cards
- **fan_card_tiers** - Tier definitions and pricing

### Sample Data
The automatic seeding includes:
- **30 celebrities** across categories: Musicians, Actors, Athletes, Chefs, Influencers
- **45+ events** with varied pricing and locations
- **3 fan card tiers**: Gold ($49), Platinum ($99), Black ($199)
- **1 demo admin user** (username: admin, password from `ADMIN_PASSWORD`)

## Troubleshooting

### Deployment Issues

**Build fails with "command not found"**
- Ensure `render.yaml` specifies correct build command
- Check that all dependencies are in `package.json`

**Database connection fails**
- Verify `DATABASE_URL` is properly linked in environment variables
- Check database service is running
- Review Render logs for connection errors

**App crashes on startup**
- Check Render logs: Dashboard → Web Service → Logs
- Verify all required environment variables are set
- Ensure database is accessible

### Database Issues

**Tables not created**
- Check startup logs for initialization messages
- Verify database permissions
- Try manual redeployment to trigger initialization

**Connection timeout**
- Render free tier databases may spin down after inactivity
- First request after spin-down may take longer
- Subsequent requests will be fast

### Performance

**Slow initial load**
- Free tier services spin down after 15 minutes of inactivity
- First request wakes up the service (30-60 seconds)
- Consider upgrading to paid tier for always-on service

## Security Notes

### SSL Connections
- All PostgreSQL connections use SSL in production
- `rejectUnauthorized: false` required for Render's managed PostgreSQL
- This is standard for managed database services

### Auto-Generated Secrets
- `ADMIN_PASSWORD` and `JWT_SECRET` are cryptographically secure
- Generated by Render during blueprint deployment
- Stored securely in Render's environment variable system
- Never exposed in logs or version control

### Best Practices
- Never commit `.env` files
- Rotate secrets periodically via Render dashboard
- Use separate databases for staging and production
- Enable Render's automatic backups

## Updating Your App

### Code Changes
1. Push changes to your GitHub repository
2. Render automatically detects changes
3. Builds and deploys new version
4. Database and data persist across deployments

### Database Schema Changes
If you modify the database schema:
1. Update `shared/schema.ts`
2. Database migrations handled by initialization logic
3. Consider creating backup before major schema changes

## Cost

### Free Tier Limits (as of 2024)
- **Database**: 256 MB storage, 97 connection hours/month
- **Web Service**: 750 hours/month (spins down after inactivity)
- **Bandwidth**: 100 GB/month

### Upgrade Options
- Paid plans available for always-on services
- Increased database storage and connection limits
- Better performance and no spin-down

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Open an issue in the repository
- **Render Support**: Available for paid plans

## Comparison with Other Platforms

| Feature | Render (Blueprint) | Railway | Vercel |
|---------|-------------------|---------|--------|
| Zero-config deploy | ✅ Yes | ✅ Yes | ⚠️ Manual DB |
| Free PostgreSQL | ✅ Yes | ✅ Yes | ❌ No |
| Auto-initialize DB | ✅ Yes | ✅ Yes | ⚠️ Manual |
| Infrastructure as Code | ✅ render.yaml | ⚠️ Limited | ❌ No |
| Ease of setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

The Render Blueprint provides the smoothest deployment experience with complete automation!
