
import { db } from "./db";
import { 
  celebrities, events, fanCards, bookings, users,
  type Celebrity, type InsertCelebrity,
  type Event, type InsertEvent,
  type FanCard, type InsertFanCard,
  type Booking, type InsertBooking,
  type FanLoginRequest
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Celebrities
  getCelebrities(): Promise<Celebrity[]>;
  getCelebrityBySlug(slug: string): Promise<Celebrity | undefined>;
  getCelebrity(id: number): Promise<Celebrity | undefined>;
  createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity>;

  // Events
  getEventsByCelebrity(celebrityId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Fan Cards
  createFanCard(card: InsertFanCard): Promise<FanCard>;
  getFanCardByCodeAndEmail(code: string, email: string): Promise<FanCard | undefined>;
  getFanCard(id: number): Promise<FanCard | undefined>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByFanCard(fanCardId: number): Promise<(Booking & { event: Event })[]>;
}

export class DatabaseStorage implements IStorage {
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

  async getEventsByCelebrity(celebrityId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.celebrityId, celebrityId));
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    const [result] = await db.select().from(events).where(eq(events.id, id));
    return result;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [result] = await db.insert(events).values(event).returning();
    return result;
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
}

export const storage = new DatabaseStorage();
