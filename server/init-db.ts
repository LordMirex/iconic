import { sql } from "drizzle-orm";
import { db } from "./db";
import { createTables } from "./migrations";

/**
 * Initializes the database by creating tables and seeding data if needed.
 * This function is called on server startup to ensure the database is ready.
 */
export async function initializeDatabase() {
  try {
    console.log("Checking database state...");
    
    // Check if tables exist by trying to query the celebrities table
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'celebrities'
      );
    `);
    
    const tablesExist = result.rows[0]?.exists;
    
    if (!tablesExist) {
      console.log("Database tables do not exist. Creating tables...");
      await createTables();
      console.log("Database tables created successfully!");
      
      // Seed the database with initial data
      // We import seedDatabase dynamically to avoid circular dependency issues
      console.log("Seeding database with initial data...");
      const { seedDatabase } = await import("./routes");
      await seedDatabase();
      console.log("Database initialization complete!");
    } else {
      console.log("Database tables already exist. Checking if seeding is needed...");
      // The seedDatabase function has its own check for existing data
      const { seedDatabase } = await import("./routes");
      await seedDatabase();
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    
    // If error is about table not existing, try to create them
    if (error instanceof Error && error.message.includes("does not exist")) {
      console.log("Attempting to create tables after error...");
      try {
        await createTables();
        const { seedDatabase } = await import("./routes");
        await seedDatabase();
        console.log("Database recovered and initialized successfully!");
      } catch (recoveryError) {
        console.error("Failed to recover database:", recoveryError);
        throw recoveryError;
      }
    } else {
      throw error;
    }
  }
}
