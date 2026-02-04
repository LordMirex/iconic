import { storage } from "./storage";

// Tier pricing configuration
export const TIER_PRICING = {
  Gold: "500.00",
  Platinum: "2000.00",
  Black: "5000.00"
};

// Helper function to generate social media JSON
function createSocialMedia(instagram: number, twitter: number, youtube?: number, tiktok?: number) {
  return JSON.stringify({
    instagram: { username: "", followers: instagram },
    twitter: { username: "", followers: twitter },
    ...(youtube && { youtube: { username: "", subscribers: youtube } }),
    ...(tiktok && { tiktok: { username: "", followers: tiktok } })
  });
}

export async function seedCelebrities() {
  const celebsData = [
    // MUSICIANS
    {
      name: "Taylor Swift",
      slug: "taylor-swift",
      category: "musician",
      bio: "Global superstar, singer-songwriter, and 14-time Grammy winner known for her narrative songwriting.",
      fullBio: "Taylor Alison Swift is an American singer-songwriter who has achieved unprecedented success in contemporary music. Known for her autobiographical songwriting and artistic reinventions, she has received numerous accolades including 14 Grammy Awards, making her one of the most awarded artists in history.",
      careerStart: 2006,
      accomplishments: JSON.stringify([
        "14 Grammy Awards including Album of the Year (4 times)",
        "Eras Tour became highest-grossing tour of all time",
        "First artist to win Album of the Year 4 times",
        "Over 200 million records sold worldwide",
        "Time Person of the Year 2023"
      ]),
      socialMedia: createSocialMedia(280000000, 95000000, 60000000, 180000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1540575467063-17e6fc485380?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1493229656367-108529a9792e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#be123c",
      isFeatured: true
    },
    {
      name: "The Weeknd",
      slug: "the-weeknd",
      category: "musician",
      bio: "Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism.",
      fullBio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter who has revolutionized contemporary R&B with his unique sound and visual aesthetic.",
      careerStart: 2010,
      accomplishments: JSON.stringify([
        "4 Grammy Awards",
        "Most streamed artist on Spotify (2023)",
        "Super Bowl LV Halftime Show performer",
        "After Hours album broke multiple streaming records",
        "Diamond certification for multiple singles"
      ]),
      socialMedia: createSocialMedia(55000000, 18000000, 20000000, 30000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      accentColor: "#000000",
      isFeatured: true
    },
    {
      name: "Ariana Grande",
      slug: "ariana-grande",
      category: "musician",
      bio: "Pop icon and vocal powerhouse with multiple chart-topping albums and international success.",
      fullBio: "Ariana Grande-Butera is an American singer, songwriter, and actress. Known for her four-octave vocal range and whistle register, she has become one of the most influential pop artists of her generation.",
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "2 Grammy Awards",
        "First artist to have lead singles from 5 albums debut at #1",
        "Most streamed female artist on Spotify",
        "Over 90 billion streams across platforms",
        "Sold out multiple world tours"
      ]),
      socialMedia: createSocialMedia(380000000, 85000000, 52000000, 45000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1549351236-caca0f174515?auto=format&fit=crop&q=80&w=400",
      accentColor: "#a855f7",
      isFeatured: true
    },
    {
      name: "Bad Bunny",
      slug: "bad-bunny",
      category: "musician",
      bio: "Puerto Rican rapper and Latin trap pioneer, most-streamed artist globally.",
      fullBio: "Benito Antonio Martínez Ocasio, known as Bad Bunny, is a Puerto Rican rapper and singer who has become the face of Latin music worldwide.",
      careerStart: 2016,
      accomplishments: JSON.stringify([
        "Most-streamed artist on Spotify globally (2020, 2021, 2022)",
        "3 Grammy Awards",
        "First all-Spanish album to reach #1 on Billboard 200",
        "Record-breaking World's Hottest Tour",
        "Over 60 billion streams"
      ]),
      socialMedia: createSocialMedia(47000000, 10000000, 15000000, 40000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ef4444",
      isFeatured: false
    },
    {
      name: "Drake",
      slug: "drake",
      category: "musician",
      bio: "Canadian rapper, singer, and entrepreneur, one of the best-selling music artists.",
      fullBio: "Aubrey Drake Graham is a Canadian rapper and singer who has dominated hip-hop and pop music for over a decade.",
      careerStart: 2006,
      accomplishments: JSON.stringify([
        "5 Grammy Awards",
        "Most charted songs of all time on Billboard Hot 100",
        "Over 170 million records sold",
        "Founder of OVO Sound record label",
        "Highest-certified digital singles artist in the US"
      ]),
      socialMedia: createSocialMedia(145000000, 42000000, 8000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: false
    },
    {
      name: "Billie Eilish",
      slug: "billie-eilish",
      category: "musician",
      bio: "Gen-Z pop sensation and multiple Grammy winner known for her unique sound and aesthetic.",
      fullBio: "Billie Eilish Pirate Baird O'Connell is an American singer-songwriter who rose to prominence with her ethereal sound and introspective lyrics.",
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "9 Grammy Awards including Album of the Year at age 18",
        "Youngest person to win all four major Grammy categories",
        "Oscar winner for Best Original Song",
        "Over 100 billion streams",
        "Multiple sold-out world tours"
      ]),
      socialMedia: createSocialMedia(120000000, 7000000, 48000000, 60000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      accentColor: "#10b981",
      isFeatured: false
    },
    {
      name: "Beyoncé",
      slug: "beyonce",
      category: "musician",
      bio: "Queen of pop, cultural icon, and most-awarded artist in Grammy history.",
      fullBio: "Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and businesswoman who has become one of the most influential entertainers of all time.",
      careerStart: 1997,
      accomplishments: JSON.stringify([
        "32 Grammy Awards - most wins in history",
        "Over 200 million records sold worldwide",
        "Renaissance World Tour grossed over $500M",
        "First Black woman to headline Coachella",
        "Cultural icon and philanthropist"
      ]),
      socialMedia: createSocialMedia(320000000, 16000000, 26000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: true
    },
    {
      name: "Ed Sheeran",
      slug: "ed-sheeran",
      category: "musician",
      bio: "British singer-songwriter known for heartfelt lyrics and massive global hits.",
      fullBio: "Edward Christopher Sheeran is an English singer-songwriter who has become one of the world's best-selling music artists.",
      careerStart: 2011,
      accomplishments: JSON.stringify([
        "4 Grammy Awards",
        "Shape of You - most-streamed song on Spotify",
        "Divide Tour became highest-grossing tour ever (until 2023)",
        "Over 150 million records sold",
        "Multiple Guinness World Records"
      ]),
      socialMedia: createSocialMedia(42000000, 20000000, 13000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f97316",
      isFeatured: false
    },

    // ACTORS
    {
      name: "Zendaya",
      slug: "zendaya",
      category: "actor",
      bio: "Emmy-winning actress and fashion icon, star of Euphoria and Dune.",
      fullBio: "Zendaya Maree Stoermer Coleman is an American actress and singer who has become one of the most influential young talents in Hollywood.",
      careerStart: 2010,
      accomplishments: JSON.stringify([
        "2 Emmy Awards for Euphoria",
        "Star of Dune franchise",
        "Marvel's Spider-Man trilogy",
        "TIME 100 Most Influential People",
        "Fashion icon and CFDA Fashion Icon Award"
      ]),
      socialMedia: createSocialMedia(184000000, 22000000, 0, 23000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: true
    },
    {
      name: "Timothée Chalamet",
      slug: "timothee-chalamet",
      category: "actor",
      bio: "Oscar-nominated actor and Gen-Z icon, star of Dune and Call Me By Your Name.",
      fullBio: "Timothée Hal Chalamet is an American and French actor who has established himself as one of the most talented actors of his generation.",
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "Academy Award nomination at age 22",
        "Star of Dune franchise",
        "Lead in Wonka (2023)",
        "Golden Globe and BAFTA Award nominations",
        "Youngest nominee for SAG Award for Best Actor"
      ]),
      socialMedia: createSocialMedia(19000000, 0),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#8b5cf6",
      isFeatured: true
    },
    {
      name: "Margot Robbie",
      slug: "margot-robbie",
      category: "actor",
      bio: "Australian actress and producer, star of Barbie and multiple Oscar-nominated films.",
      fullBio: "Margot Elise Robbie is an Australian actress and producer who has become one of Hollywood's most sought-after talents.",
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "Barbie became highest-grossing film of 2023",
        "3 Oscar nominations",
        "Producer through LuckyChap Entertainment",
        "Golden Globe nominations",
        "TIME 100 Most Influential People"
      ]),
      socialMedia: createSocialMedia(30000000, 2000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },
    {
      name: "Tom Holland",
      slug: "tom-holland",
      category: "actor",
      bio: "British actor, Marvel's Spider-Man, and one of the highest-paid actors.",
      fullBio: "Thomas Stanley Holland is an English actor who rose to international fame as Spider-Man in the Marvel Cinematic Universe.",
      careerStart: 2008,
      accomplishments: JSON.stringify([
        "Lead role in Spider-Man trilogy",
        "BAFTA Rising Star Award",
        "Spider-Man: No Way Home grossed $1.9 billion",
        "Star of Uncharted video game adaptation",
        "Youngest actor to play Spider-Man"
      ]),
      socialMedia: createSocialMedia(65000000, 7500000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#dc2626",
      isFeatured: false
    },
    {
      name: "Florence Pugh",
      slug: "florence-pugh",
      category: "actor",
      bio: "British actress and Oscar nominee, star of Black Widow and Oppenheimer.",
      fullBio: "Florence Rose C. M. Pugh is an English actress known for her versatile performances across independent films and blockbusters.",
      careerStart: 2014,
      accomplishments: JSON.stringify([
        "Academy Award nomination for Little Women",
        "Star of Marvel's Black Widow",
        "Lead in Oppenheimer (2023)",
        "BAFTA Rising Star Award",
        "Critics' Choice Award nominations"
      ]),
      socialMedia: createSocialMedia(8500000, 1000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: false
    },

    // ATHLETES
    {
      name: "Cristiano Ronaldo",
      slug: "cristiano-ronaldo",
      category: "athlete",
      bio: "Portuguese football legend, 5-time Ballon d'Or winner, most followed person on Instagram.",
      fullBio: "Cristiano Ronaldo dos Santos Aveiro is a Portuguese professional footballer widely regarded as one of the greatest players of all time.",
      careerStart: 2002,
      accomplishments: JSON.stringify([
        "5 Ballon d'Or awards",
        "Over 850 career goals",
        "5 UEFA Champions League titles",
        "Most international goals in football history",
        "Most followed person on Instagram (600M+)"
      ]),
      socialMedia: createSocialMedia(636000000, 112000000, 0, 63000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#dc2626",
      isFeatured: true
    },
    {
      name: "Lionel Messi",
      slug: "lionel-messi",
      category: "athlete",
      bio: "Argentine football legend, 8-time Ballon d'Or winner, 2022 World Cup champion.",
      fullBio: "Lionel Andrés Messi is an Argentine professional footballer who plays for Inter Miami and captains the Argentina national team.",
      careerStart: 2004,
      accomplishments: JSON.stringify([
        "Record 8 Ballon d'Or awards",
        "2022 FIFA World Cup champion",
        "Over 800 career goals",
        "10 La Liga titles with Barcelona",
        "Most goals for a single club (672 for Barcelona)"
      ]),
      socialMedia: createSocialMedia(502000000, 12000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#3b82f6",
      isFeatured: true
    },
    {
      name: "LeBron James",
      slug: "lebron-james",
      category: "athlete",
      bio: "NBA legend, 4-time champion, and one of the greatest basketball players of all time.",
      fullBio: "LeBron Raymone James Sr. is an American professional basketball player who has revolutionized the game both on and off the court.",
      careerStart: 2003,
      accomplishments: JSON.stringify([
        "4 NBA Championships",
        "4 NBA MVP Awards",
        "All-time leading scorer in NBA history",
        "19 All-Star selections",
        "Olympic gold medals (2008, 2012)"
      ]),
      socialMedia: createSocialMedia(159000000, 52000000, 0, 80000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#8b5cf6",
      isFeatured: false
    },
    {
      name: "Serena Williams",
      slug: "serena-williams",
      category: "athlete",
      bio: "Tennis legend with 23 Grand Slam singles titles, entrepreneur and cultural icon.",
      fullBio: "Serena Jameka Williams is an American former professional tennis player widely regarded as one of the greatest athletes of all time.",
      careerStart: 1995,
      accomplishments: JSON.stringify([
        "23 Grand Slam singles titles",
        "4 Olympic gold medals",
        "319 weeks ranked World No. 1",
        "73 career WTA singles titles",
        "Successful entrepreneur and investor"
      ]),
      socialMedia: createSocialMedia(17000000, 11000000, 0, 2000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#10b981",
      isFeatured: false
    },
    {
      name: "Simone Biles",
      slug: "simone-biles",
      category: "athlete",
      bio: "Most decorated gymnast in history with 37 Olympic and World Championship medals.",
      fullBio: "Simone Arianne Biles Owens is an American artistic gymnast who is widely considered the greatest gymnast of all time.",
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "7 Olympic medals (4 gold)",
        "30 World Championship medals",
        "Most decorated gymnast in history",
        "5 skills named after her",
        "Presidential Medal of Freedom recipient"
      ]),
      socialMedia: createSocialMedia(12000000, 2000000, 0, 8000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: false
    },
    {
      name: "Kylian Mbappé",
      slug: "kylian-mbappe",
      category: "athlete",
      bio: "French football superstar and World Cup winner, one of the fastest players in the world.",
      fullBio: "Kylian Mbappé Lottin is a French professional footballer who plays as a forward for Real Madrid and captains the France national team.",
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "2018 FIFA World Cup champion",
        "Golden Boot winner 2022 World Cup",
        "Youngest French player to score at a World Cup",
        "Ligue 1 Golden Boot (multiple times)",
        "UEFA Champions League runner-up"
      ]),
      socialMedia: createSocialMedia(120000000, 13000000, 0, 15000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#3b82f6",
      isFeatured: false
    },

    // CREATORS
    {
      name: "MrBeast",
      slug: "mrbeast",
      category: "creator",
      bio: "YouTube phenomenon with 230M+ subscribers, known for massive giveaways and stunts.",
      fullBio: "Jimmy Donaldson, known as MrBeast, is an American YouTuber, entrepreneur, and philanthropist known for his expensive stunts and challenges.",
      careerStart: 2012,
      accomplishments: JSON.stringify([
        "Most-subscribed individual YouTuber (230M+)",
        "Donated over $100 million to charity",
        "MrBeast Burger restaurant chain",
        "Feastables chocolate brand",
        "Streamy Awards Creator of the Year"
      ]),
      socialMedia: createSocialMedia(53000000, 28000000, 230000000, 100000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#10b981",
      isFeatured: true
    },
    {
      name: "Emma Chamberlain",
      slug: "emma-chamberlain",
      category: "creator",
      bio: "YouTube star turned fashion icon and successful entrepreneur with coffee brand.",
      fullBio: "Emma Frances Chamberlain is an American YouTuber, podcaster, businesswoman, and model who has redefined Gen-Z content creation.",
      careerStart: 2017,
      accomplishments: JSON.stringify([
        "12 million YouTube subscribers",
        "Founder of Chamberlain Coffee",
        "Met Gala attendee and fashion icon",
        "TIME 100 Next list",
        "Streamy Awards for Creator of the Year"
      ]),
      socialMedia: createSocialMedia(16000000, 3000000, 12000000, 14000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: false
    },
    {
      name: "Khaby Lame",
      slug: "khaby-lame",
      category: "creator",
      bio: "Most-followed TikTok creator with 162M+ followers, known for silent comedy skits.",
      fullBio: "Khabane Lame, known as Khaby Lame, is a Senegalese-Italian social media personality who became the most-followed person on TikTok.",
      careerStart: 2020,
      accomplishments: JSON.stringify([
        "Most-followed person on TikTok (162M+)",
        "Brand partnerships with major companies",
        "International recognition for comedy",
        "Hugo Boss brand ambassador",
        "Influencer of the Year awards"
      ]),
      socialMedia: createSocialMedia(81000000, 0, 0, 162000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },
    {
      name: "Charli D'Amelio",
      slug: "charli-damelio",
      category: "creator",
      bio: "TikTok superstar with 155M+ followers, dancer, and reality TV star.",
      fullBio: "Charli Grace D'Amelio is an American social media personality and dancer who was the first person to earn 100 million followers on TikTok.",
      careerStart: 2019,
      accomplishments: JSON.stringify([
        "First to reach 100M TikTok followers",
        "155M+ TikTok followers",
        "Reality show 'The D'Amelio Show'",
        "Brand partnerships with major companies",
        "People's Choice Awards"
      ]),
      socialMedia: createSocialMedia(48000000, 5000000, 10000000, 155000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#8b5cf6",
      isFeatured: false
    },

    // MORE MUSICIANS
    {
      name: "Dua Lipa",
      slug: "dua-lipa",
      category: "musician",
      bio: "British-Albanian pop star with multiple Grammy Awards and global hits.",
      fullBio: "Dua Lipa is an English and Albanian singer and songwriter who has become one of the most prominent pop artists globally.",
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "3 Grammy Awards",
        "7 Brit Awards",
        "Future Nostalgia album critical and commercial success",
        "Over 100 billion streams",
        "Glastonbury headline performer"
      ]),
      socialMedia: createSocialMedia(88000000, 8000000, 28000000, 15000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },
    {
      name: "SZA",
      slug: "sza",
      category: "musician",
      bio: "R&B sensation, Grammy winner, and one of the most streamed female artists.",
      fullBio: "Solána Imani Rowe, known professionally as SZA, is an American singer-songwriter known for her genre-blending music.",
      careerStart: 2012,
      accomplishments: JSON.stringify([
        "4 Grammy Awards",
        "SOS album topped charts for 10 weeks",
        "Most-streamed R&B album by a woman",
        "Billboard Woman of the Year 2023",
        "Over 60 billion streams"
      ]),
      socialMedia: createSocialMedia(19000000, 7000000, 6000000, 13000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      accentColor: "#10b981",
      isFeatured: false
    },
    {
      name: "Harry Styles",
      slug: "harry-styles",
      category: "musician",
      bio: "Former One Direction member turned solo superstar, Grammy winner, and fashion icon.",
      fullBio: "Harry Edward Styles is an English singer-songwriter and actor who has achieved massive solo success after his time with One Direction.",
      careerStart: 2010,
      accomplishments: JSON.stringify([
        "3 Grammy Awards including Album of the Year",
        "Harry's House topped global charts",
        "Love On Tour grossed over $600M",
        "Acting roles in Dunkirk and Don't Worry Darling",
        "Fashion icon and Gucci ambassador"
      ]),
      socialMedia: createSocialMedia(49000000, 38000000, 8000000, 29000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#f59e0b",
      isFeatured: false
    },
    {
      name: "Olivia Rodrigo",
      slug: "olivia-rodrigo",
      category: "musician",
      bio: "Gen-Z pop-rock sensation, Grammy winner, and Disney actress turned music star.",
      fullBio: "Olivia Isabel Rodrigo is an American singer-songwriter and actress who gained recognition as a Disney Channel star before her music breakthrough.",
      careerStart: 2015,
      accomplishments: JSON.stringify([
        "3 Grammy Awards",
        "SOUR debut album broke streaming records",
        "Drivers License fastest song to reach 1 billion Spotify streams",
        "Billboard Woman of the Year",
        "GUTS World Tour success"
      ]),
      socialMedia: createSocialMedia(37000000, 7000000, 15000000, 38000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#a855f7",
      isFeatured: false
    },

    // MORE ACTORS
    {
      name: "Ryan Gosling",
      slug: "ryan-gosling",
      category: "actor",
      bio: "Canadian actor, Oscar nominee, and star of La La Land and Barbie.",
      fullBio: "Ryan Thomas Gosling is a Canadian actor known for his versatile performances in both independent and blockbuster films.",
      careerStart: 1993,
      accomplishments: JSON.stringify([
        "2 Academy Award nominations",
        "Star of Barbie (2023) - $1.4B box office",
        "La La Land and Blade Runner 2049",
        "Golden Globe winner",
        "Critical acclaim across genres"
      ]),
      socialMedia: createSocialMedia(0, 0),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#3b82f6",
      isFeatured: false
    },
    {
      name: "Anya Taylor-Joy",
      slug: "anya-taylor-joy",
      category: "actor",
      bio: "Emmy and Golden Globe winner, star of The Queen's Gambit and Furiosa.",
      fullBio: "Anya Josephine Marie Taylor-Joy is an actress known for her versatile performances and striking screen presence.",
      careerStart: 2014,
      accomplishments: JSON.stringify([
        "Emmy Award for The Queen's Gambit",
        "Golden Globe winner",
        "Lead in Mad Max: Furiosa (2024)",
        "SAG Award winner",
        "Rising star in Hollywood"
      ]),
      socialMedia: createSocialMedia(11000000, 0),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#8b5cf6",
      isFeatured: false
    },
    {
      name: "Pedro Pascal",
      slug: "pedro-pascal",
      category: "actor",
      bio: "Chilean-American actor, star of The Mandalorian and The Last of Us.",
      fullBio: "José Pedro Balmaceda Pascal is a Chilean and American actor who has become one of the most sought-after stars in television and film.",
      careerStart: 1999,
      accomplishments: JSON.stringify([
        "Lead in The Mandalorian",
        "Emmy nomination for The Last of Us",
        "Star of The Last of Us HBO series",
        "Game of Thrones fan favorite",
        "Critical acclaim across projects"
      ]),
      socialMedia: createSocialMedia(13000000, 0),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      accentColor: "#dc2626",
      isFeatured: false
    },
    {
      name: "Sydney Sweeney",
      slug: "sydney-sweeney",
      category: "actor",
      bio: "Emmy-nominated actress, breakout star of Euphoria and The White Lotus.",
      fullBio: "Sydney Bernice Sweeney is an American actress who has become one of the most talked-about young talents in Hollywood.",
      careerStart: 2009,
      accomplishments: JSON.stringify([
        "2 Emmy nominations",
        "Star of Euphoria and The White Lotus",
        "Lead in Anyone But You (2023)",
        "Producer of original content",
        "Rising Hollywood star"
      ]),
      socialMedia: createSocialMedia(21000000, 0, 0, 7000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },

    // MORE ATHLETES
    {
      name: "Naomi Osaka",
      slug: "naomi-osaka",
      category: "athlete",
      bio: "4-time Grand Slam champion, mental health advocate, and entrepreneur.",
      fullBio: "Naomi Osaka is a Japanese professional tennis player and four-time Grand Slam singles champion.",
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "4 Grand Slam singles titles",
        "Former World No. 1",
        "Highest-paid female athlete",
        "Mental health advocate",
        "Successful entrepreneur"
      ]),
      socialMedia: createSocialMedia(3000000, 1000000, 0, 1000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },
    {
      name: "Travis Kelce",
      slug: "travis-kelce",
      category: "athlete",
      bio: "NFL Super Bowl champion tight end, pop culture icon, and podcast host.",
      fullBio: "Travis Michael Kelce is an American football tight end who has become one of the most recognizable athletes globally.",
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "3 Super Bowl championships",
        "9 Pro Bowl selections",
        "All-time leader in receiving yards by a tight end in playoff history",
        "New Heights podcast success",
        "Pop culture crossover appeal"
      ]),
      socialMedia: createSocialMedia(6500000, 2000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#dc2626",
      isFeatured: false
    },

    // MORE CREATORS
    {
      name: "Addison Rae",
      slug: "addison-rae",
      category: "creator",
      bio: "TikTok star turned actress and singer with 88M+ followers.",
      fullBio: "Addison Rae Easterling is an American social media personality, actress, and singer who has successfully transitioned from TikTok to mainstream entertainment.",
      careerStart: 2019,
      accomplishments: JSON.stringify([
        "88M+ TikTok followers",
        "Lead role in He's All That",
        "Music career launch",
        "Beauty brand ITEM Beauty",
        "Brand partnerships and endorsements"
      ]),
      socialMedia: createSocialMedia(40000000, 5000000, 5000000, 88000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      accentColor: "#ec4899",
      isFeatured: false
    },
    {
      name: "Logan Paul",
      slug: "logan-paul",
      category: "creator",
      bio: "YouTuber, boxer, entrepreneur, and co-founder of PRIME energy drink.",
      fullBio: "Logan Alexander Paul is an American YouTuber, social media personality, and professional wrestler who has built a massive entertainment empire.",
      careerStart: 2013,
      accomplishments: JSON.stringify([
        "23M+ YouTube subscribers",
        "Co-founder of PRIME Hydration",
        "Professional boxing career",
        "WWE superstar",
        "Impaulsive podcast host"
      ]),
      socialMedia: createSocialMedia(27000000, 6000000, 23000000, 33000000),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
      ]),
      heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      accentColor: "#3b82f6",
      isFeatured: false
    }
  ];

  return celebsData;
}

// Event templates for different celebrity types
export function generateEventsForCelebrity(celebrityId: number, category: string, name: string) {
  const events = [];
  const baseDate = new Date('2025-06-01');

  if (category === 'musician') {
    // Concert tour dates
    events.push({
      celebrityId,
      title: `${name} World Tour - Los Angeles`,
      category: 'tour',
      description: 'Experience the magic live at the iconic SoFi Stadium.',
      imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      price: '150.00',
      location: 'SoFi Stadium, Los Angeles',
      type: 'concert',
      totalSlots: 70000
    });
    events.push({
      celebrityId,
      title: 'VIP Meet & Greet Experience',
      category: 'meet_greet',
      description: 'Exclusive backstage access, photo opportunity, and signed merchandise.',
      imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      price: '750.00',
      location: 'SoFi Stadium VIP Lounge, Los Angeles',
      type: 'meet_greet',
      totalSlots: 50
    });
    events.push({
      celebrityId,
      title: `${name} - Madison Square Garden`,
      category: 'concert',
      description: 'Two-night residency at the world\'s most famous arena.',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000),
      price: '200.00',
      location: 'Madison Square Garden, New York',
      type: 'concert',
      totalSlots: 20000
    });
  } else if (category === 'actor') {
    // Movie premieres and fan events
    events.push({
      celebrityId,
      title: 'Movie Premiere Red Carpet',
      category: 'screening',
      description: 'Attend the exclusive premiere and Q&A session.',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000),
      price: '500.00',
      location: 'TCL Chinese Theatre, Hollywood',
      type: 'meet_greet',
      totalSlots: 300
    });
    events.push({
      celebrityId,
      title: 'Fan Convention Panel',
      category: 'meet_greet',
      description: 'Interactive panel discussion and autograph session.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 75 * 24 * 60 * 60 * 1000),
      price: '350.00',
      location: 'Convention Center, San Diego',
      type: 'meet_greet',
      totalSlots: 1000
    });
  } else if (category === 'athlete') {
    // Sports events and training camps
    events.push({
      celebrityId,
      title: 'Training Camp Experience',
      category: 'meet_greet',
      description: 'Train alongside a legend and learn professional techniques.',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 40 * 24 * 60 * 60 * 1000),
      price: '1200.00',
      location: 'Elite Training Facility',
      type: 'meet_greet',
      totalSlots: 30
    });
    events.push({
      celebrityId,
      title: 'Championship Game VIP Experience',
      category: 'match',
      description: 'VIP tickets, locker room access, and meet & greet.',
      imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
      price: '2500.00',
      location: 'Championship Stadium',
      type: 'meet_greet',
      totalSlots: 100
    });
  } else if (category === 'creator') {
    // Creator meetups and content events
    events.push({
      celebrityId,
      title: 'Creator Meetup & Content Day',
      category: 'meet_greet',
      description: 'Create content together and learn behind-the-scenes secrets.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000),
      price: '400.00',
      location: 'Creator Studio, Los Angeles',
      type: 'meet_greet',
      totalSlots: 100
    });
    events.push({
      celebrityId,
      title: 'Live Stream Special Event',
      category: 'meet_greet',
      description: 'Be part of a live streaming event with giveaways and surprises.',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
      date: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      price: '100.00',
      location: 'Online + Studio Audience',
      type: 'visitation',
      totalSlots: 500
    });
  }

  return events;
}
