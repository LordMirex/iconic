import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let db: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Railway and many managed PostgreSQL services use self-signed certificates
    // Setting rejectUnauthorized: false is required for these services in production
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
  db = drizzle(pool, { schema });
} else {
  console.warn("DATABASE_URL not set - database features disabled during build");
  // Create a dummy db object that will fail if used, but allows the build to succeed
  db = null as any;
}

export { db };
