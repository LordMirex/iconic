
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Manager/Admin users (could be expanded, but for now just one manager context)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // For simple auth, or we map to Replit Auth
  isAdmin: integer("is_admin", { mode: 'boolean' }).default(true),
});

export const celebrities = sqliteTable("celebrities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // e.g., 'taylor-swift'
  bio: text("bio").notNull(),
  heroImage: text("hero_image").notNull(),
  avatarImage: text("avatar_image").notNull(),
  accentColor: text("accent_color").default("#3b82f6"), // Custom branding per celebrity
  isFeatured: integer("is_featured", { mode: 'boolean' }).default(false),
  // Extended fields
  category: text("category").notNull().default("Musician"), // 'Musician', 'Actor', 'Athlete', 'Creator'
  fullBio: text("full_bio"), // Extended biography
  careerStart: integer("career_start"), // Year they started their career
  accomplishments: text("accomplishments"), // JSON array of achievements
  socialMedia: text("social_media"), // JSON object with social links
  gallery: text("gallery"), // JSON array of image URLs
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  celebrityId: integer("celebrity_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: integer("date", { mode: 'timestamp' }).notNull(),
  price: text("price").notNull(), // SQLite doesn't have decimal, using text for precision
  location: text("location").notNull(),
  type: text("type").notNull(), // 'concert', 'meet_greet', 'visitation'
  totalSlots: integer("total_slots").notNull(),
  bookedSlots: integer("booked_slots").default(0),
});

export const fanCards = sqliteTable("fan_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  celebrityId: integer("celebrity_id").notNull(),
  cardCode: text("card_code").notNull(), // Unique ID like "TAYLOR-1234"
  email: text("email").notNull(),
  fanName: text("fan_name").notNull().default(''),
  tier: text("tier").notNull(), // 'Gold', 'Platinum', 'Black'
  cardType: text("card_type").notNull().default("digital"), // 'digital', 'physical'
  status: text("status").default("active"), // 'active', 'pending'
  purchaseDate: integer("purchase_date", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fanCardId: integer("fan_card_id").notNull(),
  eventId: integer("event_id").notNull(),
  status: text("status").default("confirmed"), // 'confirmed', 'cancelled'
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
});

export const fanCardTiers = sqliteTable("fan_card_tiers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(), // 'Gold', 'Platinum', 'Black'
  basePrice: text("base_price").notNull(), // Base price for the tier
  features: text("features").notNull(), // JSON array of features
  description: text("description").notNull(),
  color: text("color").notNull().default("#FFD700"), // Color theme for the tier
});

// === RELATIONS ===

export const celebritiesRelations = relations(celebrities, ({ many }) => ({
  events: many(events),
  fanCards: many(fanCards),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  celebrity: one(celebrities, {
    fields: [events.celebrityId],
    references: [celebrities.id],
  }),
  bookings: many(bookings),
}));

export const fanCardsRelations = relations(fanCards, ({ one, many }) => ({
  celebrity: one(celebrities, {
    fields: [fanCards.celebrityId],
    references: [celebrities.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  fanCard: one(fanCards, {
    fields: [bookings.fanCardId],
    references: [fanCards.id],
  }),
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertCelebritySchema = createInsertSchema(celebrities).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, bookedSlots: true });
export const insertFanCardSchema = createInsertSchema(fanCards).omit({ id: true, purchaseDate: true, status: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, status: true });
export const insertFanCardTierSchema = createInsertSchema(fanCardTiers).omit({ id: true });

// === TYPES ===

export type Celebrity = typeof celebrities.$inferSelect;
export type InsertCelebrity = z.infer<typeof insertCelebritySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type FanCard = typeof fanCards.$inferSelect;
export type InsertFanCard = z.infer<typeof insertFanCardSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type FanCardTier = typeof fanCardTiers.$inferSelect;
export type InsertFanCardTier = z.infer<typeof insertFanCardTierSchema>;

// Auth types
export const fanLoginSchema = z.object({
  email: z.string().email(),
  cardCode: z.string().min(1),
});
export type FanLoginRequest = z.infer<typeof fanLoginSchema>;

export const managerLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
