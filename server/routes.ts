
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { fanCardTiers } from "@shared/schema";

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
  const celebs = await storage.getCelebrities();
  if (celebs.length === 0) {
    console.log("Seeding database...");
    
    // Seed Fan Card Tiers first
    await db.insert(fanCardTiers).values([
      {
        name: "Gold",
        basePrice: "500.00",
        description: "Premium access with exclusive perks",
        features: JSON.stringify(["Priority event booking", "10% merchandise discount", "Monthly newsletter", "Digital collectibles"]),
        color: "#FFD700"
      },
      {
        name: "Platinum",
        basePrice: "2000.00",
        description: "Elite tier with VIP benefits",
        features: JSON.stringify(["All Gold benefits", "VIP event access", "Meet & greet opportunities", "20% merchandise discount", "Exclusive content", "Birthday gift"]),
        color: "#E5E4E2"
      },
      {
        name: "Black",
        basePrice: "5000.00",
        description: "Ultimate fan experience",
        features: JSON.stringify(["All Platinum benefits", "Backstage access", "Personal video messages", "30% merchandise discount", "Exclusive merchandise", "Concert priority seating", "Annual VIP event"]),
        color: "#1a1a1a"
      }
    ]);

    // === MUSICIANS ===
    const taylorSwift = await storage.createCelebrity({
      name: "Taylor Swift",
      slug: "taylor-swift",
      bio: "Global superstar, singer-songwriter, and 14-time Grammy winner known for her narrative songwriting.",
      fullBio: "Taylor Alison Swift is an American singer-songwriter who has transcended country music to become one of the biggest pop stars in the world. Known for her autobiographical songwriting and artistic reinventions, she has sold over 200 million records worldwide. Her Eras Tour became the highest-grossing tour of all time, and she's won 14 Grammy Awards including 4 Album of the Year awards.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1540575467063-17e6fc485380?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1493229656367-108529a9792e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#be123c",
      isFeatured: true,
      careerStart: 2006,
      accomplishments: JSON.stringify([
        "14 Grammy Awards including 4 Album of the Year",
        "Highest-grossing tour of all time (Eras Tour)",
        "Over 200 million records sold worldwide",
        "First artist to win Album of the Year Grammy 4 times",
        "Time Person of the Year 2023"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@taylorswift",
        twitter: "@taylorswift13",
        tiktok: "@taylorswift",
        youtube: "@TaylorSwift"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const theWeeknd = await storage.createCelebrity({
      name: "The Weeknd",
      slug: "the-weeknd",
      bio: "Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism.",
      fullBio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. Known for his falsetto vocals and genre-bending style that blends R&B, pop, and electronic music, he has won 4 Grammy Awards and holds multiple Billboard records. His album 'After Hours' spawned the hit 'Blinding Lights', which became the most-streamed song on Spotify.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      accentColor: "#000000",
      isFeatured: true,
      careerStart: 2010,
      accomplishments: JSON.stringify([
        "4 Grammy Awards and 20 Billboard Music Awards",
        "'Blinding Lights' most-streamed song on Spotify",
        "Over 75 million records sold worldwide",
        "First artist to surpass 100M monthly Spotify listeners",
        "Super Bowl LV Halftime Show performer"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@theweeknd",
        twitter: "@theweeknd",
        tiktok: "@theweeknd",
        youtube: "@TheWeeknd"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const arianaGrande = await storage.createCelebrity({
      name: "Ariana Grande",
      slug: "ariana-grande",
      bio: "Pop powerhouse with a four-octave vocal range and chart-topping hits.",
      fullBio: "Ariana Grande-Butera is an American singer, songwriter, and actress. Known for her wide vocal range and whistle register, she has received numerous accolades including 2 Grammy Awards. She rose to fame with hits like 'Thank U, Next' and 'Problem', and has become one of the best-selling music artists with over 90 million records sold worldwide.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400",
      accentColor: "#e7a4c5",
      isFeatured: true,
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "2 Grammy Awards and 27 Guinness World Records",
        "Over 90 million records sold worldwide",
        "First solo artist to hold top 3 spots on Billboard Hot 100",
        "Most-followed woman on Instagram (multiple years)",
        "Time's 100 Most Influential People"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@arianagrande",
        twitter: "@ArianaGrande",
        tiktok: "@arianagrande",
        youtube: "@ArianaGrande"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const justinBieber = await storage.createCelebrity({
      name: "Justin Bieber",
      slug: "justin-bieber",
      bio: "Canadian pop sensation discovered on YouTube, with multiple chart-topping albums.",
      fullBio: "Justin Drew Bieber is a Canadian singer who was discovered through YouTube in 2008. He has since become one of the best-selling music artists with over 150 million records sold worldwide. Known for hits like 'Baby', 'Sorry', and 'Peaches', he has won 2 Grammy Awards and holds 33 Guinness World Records.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1515041219749-89347f83291a?auto=format&fit=crop&q=80&w=400",
      accentColor: "#9333ea",
      isFeatured: false,
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "2 Grammy Awards and 33 Guinness World Records",
        "Over 150 million records sold worldwide",
        "First artist with 10 billion total video views on Vevo",
        "8 songs simultaneously on Billboard Hot 100",
        "Youngest solo male artist to debut at #1"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@justinbieber",
        twitter: "@justinbieber",
        tiktok: "@justinbieber",
        youtube: "@JustinBieber"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const billieEilish = await storage.createCelebrity({
      name: "Billie Eilish",
      slug: "billie-eilish",
      bio: "Gen Z icon with haunting vocals and genre-defying music.",
      fullBio: "Billie Eilish Pirate Baird O'Connell is an American singer-songwriter who gained attention with her debut single 'Ocean Eyes'. At 18, she became the youngest artist to win all four major Grammy categories in one year. Known for her distinctive style and whispery vocals, she's one of the biggest pop stars of her generation.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400",
      accentColor: "#22c55e",
      isFeatured: true,
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "9 Grammy Awards including all 4 major categories at age 18",
        "2 Oscar wins including Best Original Song",
        "First artist born in 2000s to have #1 album in US",
        "Youngest person to write and perform a Bond theme",
        "Over 100 million records sold worldwide"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@billieeilish",
        twitter: "@billieeilish",
        tiktok: "@billieeilish",
        youtube: "@BillieEilish"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const beyonce = await storage.createCelebrity({
      name: "Beyoncé",
      slug: "beyonce",
      bio: "Queen Bey, cultural icon, and one of the best-selling music artists of all time.",
      fullBio: "Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and businesswoman. With 32 Grammy Awards, she's the most-awarded artist in Grammy history. From Destiny's Child to her legendary solo career, she has sold over 200 million records worldwide and is considered one of the greatest entertainers of all time.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: true,
      careerStart: 1997,
      accomplishments: JSON.stringify([
        "32 Grammy Awards - most awarded artist in Grammy history",
        "Over 200 million records sold worldwide",
        "First Black woman to headline Coachella",
        "Renaissance World Tour grossed over $500 million",
        "Time's 100 Most Influential People (multiple times)"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@beyonce",
        twitter: "@Beyonce",
        tiktok: "@beyonce",
        youtube: "@Beyonce"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const duaLipa = await storage.createCelebrity({
      name: "Dua Lipa",
      slug: "dua-lipa",
      bio: "British-Albanian pop star with disco-influenced sound and empowering anthems.",
      fullBio: "Dua Lipa is an English and Albanian singer and songwriter. Her self-titled debut album spawned hits like 'New Rules' and 'IDGAF'. Her second album 'Future Nostalgia' won the Grammy for Best Pop Vocal Album and featured mega-hits like 'Don't Start Now' and 'Levitating'. She's one of the most-streamed female artists on Spotify.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1515041219749-89347f83291a?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false,
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "7 Grammy Awards including Best New Artist",
        "Over 80 million records sold worldwide",
        "'Levitating' longest-charting song by female artist on Hot 100",
        "Most-streamed female artist on Spotify (multiple years)",
        "3 Brit Awards including Album of the Year"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@dualipa",
        twitter: "@DUALIPA",
        tiktok: "@dualipa",
        youtube: "@DuaLipa"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const drake = await storage.createCelebrity({
      name: "Drake",
      slug: "drake",
      bio: "Canadian rapper and singer, one of the best-selling music artists globally.",
      fullBio: "Aubrey Drake Graham is a Canadian rapper, singer, and actor. He gained recognition as an actor on Degrassi before pursuing music. He holds several Billboard records including most charted songs and is one of the highest-certified digital singles artists. With over 170 million records sold, he's one of the best-selling artists of all time.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      accentColor: "#0ea5e9",
      isFeatured: false,
      careerStart: 2006,
      accomplishments: JSON.stringify([
        "5 Grammy Awards and 29 Billboard Music Awards",
        "Most charted songs (328) on Billboard Hot 100",
        "Over 170 million records sold worldwide",
        "First artist to surpass 50 billion streams on Spotify",
        "10 consecutive #1 albums on Billboard 200"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@champagnepapi",
        twitter: "@Drake",
        tiktok: "@drake",
        youtube: "@Drake"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const badBunny = await storage.createCelebrity({
      name: "Bad Bunny",
      slug: "bad-bunny",
      bio: "Puerto Rican Latin trap and reggaeton sensation dominating global charts.",
      fullBio: "Benito Antonio Martínez Ocasio, known as Bad Bunny, is a Puerto Rican rapper and singer. He's credited with helping bring Latin trap to mainstream music. Bad Bunny has been Spotify's most-streamed artist globally for three consecutive years (2020-2022) and his tours are among the highest-grossing of all time.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1515041219749-89347f83291a?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f97316",
      isFeatured: true,
      careerStart: 2016,
      accomplishments: JSON.stringify([
        "3 Grammy Awards including Best Música Urbana Album",
        "Spotify's most-streamed artist globally 3 years in a row",
        "First all-Spanish language album to top Billboard 200",
        "Most Wanted Tour second highest-grossing tour of all time",
        "Time's 100 Most Influential People"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@badbunnypr",
        twitter: "@sanbenito",
        tiktok: "@badbunny",
        youtube: "@BadBunny"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const shakira = await storage.createCelebrity({
      name: "Shakira",
      slug: "shakira",
      bio: "Colombian superstar known as the Queen of Latin Music with iconic hip-shaking moves.",
      fullBio: "Shakira Isabel Mebarak Ripoll is a Colombian singer and songwriter. Known for her versatility and distinctive voice, she has sold over 95 million records worldwide. Her crossover English album 'Laundry Service' and hits like 'Hips Don't Lie' and 'Waka Waka' made her an international sensation.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400",
      accentColor: "#eab308",
      isFeatured: false,
      careerStart: 1990,
      accomplishments: JSON.stringify([
        "3 Grammy Awards and 13 Latin Grammy Awards",
        "Over 95 million records sold worldwide",
        "'Waka Waka' best-selling World Cup song of all time",
        "First person to reach 100M followers on Facebook",
        "Hollywood Walk of Fame star"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@shakira",
        twitter: "@shakira",
        tiktok: "@shakira",
        youtube: "@Shakira"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const postMalone = await storage.createCelebrity({
      name: "Post Malone",
      slug: "post-malone",
      bio: "Genre-blending artist known for melodic rap and rock-influenced sound.",
      fullBio: "Austin Richard Post, known as Post Malone, is an American rapper, singer, and songwriter. He first gained recognition with 'White Iverson' in 2015. Known for blending hip-hop, pop, R&B, and rock, his albums have broken multiple streaming records. He's won 10 Billboard Music Awards and received 6 Grammy nominations.",
      category: "Musician",
      heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      accentColor: "#6366f1",
      isFeatured: false,
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "10 Billboard Music Awards and 6 Grammy nominations",
        "'Circles' 3x Platinum certification",
        "Over 80 million records sold worldwide",
        "First artist with 3 songs in top 10 of Billboard Hot 100 simultaneously",
        "Multiple diamond-certified singles"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@postmalone",
        twitter: "@PostMalone",
        tiktok: "@postmalone",
        youtube: "@PostMalone"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ])
    });

    // === ATHLETES ===
    const cristianoRonaldo = await storage.createCelebrity({
      name: "Cristiano Ronaldo",
      slug: "cristiano-ronaldo",
      bio: "Portuguese football legend, 5-time Ballon d'Or winner, and all-time top scorer.",
      fullBio: "Cristiano Ronaldo dos Santos Aveiro is a Portuguese professional footballer who plays as a forward. Widely regarded as one of the greatest players of all time, he has won 5 Ballon d'Or awards and is the all-time top scorer in football history. He's also the most-followed person on Instagram with over 600 million followers.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=400",
      accentColor: "#dc2626",
      isFeatured: true,
      careerStart: 2002,
      accomplishments: JSON.stringify([
        "5 Ballon d'Or awards",
        "All-time top scorer in football history (850+ goals)",
        "5 UEFA Champions League titles",
        "Led Portugal to Euro 2016 victory",
        "Most-followed person on Instagram"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@cristiano",
        twitter: "@Cristiano",
        tiktok: "@cristiano",
        youtube: "@Cristiano"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const lionelMessi = await storage.createCelebrity({
      name: "Lionel Messi",
      slug: "lionel-messi",
      bio: "Argentine football wizard, 8-time Ballon d'Or winner, and World Cup champion.",
      fullBio: "Lionel Andrés Messi is an Argentine professional footballer who plays as a forward for Inter Miami and captains Argentina. With 8 Ballon d'Or awards, he holds the record for most wins. In 2022, he led Argentina to World Cup victory, cementing his legacy as one of the greatest players of all time.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&q=80&w=400",
      accentColor: "#3b82f6",
      isFeatured: true,
      careerStart: 2004,
      accomplishments: JSON.stringify([
        "Record 8 Ballon d'Or awards",
        "2022 FIFA World Cup winner",
        "4 UEFA Champions League titles with Barcelona",
        "All-time top scorer for Argentina",
        "Most goals scored in European club football"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@leomessi",
        twitter: "@TeamMessi",
        tiktok: "@leomessi",
        youtube: "@leomessi"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const viratKohli = await storage.createCelebrity({
      name: "Virat Kohli",
      slug: "virat-kohli",
      bio: "Indian cricket superstar and former captain, known for his exceptional batting.",
      fullBio: "Virat Kohli is an Indian international cricketer and former captain of the Indian national team. Widely regarded as one of the greatest batsmen of all time, he has scored over 26,000 international runs. He's also one of the most followed athletes on social media globally.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1546185845-c37bbaf28cb9?auto=format&fit=crop&q=80&w=400",
      accentColor: "#0ea5e9",
      isFeatured: false,
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "76 international centuries across all formats",
        "Led India to 2023 ODI World Cup final",
        "Fastest player to 12,000 ODI runs",
        "ICC ODI Player of the Decade (2011-2020)",
        "Padma Shri and Rajiv Gandhi Khel Ratna awards"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@virat.kohli",
        twitter: "@imVkohli",
        tiktok: "@virat.kohli",
        youtube: "@ViratKohli"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const lebronJames = await storage.createCelebrity({
      name: "LeBron James",
      slug: "lebron-james",
      bio: "NBA legend and 4-time champion, considered one of the greatest basketball players ever.",
      fullBio: "LeBron Raymone James is an American professional basketball player for the Los Angeles Lakers. A four-time NBA champion and MVP, he's the all-time leading scorer in NBA history. Beyond basketball, he's a successful businessman, producer, and philanthropist.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1520262454473-a1a82276a574?auto=format&fit=crop&q=80&w=400",
      accentColor: "#7c2d12",
      isFeatured: false,
      careerStart: 2003,
      accomplishments: JSON.stringify([
        "4 NBA Championships and 4 MVP awards",
        "All-time leading scorer in NBA history",
        "20-time NBA All-Star",
        "2 Olympic gold medals",
        "TIME Athlete of the Year"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@kingjames",
        twitter: "@KingJames",
        tiktok: "@kingjames",
        youtube: "@KingJames"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const neymar = await storage.createCelebrity({
      name: "Neymar Jr",
      slug: "neymar-jr",
      bio: "Brazilian football star known for dazzling skills and flair on the pitch.",
      fullBio: "Neymar da Silva Santos Júnior is a Brazilian professional footballer who plays as a forward. Known for his dribbling, speed, and creativity, he's one of the most marketable athletes in the world. He was part of Barcelona's legendary MSN trio and is Brazil's all-time top scorer.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=400",
      accentColor: "#fbbf24",
      isFeatured: false,
      careerStart: 2009,
      accomplishments: JSON.stringify([
        "UEFA Champions League winner with Barcelona",
        "Brazil's all-time leading scorer",
        "2x South American Footballer of the Year",
        "Olympic gold medal (2016)",
        "World's most expensive transfer (€222 million)"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@neymarjr",
        twitter: "@neymarjr",
        tiktok: "@neymarjr",
        youtube: "@neymarjr"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const kylianMbappe = await storage.createCelebrity({
      name: "Kylian Mbappé",
      slug: "kylian-mbappe",
      bio: "French football prodigy and World Cup winner known for lightning speed.",
      fullBio: "Kylian Mbappé Lottin is a French professional footballer who plays as a forward for Real Madrid and France. A World Cup winner at 19, he's regarded as one of the best players in the world. Known for his explosive speed and clinical finishing, he's the face of modern football.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&q=80&w=400",
      accentColor: "#1e40af",
      isFeatured: true,
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "2018 FIFA World Cup winner",
        "Golden Boot winner 2022 World Cup",
        "Youngest French player to score at World Cup",
        "6x Ligue 1 top scorer",
        "Kopa Trophy winner (best under-21 player)"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@k.mbappe",
        twitter: "@KMbappe",
        tiktok: "@k.mbappe",
        youtube: "@KMbappe"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const simoneBiles = await storage.createCelebrity({
      name: "Simone Biles",
      slug: "simone-biles",
      bio: "Most decorated gymnast in history with record-breaking Olympic and World medals.",
      fullBio: "Simone Arianne Biles is an American artistic gymnast. With 37 Olympic and World Championship medals, she's the most decorated gymnast in history. Known for her gravity-defying skills and mental health advocacy, she's widely regarded as the greatest gymnast of all time.",
      category: "Athlete",
      heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false,
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "37 Olympic and World Championship medals",
        "7 Olympic medals including 4 golds",
        "Most World Championship medals in gymnastics history",
        "5 skills named after her",
        "TIME 100 Most Influential People"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@simonebiles",
        twitter: "@Simone_Biles",
        tiktok: "@simonebiles",
        youtube: "@SimoneBiles"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
      ])
    });

    // === ACTORS ===
    const zendaya = await storage.createCelebrity({
      name: "Zendaya",
      slug: "zendaya",
      bio: "Emmy-winning actress and fashion icon known for Euphoria and Spider-Man.",
      fullBio: "Zendaya Maree Stoermer Coleman is an American actress and singer. She rose to fame with Disney Channel's Shake It Up and became a critical darling with her Emmy-winning performance in HBO's Euphoria. She's also known for playing MJ in the Spider-Man franchise and her impeccable fashion sense.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#8b5cf6",
      isFeatured: true,
      careerStart: 2009,
      accomplishments: JSON.stringify([
        "2 Primetime Emmy Awards for Euphoria",
        "Youngest actress to win Emmy for Lead Actress in Drama",
        "Star of Spider-Man franchise",
        "TIME 100 Most Influential People",
        "Fashion icon and CFDA Fashion Icon Award"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@zendaya",
        twitter: "@Zendaya",
        tiktok: "@zendaya",
        youtube: "@Zendaya"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1512310604669-443f26c35f52?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const timotheeChalamet = await storage.createCelebrity({
      name: "Timothée Chalamet",
      slug: "timothee-chalamet",
      bio: "Oscar-nominated actor and heartthrob known for Dune and Call Me By Your Name.",
      fullBio: "Timothée Hal Chalamet is an American and French actor. He gained recognition with his Oscar-nominated performance in Call Me By Your Name and became a leading man with roles in Little Women, Dune, and Wonka. He's regarded as one of the best actors of his generation.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#14b8a6",
      isFeatured: false,
      careerStart: 2007,
      accomplishments: JSON.stringify([
        "Academy Award nomination at age 22",
        "Youngest Best Actor nominee in 80 years",
        "Lead in Dune franchise",
        "3 BAFTA nominations",
        "TIME 100 Next list"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@tchalamet",
        twitter: "@RealChalamet",
        tiktok: "@tchalamet",
        youtube: "@TimotheeChalamet"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const willSmith = await storage.createCelebrity({
      name: "Will Smith",
      slug: "will-smith",
      bio: "Hollywood superstar, rapper, and producer with decades of blockbuster hits.",
      fullBio: "Willard Carroll Smith II is an American actor, rapper, and producer. From The Fresh Prince of Bel-Air to Men in Black, Independence Day, and his Oscar-winning performance in King Richard, he's one of Hollywood's most bankable stars. He has four Grammy Awards and has been nominated for five Golden Globe Awards.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#059669",
      isFeatured: false,
      careerStart: 1985,
      accomplishments: JSON.stringify([
        "Academy Award for Best Actor (King Richard)",
        "4 Grammy Awards",
        "$9.3 billion worldwide box office",
        "Two-time Academy Award nominee",
        "Star on Hollywood Walk of Fame"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@willsmith",
        twitter: "@willsmith",
        tiktok: "@willsmith",
        youtube: "@WillSmith"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const rihanna = await storage.createCelebrity({
      name: "Rihanna",
      slug: "rihanna",
      bio: "Music icon, fashion mogul, and billionaire entrepreneur.",
      fullBio: "Robyn Rihanna Fenty is a Barbadian singer, actress, and businesswoman. With 14 number-one singles, she's one of the best-selling music artists. Her Fenty Beauty brand revolutionized the beauty industry. In 2023, she headlined the Super Bowl Halftime Show and is officially a billionaire.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ef4444",
      isFeatured: false,
      careerStart: 2003,
      accomplishments: JSON.stringify([
        "9 Grammy Awards and 13 American Music Awards",
        "Over 250 million records sold worldwide",
        "Fenty Beauty billionaire entrepreneur",
        "First Black woman to head luxury fashion house (Fenty)",
        "Super Bowl LVII Halftime Show performer"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@badgalriri",
        twitter: "@rihanna",
        tiktok: "@rihanna",
        youtube: "@Rihanna"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const jenniferLopez = await storage.createCelebrity({
      name: "Jennifer Lopez",
      slug: "jennifer-lopez",
      bio: "Multi-hyphenate superstar: singer, actress, dancer, and business mogul.",
      fullBio: "Jennifer Lynn Affleck, known as Jennifer Lopez or J.Lo, is an American singer, actress, and dancer. She's the first Hispanic actress to earn over $1 million for a film and has sold over 80 million records. A true triple threat, she's one of the most influential Latin entertainers.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f97316",
      isFeatured: false,
      careerStart: 1991,
      accomplishments: JSON.stringify([
        "Over 80 million records sold worldwide",
        "First Hispanic actress to earn $1M for a film",
        "Star on Hollywood Walk of Fame",
        "Super Bowl LIV Halftime Show co-headliner",
        "Michael Jackson Video Vanguard Award"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@jlo",
        twitter: "@JLo",
        tiktok: "@jlo",
        youtube: "@JLo"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const dwayneJohnson = await storage.createCelebrity({
      name: "Dwayne Johnson",
      slug: "dwayne-johnson",
      bio: "The Rock - former WWE champion turned highest-paid Hollywood action star.",
      fullBio: "Dwayne Douglas Johnson, also known as The Rock, is an American actor, producer, and former professional wrestler. He's been named the world's highest-paid actor multiple times and his films have grossed over $10.5 billion worldwide. He's also a successful businessman and philanthropist.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#78350f",
      isFeatured: false,
      careerStart: 1996,
      accomplishments: JSON.stringify([
        "World's highest-paid actor (multiple years)",
        "$10.5 billion worldwide box office",
        "8-time WWE Champion",
        "TIME 100 Most Influential People",
        "Most-followed American man on Instagram"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@therock",
        twitter: "@TheRock",
        tiktok: "@therock",
        youtube: "@TheRock"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const selenaGomez = await storage.createCelebrity({
      name: "Selena Gomez",
      slug: "selena-gomez",
      bio: "Singer, actress, producer, and beauty mogul with massive social media influence.",
      fullBio: "Selena Marie Gomez is an American singer, actress, producer, and businesswoman. From Disney Channel to chart-topping music and her Emmy-nominated role in Only Murders in the Building, she's a multi-faceted star. Her Rare Beauty brand and mental health advocacy have made her an influential voice.",
      category: "Actor",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#db2777",
      isFeatured: true,
      careerStart: 2002,
      accomplishments: JSON.stringify([
        "Over 210 million Instagram followers",
        "Emmy nomination for Only Murders in the Building",
        "Rare Beauty billionaire entrepreneur",
        "Over 210 million records sold worldwide",
        "Billboard's Woman of the Year"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@selenagomez",
        twitter: "@selenagomez",
        tiktok: "@selenagomez",
        youtube: "@SelenaGomez"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
      ])
    });

    // === CREATORS ===
    const mrBeast = await storage.createCelebrity({
      name: "MrBeast",
      slug: "mrbeast",
      bio: "YouTube's biggest philanthropist known for viral challenges and giveaways.",
      fullBio: "James Stephen 'Jimmy' Donaldson, better known as MrBeast, is an American YouTuber and philanthropist. Known for his expensive stunts and philanthropy, he has over 250 million subscribers across his channels. He's pioneered a new genre of YouTube content and launched multiple successful businesses.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      accentColor: "#06b6d4",
      isFeatured: true,
      careerStart: 2012,
      accomplishments: JSON.stringify([
        "Over 250 million subscribers across channels",
        "Most-subscribed individual YouTuber",
        "Donated over $100 million to charity",
        "MrBeast Burger and Feastables businesses",
        "TIME's 100 Most Influential People"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@mrbeast",
        twitter: "@MrBeast",
        tiktok: "@mrbeast",
        youtube: "@MrBeast"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const charliDAmelio = await storage.createCelebrity({
      name: "Charli D'Amelio",
      slug: "charli-damelio",
      bio: "TikTok's first megastar and most-followed creator on the platform.",
      fullBio: "Charli Grace D'Amelio is an American social media personality and dancer. She was the first person to earn 100 million followers on TikTok and is the most-followed creator on the platform. She's expanded into music, business ventures, and her family's Hulu reality series.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#a855f7",
      isFeatured: false,
      careerStart: 2019,
      accomplishments: JSON.stringify([
        "Most-followed person on TikTok (150M+ followers)",
        "First person to reach 100M followers on TikTok",
        "Star of Hulu's 'The D'Amelio Show'",
        "Social Star Award at People's Choice Awards",
        "TIME's 25 Most Influential People on Internet"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@charlidamelio",
        twitter: "@charlidamelio",
        tiktok: "@charlidamelio",
        youtube: "@CharliDAmelio"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const khabyLame = await storage.createCelebrity({
      name: "Khaby Lame",
      slug: "khaby-lame",
      bio: "TikTok's most-followed creator known for silent, sarcastic comedy videos.",
      fullBio: "Khabane 'Khaby' Lame is a Senegalese-Italian social media personality. He became famous for his silent, deadpan comedy videos where he sarcastically mocks overcomplicated life hack videos. Without saying a word, he became the most-followed person on TikTok with over 160 million followers.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      accentColor: "#eab308",
      isFeatured: false,
      careerStart: 2020,
      accomplishments: JSON.stringify([
        "Most-followed person on TikTok (160M+ followers)",
        "Rose to fame during COVID-19 pandemic",
        "Brand deals with Hugo Boss, Binance, and more",
        "Featured in Forbes 30 Under 30",
        "First African to reach #1 on TikTok"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@khaby.lame",
        twitter: "@KhabyLame",
        tiktok: "@khaby.lame",
        youtube: "@KhabyLame"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const addisonRae = await storage.createCelebrity({
      name: "Addison Rae",
      slug: "addison-rae",
      bio: "TikTok star turned actress, singer, and beauty entrepreneur.",
      fullBio: "Addison Rae Easterling is an American social media personality, actress, and singer. She gained fame on TikTok and has successfully transitioned to acting, music, and business. She launched her beauty line Item Beauty and starred in Netflix's 'He's All That'. She's one of the highest-earning TikTok stars.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f472b6",
      isFeatured: false,
      careerStart: 2019,
      accomplishments: JSON.stringify([
        "Over 88 million TikTok followers",
        "Forbes highest-earning TikTok star (2020)",
        "Item Beauty founder and CCO",
        "Netflix film debut in 'He's All That'",
        "TIME's 30 Most Influential People on Internet"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@addisonraee",
        twitter: "@whoisaddison",
        tiktok: "@addisonre",
        youtube: "@AddisonRae"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const kimKardashian = await storage.createCelebrity({
      name: "Kim Kardashian",
      slug: "kim-kardashian",
      bio: "Reality TV mogul, beauty entrepreneur, and billionaire businesswoman.",
      fullBio: "Kimberly Noel Kardashian is an American media personality, socialite, and businesswoman. She gained fame through 'Keeping Up with the Kardashians' and built a business empire with KKW Beauty and SKIMS. With over 350 million Instagram followers, she's one of the most influential people in fashion and beauty.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#18181b",
      isFeatured: true,
      careerStart: 2007,
      accomplishments: JSON.stringify([
        "Billionaire entrepreneur (SKIMS valuation $4B)",
        "Over 350 million Instagram followers",
        "TIME's 100 Most Influential People",
        "Passed California First-Year Law Students' Examination",
        "Criminal justice reform advocate"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@kimkardashian",
        twitter: "@KimKardashian",
        tiktok: "@kimkardashian",
        youtube: "@KimKardashian"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
      ])
    });

    const emmaChamberlain = await storage.createCelebrity({
      name: "Emma Chamberlain",
      slug: "emma-chamberlain",
      bio: "Gen Z YouTube icon known for relatable vlogs and coffee empire.",
      fullBio: "Emma Frances Chamberlain is an American YouTuber, podcaster, and businesswoman. She pioneered a new style of vlogging characterized by fast-paced editing and relatability. She launched her coffee company Chamberlain Coffee and has become a fashion icon, attending Met Galas and Paris Fashion Weeks.",
      category: "Creator",
      heroImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#16a34a",
      isFeatured: false,
      careerStart: 2017,
      accomplishments: JSON.stringify([
        "TIME's 25 Most Influential People on Internet",
        "Chamberlain Coffee founder and CEO",
        "2x Shorty Award for YouTuber of the Year",
        "Met Gala attendee and fashion icon",
        "Podcaster with 'Anything Goes'"
      ]),
      socialMedia: JSON.stringify({
        instagram: "@emmachamberlain",
        twitter: "@emmachamberlain",
        tiktok: "@emmachamberlain",
        youtube: "@emmachamberlain"
      }),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
      ])
    });

    // === SEED EVENTS ===
    // Musicians - Concerts
    await storage.createEvent({
      celebrityId: taylorSwift.id,
      title: "Eras Tour - London",
      description: "The final leg of the European tour at Wembley Stadium featuring hits from all eras.",
      date: new Date("2025-08-15"),
      price: "250.00",
      location: "Wembley Stadium, London",
      type: "concert",
      totalSlots: 90000
    });

    await storage.createEvent({
      celebrityId: taylorSwift.id,
      title: "VIP Meet & Greet Experience",
      description: "Exclusive backstage access with photo opportunity and signed merchandise.",
      date: new Date("2025-08-15"),
      price: "1500.00",
      location: "Wembley Stadium, London",
      type: "meet_greet",
      totalSlots: 50
    });

    await storage.createEvent({
      celebrityId: theWeeknd.id,
      title: "After Hours til Dawn - Tokyo",
      description: "Spectacular live performance at Tokyo Dome with special effects and visuals.",
      date: new Date("2025-09-20"),
      price: "180.00",
      location: "Tokyo Dome, Tokyo",
      type: "concert",
      totalSlots: 55000
    });

    await storage.createEvent({
      celebrityId: theWeeknd.id,
      title: "Exclusive Meet & Greet",
      description: "Intimate meet and greet session with The Weeknd.",
      date: new Date("2025-09-20"),
      price: "800.00",
      location: "Tokyo Dome, Tokyo",
      type: "meet_greet",
      totalSlots: 30
    });

    await storage.createEvent({
      celebrityId: arianaGrande.id,
      title: "Sweetener World Tour - LA",
      description: "Live performance at SoFi Stadium featuring new and classic hits.",
      date: new Date("2025-10-05"),
      price: "220.00",
      location: "SoFi Stadium, Los Angeles",
      type: "concert",
      totalSlots: 70000
    });

    await storage.createEvent({
      celebrityId: arianaGrande.id,
      title: "VIP Fan Experience",
      description: "Meet Ariana, photo opportunity, and exclusive merchandise package.",
      date: new Date("2025-10-05"),
      price: "1200.00",
      location: "SoFi Stadium, Los Angeles",
      type: "meet_greet",
      totalSlots: 40
    });

    await storage.createEvent({
      celebrityId: justinBieber.id,
      title: "Justice World Tour - Toronto",
      description: "Homecoming concert featuring hits from the Justice album and more.",
      date: new Date("2025-07-12"),
      price: "200.00",
      location: "Rogers Centre, Toronto",
      type: "concert",
      totalSlots: 50000
    });

    await storage.createEvent({
      celebrityId: billieEilish.id,
      title: "Happier Than Ever Tour - NYC",
      description: "Intimate performance at Madison Square Garden.",
      date: new Date("2025-11-18"),
      price: "190.00",
      location: "Madison Square Garden, New York",
      type: "concert",
      totalSlots: 20000
    });

    await storage.createEvent({
      celebrityId: billieEilish.id,
      title: "Meet Billie - Fan Convention",
      description: "Special fan convention with Q&A, meet and greet, and exclusive merch.",
      date: new Date("2025-11-19"),
      price: "950.00",
      location: "Javits Center, New York",
      type: "meet_greet",
      totalSlots: 100
    });

    await storage.createEvent({
      celebrityId: beyonce.id,
      title: "Renaissance World Tour - Atlanta",
      description: "Spectacular performance celebrating the Renaissance album at Mercedes-Benz Stadium.",
      date: new Date("2025-06-28"),
      price: "300.00",
      location: "Mercedes-Benz Stadium, Atlanta",
      type: "concert",
      totalSlots: 75000
    });

    await storage.createEvent({
      celebrityId: duaLipa.id,
      title: "Future Nostalgia Live - Miami",
      description: "High-energy disco-pop concert at FTX Arena.",
      date: new Date("2025-12-03"),
      price: "170.00",
      location: "Kaseya Center, Miami",
      type: "concert",
      totalSlots: 20000
    });

    await storage.createEvent({
      celebrityId: drake.id,
      title: "Aubrey & The Three Migos - Vegas",
      description: "Special Las Vegas residency performance.",
      date: new Date("2026-01-15"),
      price: "280.00",
      location: "T-Mobile Arena, Las Vegas",
      type: "concert",
      totalSlots: 20000
    });

    await storage.createEvent({
      celebrityId: badBunny.id,
      title: "World's Hottest Tour - San Juan",
      description: "Homecoming concert in Puerto Rico with special guests.",
      date: new Date("2025-08-30"),
      price: "210.00",
      location: "Coliseo de Puerto Rico, San Juan",
      type: "concert",
      totalSlots: 18000
    });

    await storage.createEvent({
      celebrityId: badBunny.id,
      title: "VIP Backstage Experience",
      description: "Exclusive backstage tour and meet and greet with Bad Bunny.",
      date: new Date("2025-08-30"),
      price: "1100.00",
      location: "Coliseo de Puerto Rico, San Juan",
      type: "meet_greet",
      totalSlots: 25
    });

    await storage.createEvent({
      celebrityId: shakira.id,
      title: "Las Mujeres Ya No Lloran Tour - Barcelona",
      description: "Spectacular performance celebrating Latin music and empowerment.",
      date: new Date("2025-09-14"),
      price: "195.00",
      location: "Estadi Olímpic, Barcelona",
      type: "concert",
      totalSlots: 55000
    });

    await storage.createEvent({
      celebrityId: postMalone.id,
      title: "Hollywood's Bleeding Live - Chicago",
      description: "Genre-bending performance at United Center.",
      date: new Date("2025-10-22"),
      price: "175.00",
      location: "United Center, Chicago",
      type: "concert",
      totalSlots: 23000
    });

    // Athletes - Meet & Greets and Signings
    await storage.createEvent({
      celebrityId: cristianoRonaldo.id,
      title: "CR7 Meet & Greet - Dubai",
      description: "Exclusive meet and greet with Cristiano Ronaldo, photo opportunity, and autograph session.",
      date: new Date("2025-06-10"),
      price: "850.00",
      location: "Burj Khalifa, Dubai",
      type: "meet_greet",
      totalSlots: 200
    });

    await storage.createEvent({
      celebrityId: cristianoRonaldo.id,
      title: "Football Masterclass with CR7",
      description: "Learn from the legend in an exclusive training session.",
      date: new Date("2025-06-11"),
      price: "1200.00",
      location: "Al Nassr Stadium, Riyadh",
      type: "meet_greet",
      totalSlots: 50
    });

    await storage.createEvent({
      celebrityId: lionelMessi.id,
      title: "Messi Fan Experience - Miami",
      description: "Meet Lionel Messi, get autographs, and exclusive Inter Miami merchandise.",
      date: new Date("2025-07-20"),
      price: "900.00",
      location: "Chase Stadium, Miami",
      type: "meet_greet",
      totalSlots: 150
    });

    await storage.createEvent({
      celebrityId: lionelMessi.id,
      title: "Soccer Clinic with Messi",
      description: "Training session and Q&A with the World Cup champion.",
      date: new Date("2025-07-21"),
      price: "1300.00",
      location: "Chase Stadium, Miami",
      type: "meet_greet",
      totalSlots: 40
    });

    await storage.createEvent({
      celebrityId: viratKohli.id,
      title: "Virat Kohli Fan Meet - Mumbai",
      description: "Exclusive meet and greet with cricket superstar Virat Kohli.",
      date: new Date("2025-11-05"),
      price: "450.00",
      location: "Wankhede Stadium, Mumbai",
      type: "meet_greet",
      totalSlots: 300
    });

    await storage.createEvent({
      celebrityId: lebronJames.id,
      title: "King James Basketball Camp",
      description: "Basketball training camp hosted by LeBron James with meet and greet.",
      date: new Date("2025-08-08"),
      price: "750.00",
      location: "UCLA, Los Angeles",
      type: "meet_greet",
      totalSlots: 100
    });

    await storage.createEvent({
      celebrityId: lebronJames.id,
      title: "LeBron Fan Experience",
      description: "Meet LeBron, photo op, and signed merchandise.",
      date: new Date("2025-12-25"),
      price: "980.00",
      location: "Crypto.com Arena, Los Angeles",
      type: "meet_greet",
      totalSlots: 80
    });

    await storage.createEvent({
      celebrityId: neymar.id,
      title: "Neymar Jr Skills Workshop - Riyadh",
      description: "Learn football skills from Neymar in an exclusive workshop.",
      date: new Date("2025-09-08"),
      price: "650.00",
      location: "Al-Hilal Stadium, Riyadh",
      type: "meet_greet",
      totalSlots: 120
    });

    await storage.createEvent({
      celebrityId: kylianMbappe.id,
      title: "Mbappé Fan Day - Paris",
      description: "Meet Kylian Mbappé, photo session, and autograph signing.",
      date: new Date("2025-10-10"),
      price: "720.00",
      location: "Parc des Princes, Paris",
      type: "meet_greet",
      totalSlots: 180
    });

    await storage.createEvent({
      celebrityId: simoneBiles.id,
      title: "Gymnastics Masterclass with Simone",
      description: "Learn from the GOAT in an exclusive gymnastics clinic.",
      date: new Date("2025-07-04"),
      price: "550.00",
      location: "World Champions Centre, Houston",
      type: "meet_greet",
      totalSlots: 60
    });

    // Actors - Meet & Greets and Fan Conventions
    await storage.createEvent({
      celebrityId: zendaya.id,
      title: "Zendaya Fan Convention",
      description: "Exclusive fan convention with Q&A, photo ops, and meet and greet.",
      date: new Date("2025-11-12"),
      price: "680.00",
      location: "Los Angeles Convention Center",
      type: "meet_greet",
      totalSlots: 250
    });

    await storage.createEvent({
      celebrityId: zendaya.id,
      title: "Fashion & Film with Zendaya",
      description: "Intimate discussion on fashion, film, and career with Zendaya.",
      date: new Date("2025-11-13"),
      price: "890.00",
      location: "Academy Museum, Los Angeles",
      type: "meet_greet",
      totalSlots: 100
    });

    await storage.createEvent({
      celebrityId: timotheeChalamet.id,
      title: "Timothée Chalamet Q&A Evening",
      description: "Intimate evening with Timothée discussing his films and career.",
      date: new Date("2025-12-15"),
      price: "590.00",
      location: "Tribeca Film Center, New York",
      type: "meet_greet",
      totalSlots: 150
    });

    await storage.createEvent({
      celebrityId: willSmith.id,
      title: "An Evening with Will Smith",
      description: "Inspirational talk, Q&A, and meet and greet with Will Smith.",
      date: new Date("2026-01-20"),
      price: "750.00",
      location: "Dolby Theatre, Los Angeles",
      type: "meet_greet",
      totalSlots: 200
    });

    await storage.createEvent({
      celebrityId: rihanna.id,
      title: "Fenty Beauty Masterclass",
      description: "Exclusive beauty masterclass and meet and greet with Rihanna.",
      date: new Date("2025-09-25"),
      price: "920.00",
      location: "Sephora Flagship, New York",
      type: "meet_greet",
      totalSlots: 80
    });

    await storage.createEvent({
      celebrityId: jenniferLopez.id,
      title: "JLo Dance Workshop",
      description: "Learn choreography and meet Jennifer Lopez in this exclusive workshop.",
      date: new Date("2025-10-18"),
      price: "780.00",
      location: "Alvin Ailey Studios, New York",
      type: "meet_greet",
      totalSlots: 100
    });

    await storage.createEvent({
      celebrityId: dwayneJohnson.id,
      title: "Meet The Rock - Fan Experience",
      description: "Meet Dwayne Johnson, photo op, and motivational talk.",
      date: new Date("2026-02-14"),
      price: "850.00",
      location: "Warner Bros Studio, Los Angeles",
      type: "meet_greet",
      totalSlots: 150
    });

    await storage.createEvent({
      celebrityId: selenaGomez.id,
      title: "Rare Beauty & Music Experience",
      description: "Exclusive event with Selena Gomez featuring beauty and music.",
      date: new Date("2025-08-22"),
      price: "820.00",
      location: "The Grove, Los Angeles",
      type: "meet_greet",
      totalSlots: 120
    });

    // Creators - Fan Conventions and Meet Ups
    await storage.createEvent({
      celebrityId: mrBeast.id,
      title: "MrBeast Fan Convention",
      description: "Epic fan convention with challenges, giveaways, and meet MrBeast.",
      date: new Date("2025-07-25"),
      price: "380.00",
      location: "Raleigh Convention Center, North Carolina",
      type: "meet_greet",
      totalSlots: 500
    });

    await storage.createEvent({
      celebrityId: mrBeast.id,
      title: "MrBeast Burger Fest",
      description: "Food festival with exclusive meet and greet and challenges.",
      date: new Date("2025-07-26"),
      price: "280.00",
      location: "Raleigh Convention Center, North Carolina",
      type: "meet_greet",
      totalSlots: 1000
    });

    await storage.createEvent({
      celebrityId: charliDAmelio.id,
      title: "Charli D'Amelio Dance Workshop",
      description: "Learn viral dances and meet Charli in this exclusive workshop.",
      date: new Date("2025-09-05"),
      price: "320.00",
      location: "Broadway Dance Center, New York",
      type: "meet_greet",
      totalSlots: 200
    });

    await storage.createEvent({
      celebrityId: khabyLame.id,
      title: "Khaby Lame Fan Meetup",
      description: "Meet Khaby Lame, photo ops, and comedy session.",
      date: new Date("2025-10-30"),
      price: "290.00",
      location: "Comic Con, Milan",
      type: "meet_greet",
      totalSlots: 300
    });

    await storage.createEvent({
      celebrityId: addisonRae.id,
      title: "Addison Rae Creator Summit",
      description: "Exclusive creator summit with Addison Rae covering content creation and beauty.",
      date: new Date("2025-11-08"),
      price: "350.00",
      location: "Hype House, Los Angeles",
      type: "meet_greet",
      totalSlots: 150
    });

    await storage.createEvent({
      celebrityId: kimKardashian.id,
      title: "SKIMS Pop-Up Experience",
      description: "Exclusive SKIMS pop-up with Kim Kardashian meet and greet.",
      date: new Date("2026-01-30"),
      price: "980.00",
      location: "Rodeo Drive, Beverly Hills",
      type: "meet_greet",
      totalSlots: 100
    });

    await storage.createEvent({
      celebrityId: kimKardashian.id,
      title: "Kim K Business Masterclass",
      description: "Learn entrepreneurship from Kim Kardashian in exclusive masterclass.",
      date: new Date("2026-01-31"),
      price: "1450.00",
      location: "UCLA, Los Angeles",
      type: "meet_greet",
      totalSlots: 50
    });

    await storage.createEvent({
      celebrityId: emmaChamberlain.id,
      title: "Chamberlain Coffee Experience",
      description: "Coffee tasting, meet Emma, and exclusive merchandise.",
      date: new Date("2025-12-10"),
      price: "310.00",
      location: "Chamberlain Coffee HQ, Los Angeles",
      type: "meet_greet",
      totalSlots: 100
    });

    // Seed a demo Fan Card
    await storage.createFanCard({
      celebrityId: taylorSwift.id,
      cardCode: "TAYLOR",
      email: "demo@fan.com",
      tier: "Platinum",
      status: "active"
    });
    
    console.log("Database seeded successfully");
  }
}
