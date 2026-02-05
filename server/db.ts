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
  // During build time, DATABASE_URL may not be set yet
  // This is expected and allows the build to complete successfully
  // At runtime, the database connection will be established when DATABASE_URL is available
  if (process.env.NODE_ENV === "production") {
    console.warn("DATABASE_URL not set - database will fail if accessed");
  } else {
    console.warn("DATABASE_URL not set - database features disabled during build");
  }
  // Create a dummy db object that will fail with a clear error if used
  db = null as any;
}

export { db };
