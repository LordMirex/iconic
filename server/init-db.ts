import Database from "better-sqlite3";
import * as schema from "../shared/schema";

const sqlite = new Database("sqlite.db");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS celebrities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    bio TEXT NOT NULL,
    full_bio TEXT,
    career_start INTEGER,
    accomplishments TEXT,
    social_media TEXT,
    gallery TEXT,
    hero_image TEXT NOT NULL,
    avatar_image TEXT NOT NULL,
    accent_color TEXT DEFAULT '#3b82f6',
    is_featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    celebrity_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    date INTEGER NOT NULL,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    total_slots INTEGER NOT NULL,
    booked_slots INTEGER DEFAULT 0,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id)
  );

  CREATE TABLE IF NOT EXISTS fan_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    celebrity_id INTEGER NOT NULL,
    card_code TEXT NOT NULL,
    email TEXT NOT NULL,
    fan_name TEXT NOT NULL DEFAULT '',
    tier TEXT NOT NULL,
    card_type TEXT DEFAULT 'digital',
    price TEXT,
    status TEXT DEFAULT 'active',
    purchase_date INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fan_card_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (fan_card_id) REFERENCES fan_cards(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );
`);

console.log("Database tables created successfully!");
sqlite.close();
