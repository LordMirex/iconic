import { db } from "./db";
import { 
  celebrities, events, fanCards, bookings, users, fanCardTiers,
  type Celebrity, type InsertCelebrity,
  type Event, type InsertEvent,
  type FanCard, type InsertFanCard,
  type Booking, type InsertBooking,
  type FanCardTier, type InsertFanCardTier,
  type User, type InsertUser,
  type FanLoginRequest
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Celebrities
  getCelebrities(): Promise<Celebrity[]>;
  getCelebrityBySlug(slug: string): Promise<Celebrity | undefined>;
  getCelebrity(id: number): Promise<Celebrity | undefined>;
  createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity>;
  updateCelebrity(id: number, celebrity: Partial<InsertCelebrity>): Promise<Celebrity | undefined>;
  deleteCelebrity(id: number): Promise<boolean>;

  // Events
  getEventsByCelebrity(celebrityId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Fan Cards
  createFanCard(card: InsertFanCard): Promise<FanCard>;
  getFanCardByCodeAndEmail(code: string, email: string): Promise<FanCard | undefined>;
  getFanCard(id: number): Promise<FanCard | undefined>;
  getFanCards(): Promise<FanCard[]>;
  
  // Fan Card Tiers
  getFanCardTiers(): Promise<FanCardTier[]>;
  createFanCardTier(tier: InsertFanCardTier): Promise<FanCardTier>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByFanCard(fanCardId: number): Promise<(Booking & { event: Event })[]>;
  getBookings(): Promise<Booking[]>;
  incrementEventBookedSlots(eventId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.username, username));
    return result;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getCelebrities(): Promise<Celebrity[]> {
    return await db.select().from(celebrities);
  }

  async getCelebrityBySlug(slug: string): Promise<Celebrity | undefined> {
    const [result] = await db.select().from(celebrities).where(eq(celebrities.slug, slug));
    return result;
  }

  async getCelebrity(id: number): Promise<Celebrity | undefined> {
    const [result] = await db.select().from(celebrities).where(eq(celebrities.id, id));
    return result;
  }

  async createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity> {
    const [result] = await db.insert(celebrities).values(celebrity).returning();
    return result;
  }

  async updateCelebrity(id: number, celebrity: Partial<InsertCelebrity>): Promise<Celebrity | undefined> {
    const [result] = await db.update(celebrities)
      .set(celebrity)
      .where(eq(celebrities.id, id))
      .returning();
    return result;
  }

  async deleteCelebrity(id: number): Promise<boolean> {
    const result = await db.delete(celebrities).where(eq(celebrities.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getEventsByCelebrity(celebrityId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.celebrityId, celebrityId));
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    const [result] = await db.select().from(events).where(eq(events.id, id));
    return result;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [result] = await db.insert(events).values(event).returning();
    return result;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [result] = await db.update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return result;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createFanCard(card: InsertFanCard): Promise<FanCard> {
    // Generate a simple unique code based on random string + timestamp
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    // We'd ideally fetch the celebrity to get their prefix, but for now generic or pass in
    const cardCode = `${card.cardCode}-${uniqueSuffix}`; 
    
    const [result] = await db.insert(fanCards).values({
      ...card,
      cardCode: cardCode,
      status: 'active'
    }).returning();
    return result;
  }

  async getFanCardByCodeAndEmail(code: string, email: string): Promise<FanCard | undefined> {
    const [result] = await db.select().from(fanCards).where(
      and(
        eq(fanCards.cardCode, code),
        eq(fanCards.email, email)
      )
    );
    return result;
  }

  async getFanCard(id: number): Promise<FanCard | undefined> {
    const [result] = await db.select().from(fanCards).where(eq(fanCards.id, id));
    return result;
  }

  async getFanCards(): Promise<FanCard[]> {
    return await db.select().from(fanCards);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [result] = await db.insert(bookings).values(booking).returning();
    return result;
  }

  async getBookingsByFanCard(fanCardId: number): Promise<(Booking & { event: Event })[]> {
    const results = await db.select({
      booking: bookings,
      event: events
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(eq(bookings.fanCardId, fanCardId));

    return results.map(r => ({ ...r.booking, event: r.event }));
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async incrementEventBookedSlots(eventId: number): Promise<void> {
    await db.update(events)
      .set({ bookedSlots: sql`${events.bookedSlots} + 1` })
      .where(eq(events.id, eventId));
  }

  async getFanCardTiers(): Promise<FanCardTier[]> {
    return await db.select().from(fanCardTiers);
  }

  async createFanCardTier(tier: InsertFanCardTier): Promise<FanCardTier> {
    const [result] = await db.insert(fanCardTiers).values(tier).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
