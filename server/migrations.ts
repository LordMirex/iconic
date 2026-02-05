import { sql } from "drizzle-orm";
import { db } from "./db";

/**
 * Creates all database tables if they don't exist.
 * This function uses raw SQL to create tables based on the schema defined in shared/schema.ts
 */
export async function createTables() {
  console.log("Creating database tables...");
  
  try {
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT true
      )
    `);
    
    // Create celebrities table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS celebrities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        bio TEXT NOT NULL,
        hero_image TEXT NOT NULL,
        avatar_image TEXT NOT NULL,
        accent_color TEXT DEFAULT '#3b82f6',
        is_featured BOOLEAN DEFAULT false,
        category TEXT NOT NULL DEFAULT 'Musician',
        full_bio TEXT,
        career_start INTEGER,
        accomplishments TEXT,
        social_media TEXT,
        gallery TEXT
      )
    `);
    
    // Create events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        celebrity_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        price TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        total_slots INTEGER NOT NULL,
        booked_slots INTEGER DEFAULT 0
      )
    `);
    
    // Create fan_cards table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS fan_cards (
        id SERIAL PRIMARY KEY,
        celebrity_id INTEGER NOT NULL,
        card_code TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        fan_name TEXT NOT NULL DEFAULT '',
        tier TEXT NOT NULL,
        card_type TEXT NOT NULL DEFAULT 'digital',
        status TEXT DEFAULT 'active',
        purchase_date TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create bookings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        fan_card_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create fan_card_tiers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS fan_card_tiers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        base_price TEXT NOT NULL,
        features TEXT NOT NULL,
        description TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#FFD700'
      )
    `);
    
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}
