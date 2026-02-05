import { sql } from "drizzle-orm";
import { db } from "./db";
import { createTables } from "./migrations";

/**
 * Seeds the database by dynamically importing and calling the seedDatabase function
 */
async function runSeedDatabase() {
  const { seedDatabase } = await import("./routes");
  await seedDatabase();
}

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
    } else {
      console.log("Database tables already exist.");
    }
    
    // Seed the database with initial data
    // The seedDatabase function has its own check for existing data
    console.log("Checking if seeding is needed...");
    await runSeedDatabase();
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Database initialization error:", error);
    
    // If error indicates missing tables, attempt recovery
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    const isTableMissingError = errorMessage.includes("does not exist") || 
                                errorMessage.includes("relation") ||
                                errorMessage.includes("table");
    
    if (isTableMissingError) {
      console.log("Attempting to create tables after error...");
      try {
        await createTables();
        await runSeedDatabase();
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
