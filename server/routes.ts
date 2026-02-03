
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Public / General ---
  
  app.get(api.celebrities.list.path, async (req, res) => {
    const celebs = await storage.getCelebrities();
    res.json(celebs);
  });

  app.get(api.celebrities.get.path, async (req, res) => {
    const celeb = await storage.getCelebrityBySlug(req.params.slug);
    if (!celeb) return res.status(404).json({ message: "Celebrity not found" });
    res.json(celeb);
  });

  app.post(api.celebrities.create.path, async (req, res) => {
    try {
      const input = api.celebrities.create.input.parse(req.body);
      const celeb = await storage.createCelebrity(input);
      res.status(201).json(celeb);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // --- Events ---

  app.get(api.events.listByCelebrity.path, async (req, res) => {
    const events = await storage.getEventsByCelebrity(Number(req.params.id));
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // --- Fan Cards ---

  app.post(api.fanCards.purchase.path, async (req, res) => {
    try {
      // Input has celebrityId, email, tier. 
      // We need to generate the cardCode prefix.
      const input = api.fanCards.purchase.input.parse(req.body);
      
      const celeb = await storage.getCelebrity(input.celebrityId);
      if (!celeb) return res.status(404).json({ message: "Celebrity not found" });

      // Generate a prefix based on name (e.g. Taylor Swift -> TAYLOR)
      const prefix = celeb.name.split(' ')[0].toUpperCase();
      
      const card = await storage.createFanCard({
        ...input,
        cardCode: prefix // storage will append random suffix
      });
      
      res.status(201).json(card);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.fanCards.login.path, async (req, res) => {
    try {
      const input = api.fanCards.login.input.parse(req.body);
      const card = await storage.getFanCardByCodeAndEmail(input.cardCode, input.email);
      
      if (!card) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, we'd sign a JWT here. 
      // For this MVP, we return a simple token (the card ID) and the user data.
      res.json({ token: `fan_token_${card.id}`, fanCard: card });
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.fanCards.get.path, async (req, res) => {
    const card = await storage.getFanCard(Number(req.params.id));
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  });

  // --- Bookings ---

  app.get(api.bookings.listByFan.path, async (req, res) => {
    const bookings = await storage.getBookingsByFanCard(Number(req.params.id));
    res.json(bookings);
  });

  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      // Check if event has slots
      const event = await storage.getEvent(input.eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
      
      if (event.bookedSlots !== null && event.bookedSlots >= event.totalSlots) {
        return res.status(400).json({ message: "Event fully booked" });
      }

      const booking = await storage.createBooking(input);
      // TODO: Increment booked slots in storage
      res.status(201).json(booking);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });
  
  // --- Manager Auth ---
  
  app.post(api.auth.login.path, async (req, res) => {
    // Simple mock auth for manager
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // --- Seed Data ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const celebs = await storage.getCelebrities();
  if (celebs.length === 0) {
    console.log("Seeding database...");
    
    const celeb1 = await storage.createCelebrity({
      name: "Taylor Swift",
      slug: "taylor-swift",
      bio: "Global superstar, singer-songwriter, and 14-time Grammy winner known for her narrative songwriting.",
      heroImage: "https://images.unsplash.com/photo-1540575467063-17e6fc485380?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1493229656367-108529a9792e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#be123c", // Rose red
      isFeatured: true
    });

    const celeb2 = await storage.createCelebrity({
      name: "The Weeknd",
      slug: "the-weeknd",
      bio: "Canadian singer, songwriter, and record producer. Known for his sonic versatility and dark lyricism.",
      heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      accentColor: "#000000",
      isFeatured: true
    });

    // Seed Events
    await storage.createEvent({
      celebrityId: celeb1.id,
      title: "Eras Tour - London",
      description: "The final leg of the European tour at Wembley Stadium.",
      date: new Date("2025-08-15"),
      price: "150.00",
      location: "Wembley Stadium, London",
      type: "concert",
      totalSlots: 90000
    });

    await storage.createEvent({
      celebrityId: celeb1.id,
      title: "VIP Meet & Greet",
      description: "Exclusive backstage access and photo opportunity.",
      date: new Date("2025-08-15"),
      price: "500.00",
      location: "Wembley Stadium, London",
      type: "meet_greet",
      totalSlots: 50
    });
    
    await storage.createEvent({
      celebrityId: celeb2.id,
      title: "After Hours - Tokyo",
      description: "Live performance at Tokyo Dome.",
      date: new Date("2025-09-20"),
      price: "120.00",
      location: "Tokyo Dome",
      type: "concert",
      totalSlots: 55000
    });

    // Seed a Fan Card
    await storage.createFanCard({
      celebrityId: celeb1.id,
      cardCode: "TAYLOR", // storage will append suffix -> TAYLOR-XXXX
      email: "demo@fan.com",
      tier: "Platinum",
      status: "active"
    });
    
    console.log("Database seeded successfully");
  }
}
