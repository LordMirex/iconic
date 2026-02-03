
import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Manager/Admin users (could be expanded, but for now just one manager context)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // For simple auth, or we map to Replit Auth
  isAdmin: boolean("is_admin").default(true),
});

export const celebrities = pgTable("celebrities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // e.g., 'taylor-swift'
  bio: text("bio").notNull(),
  heroImage: text("hero_image").notNull(),
  avatarImage: text("avatar_image").notNull(),
  accentColor: text("accent_color").default("#3b82f6"), // Custom branding per celebrity
  isFeatured: boolean("is_featured").default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  celebrityId: integer("celebrity_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // 'concert', 'meet_greet', 'visitation'
  totalSlots: integer("total_slots").notNull(),
  bookedSlots: integer("booked_slots").default(0),
});

export const fanCards = pgTable("fan_cards", {
  id: serial("id").primaryKey(),
  celebrityId: integer("celebrity_id").notNull(),
  cardCode: text("card_code").notNull(), // Unique ID like "TAYLOR-1234"
  email: text("email").notNull(),
  tier: text("tier").notNull(), // 'Gold', 'Platinum', 'Black'
  status: text("status").default("active"), // 'active', 'pending'
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  fanCardId: integer("fan_card_id").notNull(),
  eventId: integer("event_id").notNull(),
  status: text("status").default("confirmed"), // 'confirmed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
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

// === TYPES ===

export type Celebrity = typeof celebrities.$inferSelect;
export type InsertCelebrity = z.infer<typeof insertCelebritySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type FanCard = typeof fanCards.$inferSelect;
export type InsertFanCard = z.infer<typeof insertFanCardSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

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
