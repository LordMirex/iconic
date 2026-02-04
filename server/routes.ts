
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
      await storage.incrementEventBookedSlots(input.eventId);
      res.status(201).json(booking);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });
  
  // --- Manager Auth ---

  app.post("/api/manager/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === "admin" && password === "admin") {
        res.json({
          success: true,
          token: "manager_token_admin",
          user: { id: 1, username: "admin", isAdmin: true }
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (e) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // --- Seed Data ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const { seedCelebrities, generateEventsForCelebrity } = await import("./seed-data");
  
  const celebs = await storage.getCelebrities();
  if (celebs.length === 0) {
    console.log("Seeding database with 30 celebrities...");
    
    const celebsData = await seedCelebrities();
    
    // Create all celebrities
    for (const celebData of celebsData) {
      const celeb = await storage.createCelebrity(celebData);
      
      // Generate events for each celebrity
      const events = generateEventsForCelebrity(celeb.id, celebData.category, celebData.name);
      for (const eventData of events) {
        await storage.createEvent(eventData);
      }
    }

    // Seed a demo fan card
    const taylorSwift = celebsData.find(c => c.slug === 'taylor-swift');
    if (taylorSwift) {
      const celeb = await storage.getCelebrityBySlug('taylor-swift');
      if (celeb) {
        await storage.createFanCard({
          celebrityId: celeb.id,
          cardCode: "TAYLOR",
          email: "demo@fan.com",
          fanName: "Demo Fan",
          tier: "Platinum",
          cardType: "digital",
          price: "2000.00"
        });
      }
    }
    
    console.log("Database seeded successfully with 30 celebrities and events!");
  }
}
