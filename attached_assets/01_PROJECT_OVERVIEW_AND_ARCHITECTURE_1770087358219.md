# PROJECT OVERVIEW AND ARCHITECTURE

## Celebrity Fan Management SaaS Platform

**Version:** 1.0  
**Last Updated:** February 1, 2026  
**Project Type:** Multi-Tenant Celebrity Management & Fan Engagement Platform  
**Core Technology:** PHP + SQLite + Tailwind CSS

-----

## TABLE OF CONTENTS

1. Executive Summary
1. System Architecture Overview
1. Technology Stack
1. User Roles & Permissions
1. Complete Feature Specifications
1. URL Structure & Routing
1. Database Architecture
1. File & Folder Structure
1. Security Architecture
1. Business Logic & Workflows
1. Deployment Strategy
1. Performance Considerations

-----

## 1. EXECUTIVE SUMMARY

### What is This Platform?

This is a **multi-tenant celebrity management and fan engagement platform** that allows talent managers to create, manage, and monetize celebrity pages with integrated booking systems, fan cards, and event management.

### Core Value Proposition

**For Managers:**

- Deploy professional celebrity pages in minutes
- Manage multiple celebrities from one dashboard
- Accept event bookings and visitation requests
- Issue premium fan cards (digital & physical)
- Track revenue and fan engagement

**For Fans:**

- Purchase exclusive fan cards for access to celebrities
- Book concert/event tickets
- Request private visitations (meet & greet, parties, tours)
- Manage bookings through personalized dashboard
- Receive digital tickets with QR codes

**For Celebrities:**

- Zero technical setup required (manager handles everything)
- Professional web presence with custom domain slug
- Monetization through events, visitations, and fan cards
- No login required - manager maintains full control

### Unique System Characteristics

1. **Fan Card Authentication System**: Unlike traditional user accounts, fans authenticate using purchased Fan Cards (unique Card ID + Email). This creates a premium membership model.
1. **Portable Deployment**: Uses SQLite database for complete portability - entire project can be copied and deployed to any hosting without MySQL setup.
1. **Multi-Tenant with Single Manager**: One manager account can oversee unlimited celebrities, each with independent pricing, events, and fan bases.
1. **Hybrid Booking System**: Combines event ticketing (concerts, shows) with personalized visitation booking (meet & greet, private parties).
1. **Tiered Fan Card System**: Gold, Platinum, and Black card tiers with different pricing and benefits (physical cards available).

-----

## 2. SYSTEM ARCHITECTURE OVERVIEW

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC DOMAIN LAYER                       │
│  (autonomymanagement.com - Main Landing + Celebrity Pages)  │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼──────┐
│ PUBLIC │      │  FAN CARD │
│ PAGES  │      │  SYSTEM   │
└───┬────┘      └────┬──────┘
    │                │
    │         ┌──────▼──────────┐
    │         │   BOOKING       │
    │         │   ENGINE        │
    │         └──────┬──────────┘
    │                │
┌───▼────────────────▼────┐
│   SQLITE DATABASE       │
│  (celebrities.db)       │
└───┬─────────────────────┘
    │
┌───▼─────────────┐
│ MANAGER PORTAL  │
│ (/manager)      │
└─────────────────┘
```

### Data Flow Architecture

**1. MANAGER WORKFLOW:**
Manager Login → Dashboard → Select Celebrity → Create/Edit Events → Set Pricing → Manage Bookings → Approve Fan Cards → View Analytics

**2. FAN WORKFLOW (New User):**
Landing Page → Browse Celebrities → Select Celebrity → Purchase Fan Card → Receive Card ID via Email → Login with Card ID → Book Event/Visitation → Receive Ticket → Access Dashboard

**3. FAN WORKFLOW (Returning User):**
Direct Celebrity Page → Login with Card ID → View Dashboard → Book New Event → Manage Bookings

### Core System Components

1. **Routing Engine** - Clean URL handling (no .php extensions)
1. **Authentication Module** - Manager (session-based) + Fan Card (ID-based)
1. **Celebrity Management System** - CRUD operations with priority ordering
1. **Event Management System** - Calendar, slots tracking, image uploads
1. **Visitation Booking System** - Occasion types, custom pricing per celebrity
1. **Fan Card Issuance System** - Tier management, ID generation, approval workflow
1. **Booking Engine** - Cart system, price calculation, slot validation
1. **Email Notification System** - SMTP integration with HTML templates
1. **Ticket Generation System** - PDF creation with QR codes
1. **Support Ticket System** - Contact forms with file attachments
1. **Blog Management System** - Post creation and public display
1. **Analytics Dashboard** - Revenue, bookings, fan card stats

-----

## 3. TECHNOLOGY STACK

### Backend Technologies

**Primary Language:** PHP 7.4+ (or PHP 8.x recommended)

**Why Advanced PHP?**

- Custom routing system (Laravel-style clean URLs)
- Object-oriented architecture (MVC pattern)
- Fast execution with optimized SQLite queries
- No framework overhead - pure performance

**Key PHP Features Used:**

- PDO (PHP Data Objects) for database operations
- Session management for manager authentication
- File upload handling (images, attachments)
- JSON encoding/decoding for API responses
- DateTime manipulation for event scheduling
- Regular expressions for validation

**Database:** SQLite 3

**Why SQLite?**

- Single file database (celebrities.db)
- Zero configuration deployment
- Portable across servers (just copy the file)
- Excellent for read-heavy operations
- ACID compliance for data integrity
- Perfect for multi-tenant with moderate traffic

**Email System:** PHPMailer 6.x

**Why PHPMailer?**

- SMTP authentication support
- HTML email templates
- Attachment handling (PDF tickets)
- Error logging
- Support for Gmail, SendGrid, AWS SES, etc.

### Frontend Technologies

**CSS Framework:** Tailwind CSS 3.x (CDN)

**CDN Link:**

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Why Tailwind CDN?**

- No build process required
- Instant prototyping
- Consistent design system
- Responsive by default
- Small production footprint with JIT

**JavaScript:** Vanilla ES6+

**Use Cases:**

- Form validation (client-side)
- AJAX for fan card validation
- Price calculator (dynamic booking totals)
- Image preview on uploads
- Modal windows
- Dropdown interactions
- Date/time pickers for events

**No JavaScript frameworks** - Keep it fast and simple

### PDF Generation

**Library:** TCPDF or FPDF

**Use Case:**

- Event ticket generation with QR codes
- Fan card certificate (optional)
- Booking receipts

**QR Code Library:** PHP QR Code or endroid/qr-code

**Integration:**

```php
// Generate QR code with booking reference
$qrCode = new QRCode($bookingReference);
$qrCode->writeFile($pdfPath);
```

### Server Requirements

**Minimum:**

- PHP 7.4+ with extensions:
  - pdo_sqlite
  - gd (image processing)
  - mbstring
  - openssl (SMTP)
  - fileinfo
- Apache or Nginx with mod_rewrite
- 512MB RAM minimum
- 5GB storage (for uploads)

**Recommended:**

- PHP 8.1+
- OPcache enabled
- 1GB+ RAM
- SSD storage
- HTTPS/SSL certificate

-----

## 4. USER ROLES & PERMISSIONS

### 1. MANAGER (Admin)

**Access Level:** Full system control

**Authentication:**

- Username/Email + Password
- Session-based authentication
- Optional 2FA (future enhancement)

**Capabilities:**

- ✅ Create, edit, delete celebrities
- ✅ Set celebrity priority (top 20 on homepage)
- ✅ Manage all events for all celebrities
- ✅ Configure visitation pricing per celebrity
- ✅ View all bookings across all celebrities
- ✅ Approve/reject fan card applications
- ✅ Export booking data to CSV
- ✅ Configure site settings (SMTP, support email)
- ✅ Create blog posts
- ✅ Upload images (celebrity photos, event posters)
- ✅ View analytics dashboard
- ✅ Manage support tickets

**Cannot:**

- ❌ Access fan card dashboards directly
- ❌ Make bookings as a fan

**Dashboard Location:** `/manager`

### 2. CELEBRITY

**Access Level:** NONE - No login credentials

**Why No Login?**

- Celebrities delegate all management to their manager
- Reduces complexity and security risks
- Manager maintains full control of brand presentation
- Celebrity receives reports via email (optional future feature)

**Interaction with System:**

- Passive - appears as public profile
- Manager updates all content on their behalf
- Receives booking notifications (if configured)

### 3. FAN (Fan Card Holder)

**Access Level:** Limited to personal bookings and celebrity-specific content

**Authentication:**

- Email + Fan Card ID (no traditional password)
- Example: `alex@gmail.com` + Card ID `ALEX-1234`
- Session-based after login

**Capabilities:**

- ✅ Purchase fan card for specific celebrity
- ✅ Login to fan card dashboard
- ✅ View personal profile
- ✅ Book events (concerts, shows)
- ✅ Book visitations (meet & greet, parties, tours)
- ✅ View active bookings
- ✅ View past tickets
- ✅ Download PDF tickets
- ✅ View booking status (pending, approved, completed)
- ✅ Update billing address (for physical cards)

**Cannot:**

- ❌ Cancel bookings (locked once submitted)
- ❌ Edit celebrity content
- ❌ Access other fans’ data
- ❌ Use fan card across different celebrities (card is celebrity-specific)

**Dashboard Location:** `/fancard` (requires login)

**Important Rule:** Fan card for Celebrity A cannot book events for Celebrity B. Each fan must purchase separate cards for different celebrities.

### 4. PUBLIC VISITOR (Non-Authenticated)

**Access Level:** Read-only public pages

**Capabilities:**

- ✅ Browse main landing page
- ✅ View celebrity profiles
- ✅ View upcoming events
- ✅ View galleries
- ✅ Read blog posts
- ✅ Submit support tickets
- ✅ View fan card pricing/tiers

**Cannot:**

- ❌ Book events (must purchase fan card first)
- ❌ Access any dashboard

-----

## 5. COMPLETE FEATURE SPECIFICATIONS

### MANAGER FEATURES

#### 1. Manager Dashboard (`/manager`)

**Login System:**

- Email/Username + Password
- “Remember Me” option (30-day cookie)
- Password reset via email
- Account lockout after 5 failed attempts

**Dashboard Widgets:**

```
┌─────────────────────────────────────────────────┐
│  OVERVIEW STATS                                 │
│  - Total Celebrities: 15                        │
│  - Active Fan Cards: 1,247                      │
│  - Pending Bookings: 23                         │
│  - This Month Revenue: $45,230                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  RECENT BOOKINGS (Last 10)                      │
│  [Table with: Fan Name, Celebrity, Event, Date] │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  PENDING APPROVALS                              │
│  - Fan Card Applications: 5                     │
│  - Manual Payment Bookings: 3                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  QUICK ACTIONS                                  │
│  [Add Celebrity] [Create Event] [View Support]  │
└─────────────────────────────────────────────────┘
```

**Navigation Menu:**

- Dashboard (home)
- Celebrities (list/add/edit)
- Events (all events across celebrities)
- Bookings (all bookings)
- Fan Cards (applications, active cards)
- Blog Posts
- Support Tickets
- Site Settings
- Logout

#### 2. Celebrity Management

**Celebrity List Page:**

- Table view with columns:
  - Photo (thumbnail)
  - Name
  - Slug (URL identifier)
  - Active Events Count
  - Total Fan Cards
  - Priority Order (1-20 for homepage display)
  - Status (Active/Inactive)
  - Actions (Edit, Delete, View Public Page)
- Drag-and-drop priority ordering
- Bulk actions (activate, deactivate)
- Search/filter by name

**Add/Edit Celebrity Form:**

*Basic Information:*

- Full Name (required)
- Slug/Username (unique, auto-generated from name, editable)
  - Example: “John Doe” → slug: `john-doe`
  - Used in URL: `autonomymanagement.com/john-doe`
- Email (for booking notifications)
- Phone Number
- Category/Genre (Musician, Actor, Athlete, Influencer, etc.)
- Status (Active/Inactive)

*Media:*

- Profile Photo (required, recommended: 500x500px)
- Cover Photo (hero background, recommended: 1920x1080px)
- Gallery Images (multiple upload, max 50 images)

*About Section:*

- Short Bio (1-2 sentences for cards/listings)
- Full Biography (rich text editor, no character limit)
- Accomplishments (bullet points):
  - Awards
  - Notable Works
  - Career Highlights
- Social Media Links:
  - Instagram
  - Twitter/X
  - Facebook
  - TikTok
  - YouTube
  - Website

*Movies/Music/Portfolio:*

- Dynamic repeater field:
  - Title
  - Year
  - Description
  - Thumbnail
  - Link (IMDb, Spotify, etc.)

*Visitation Pricing Configuration:*

This is CRITICAL - each celebrity has custom pricing for visitation types.

**Default Occasion Types:**

- Meet & Greet
- Private Party
- Concert/Show Booking
- Tour Appearance
- Personal Video Message
- Custom Occasion (manager can add unlimited types)

**Pricing Structure Per Occasion:**

- Occasion Name (e.g., “VIP Meet & Greet”)
- Base Price (e.g., $500)
- Duration (optional, e.g., “30 minutes”)
- Description
- Availability (Active/Inactive)
- Budget Range (optional display, e.g., “$500-$1000”)

**Example Configuration for Celebrity “Alex”:**

```
Meet & Greet: $750 (30 min)
Private Party: $5,000 (2 hours)
Concert Booking: $15,000 (full event)
Personal Shoutout: $200 (5 min video)
```

*Fan Card Settings for This Celebrity:*

- Support Email (overrides default site email)
- Custom Welcome Message (shown on fan card purchase)
- Card Tier Pricing Override (optional):
  - Gold Digital: $50 (default)
  - Platinum Digital: $100 (default)
  - Black Digital: $200 (default)
  - Gold Physical: $75 (default)
  - Platinum Physical: $125 (default)
  - Black Physical: $250 (default)

*Homepage Priority:*

- Enable on Homepage (yes/no)
- Priority Order (1-20, lower number = higher priority)
- Only top 20 celebrities with priority 1-20 show on homepage

**Validation Rules:**

- Slug must be unique across all celebrities
- Slug can only contain lowercase letters, numbers, hyphens
- Profile photo required
- At least one visitation pricing option required

-----

## 6. URL STRUCTURE & ROUTING

### Clean URL Pattern

**Goal:** Professional URLs without `.php` extensions

**Implementation:** Apache `.htaccess` with mod_rewrite

### URL Map

```
PUBLIC URLS:
/                              → Home/Landing Page
/about                         → About Platform Page
/blog                          → Blog Listing
/blog/[post-slug]              → Single Blog Post
/support                       → Contact/Support Form
/terms                         → Terms & Conditions
/privacy                       → Privacy Policy

CELEBRITY URLS:
/[celebrity-slug]              → Celebrity Profile
/[celebrity-slug]/events       → Events Listing
/[celebrity-slug]/gallery      → Full Gallery
/[celebrity-slug]/get-fancard  → Purchase Fan Card

FAN CARD URLS:
/fancard                       → Login Page
/fancard/dashboard/[celeb-slug]→ Fan Dashboard
/fancard/logout                → Logout

MANAGER URLS:
/manager                       → Manager Login
/manager/dashboard             → Dashboard Home
/manager/celebrities           → List All Celebrities
/manager/celebrities/add       → Add New Celebrity
/manager/celebrities/edit/[id] → Edit Celebrity
/manager/events                → All Events
/manager/events/add            → Add Event
/manager/events/edit/[id]      → Edit Event
/manager/bookings              → All Bookings
/manager/fancards              → Fan Card Management
/manager/blog                  → Blog Posts
/manager/blog/add              → Create Post
/manager/support               → Support Tickets
/manager/settings              → Site Settings
/manager/logout                → Logout

API ENDPOINTS (AJAX):
/api/validate-fancard          → Check if Card ID exists
/api/calculate-price           → Get booking total
/api/check-availability        → Check event slots
```

-----

This is a comprehensive start. The document continues with DATABASE ARCHITECTURE, FILE STRUCTURE, SECURITY, WORKFLOWS, DEPLOYMENT, and PERFORMANCE sections.

Would you like me to continue with the remaining sections now?

## 7. DATABASE ARCHITECTURE

### Database: SQLite

**File:** `database/celebrities.db`

**Location:** Outside web root for security (e.g., `/var/www/project/database/`)

**Connection:** PDO with persistent connection

### Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌──────────────┐
│  managers   │────────<│ celebrities  │
└─────────────┘         └──────┬───────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
            ┌───────▼──┐  ┌────▼─────┐  ┌▼──────────┐
            │  events  │  │ fan_cards│  │ visitation│
            │          │  │          │  │ _pricing  │
            └────┬─────┘  └────┬─────┘  └───────────┘
                 │             │
                 │      ┌──────▼─────┐
                 └─────>│  bookings  │
                        └────────────┘
```

### Complete Table Schemas

#### 1. `managers` Table

**Purpose:** Store manager login credentials

```sql
CREATE TABLE managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    status ENUM('active', 'suspended') DEFAULT 'active',
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until DATETIME NULL
);

CREATE INDEX idx_managers_email ON managers(email);
CREATE INDEX idx_managers_username ON managers(username);
```

#### 2. `celebrities` Table

**Purpose:** Store celebrity profiles and settings

```sql
CREATE TABLE celebrities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manager_id INTEGER NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    category VARCHAR(50), -- Musician, Actor, Athlete, etc.
    profile_photo VARCHAR(255),
    cover_photo VARCHAR(255),
    short_bio TEXT,
    full_bio TEXT,
    accomplishments TEXT, -- JSON array
    portfolio TEXT, -- JSON array
    social_media TEXT, -- JSON object
    status ENUM('active', 'inactive') DEFAULT 'active',
    homepage_priority INTEGER DEFAULT NULL, -- 1-20 for homepage
    support_email VARCHAR(100),
    welcome_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_celebrities_slug ON celebrities(slug);
CREATE INDEX idx_celebrities_status ON celebrities(status);
CREATE INDEX idx_celebrities_priority ON celebrities(homepage_priority);
```

#### 3. `celebrity_gallery` Table

```sql
CREATE TABLE celebrity_gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    celebrity_id INTEGER NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id) ON DELETE CASCADE
);

CREATE INDEX idx_gallery_celebrity ON celebrity_gallery(celebrity_id);
```

#### 4. `visitation_pricing` Table

```sql
CREATE TABLE visitation_pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    celebrity_id INTEGER NOT NULL,
    occasion_name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id) ON DELETE CASCADE
);

CREATE INDEX idx_visitation_celebrity ON visitation_pricing(celebrity_id);
```

#### 5. `events` Table

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    celebrity_id INTEGER NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(50),
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    venue_name VARCHAR(200),
    venue_address TEXT,
    venue_map_link TEXT,
    ticket_price DECIMAL(10,2) NOT NULL,
    total_slots INTEGER NOT NULL,
    slots_sold INTEGER DEFAULT 0,
    min_purchase INTEGER DEFAULT 1,
    max_purchase INTEGER DEFAULT 10,
    poster_image VARCHAR(255),
    visibility ENUM('public', 'private') DEFAULT 'public',
    status ENUM('upcoming', 'sold_out', 'past') DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id) ON DELETE CASCADE
);

CREATE INDEX idx_events_celebrity ON events(celebrity_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
```

#### 6. `fan_cards` Table

```sql
CREATE TABLE fan_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id VARCHAR(20) UNIQUE NOT NULL, -- ALEX-1234 format
    celebrity_id INTEGER NOT NULL,
    fan_name VARCHAR(100) NOT NULL,
    fan_email VARCHAR(100) NOT NULL,
    fan_phone VARCHAR(20),
    fan_photo VARCHAR(255),
    tier ENUM('gold', 'platinum', 'black') NOT NULL,
    card_type ENUM('digital', 'physical') NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,
    billing_address TEXT, -- JSON object
    ssn_last4 VARCHAR(4),
    date_of_birth DATE,
    status ENUM('pending', 'approved', 'shipped', 'delivered', 'suspended') DEFAULT 'pending',
    approved_at DATETIME,
    shipped_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_fancard_id ON fan_cards(card_id);
CREATE INDEX idx_fancard_email ON fan_cards(fan_email);
CREATE INDEX idx_fancard_celebrity ON fan_cards(celebrity_id);
CREATE INDEX idx_fancard_status ON fan_cards(status);
```

**Card ID Generation Logic:**

```php
function generateCardId($celebritySlug, $db) {
    $prefix = strtoupper(substr($celebritySlug, 0, 6));
    $number = 1;
    
    $stmt = $db->prepare("SELECT card_id FROM fan_cards WHERE card_id LIKE ? ORDER BY card_id DESC LIMIT 1");
    $stmt->execute([$prefix . '-%']);
    $lastCard = $stmt->fetchColumn();
    
    if ($lastCard) {
        $number = intval(substr($lastCard, -4)) + 1;
    }
    
    return $prefix . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
}
// Example: ALEX-0001, ALEX-0002, ...
```

#### 7. `bookings` Table

```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    fan_card_id VARCHAR(20) NOT NULL,
    celebrity_id INTEGER NOT NULL,
    booking_type ENUM('event', 'visitation') NOT NULL,
    
    -- For EVENT bookings:
    event_id INTEGER,
    quantity INTEGER DEFAULT 1,
    
    -- For VISITATION bookings:
    visitation_pricing_id INTEGER,
    preferred_date DATE,
    preferred_time TIME,
    location_preference TEXT,
    num_guests INTEGER DEFAULT 1,
    
    -- Common fields:
    total_price DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    completed_at DATETIME,
    
    FOREIGN KEY (fan_card_id) REFERENCES fan_cards(card_id) ON DELETE CASCADE,
    FOREIGN KEY (celebrity_id) REFERENCES celebrities(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    FOREIGN KEY (visitation_pricing_id) REFERENCES visitation_pricing(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_booking_reference ON bookings(booking_reference);
CREATE INDEX idx_booking_fancard ON bookings(fan_card_id);
CREATE INDEX idx_booking_celebrity ON bookings(celebrity_id);
CREATE INDEX idx_booking_status ON bookings(status);
```

#### 8. Other Essential Tables

```sql
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    ticket_file_path VARCHAR(255) NOT NULL,
    qr_code_data TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    featured_image VARCHAR(255),
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES managers(id) ON DELETE CASCADE
);

CREATE TABLE support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    message TEXT NOT NULL,
    attachments TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME
);

CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    template_name VARCHAR(50),
    status ENUM('sent', 'failed') NOT NULL,
    error_message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

-----

## 8. FILE & FOLDER STRUCTURE

### Complete Directory Tree

```
project-root/
│
├── .htaccess                      # Apache rewrite rules
├── index.php                      # Main public entry point
├── config/
│   ├── database.php               # PDO connection
│   ├── routes.php                 # URL route definitions
│   ├── constants.php              # Define paths, URLs
│   └── settings.php               # Load site settings from DB
│
├── database/
│   └── celebrities.db             # SQLite database file
│
├── core/
│   ├── Router.php                 # Routing class
│   ├── Database.php               # Database wrapper
│   ├── Session.php                # Session management
│   ├── Validator.php              # Form validation
│   ├── Uploader.php               # File upload handler
│   └── Mailer.php                 # SMTP email sender
│
├── controllers/
│   ├── HomeController.php         
│   ├── CelebrityController.php    
│   ├── EventController.php        
│   ├── FanCardController.php      
│   ├── FanDashboardController.php 
│   ├── BookingController.php      
│   ├── BlogController.php         
│   ├── SupportController.php      
│   └── Manager/
│       ├── AuthController.php     
│       ├── DashboardController.php
│       ├── CelebrityManageController.php
│       ├── EventManageController.php
│       ├── BookingManageController.php
│       ├── FanCardManageController.php
│       └── SettingsController.php
│
├── models/
│   ├── Manager.php                
│   ├── Celebrity.php              
│   ├── Event.php                  
│   ├── FanCard.php                
│   ├── Booking.php                
│   └── SiteSetting.php            
│
├── views/
│   ├── layouts/
│   │   ├── public.php             
│   │   ├── fan-dashboard.php      
│   │   └── manager.php            
│   ├── public/
│   ├── fancard/
│   ├── manager/
│   └── components/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
│
├── emails/
│   ├── templates/
│   └── EmailService.php           
│
├── api/
│   ├── validate-fancard.php       
│   ├── calculate-price.php        
│   └── check-availability.php     
│
├── vendor/                        
├── scripts/
│   ├── cron-event-status.php      
│   └── cron-event-reminders.php   
│
└── logs/
```

-----

## 9. SECURITY ARCHITECTURE

### Authentication Security

**Manager Authentication:**

- Password hashing: `password_hash()` with `PASSWORD_BCRYPT`
- Session hijacking prevention
- Account lockout: After 5 failed logins, lock for 15 minutes
- Remember me: Secure token in database

**Fan Card Authentication:**

- Card ID + Email combination (not password-based)
- Session-based after login
- Logout destroys session completely

### Input Validation & Sanitization

**All User Inputs Must Be:**

1. **Validated:**
- Email: `filter_var($email, FILTER_VALIDATE_EMAIL)`
- Phone: Regex pattern
- Slug: `^[a-z0-9-]{3,50}$`
- Dates: `DateTime::createFromFormat()`
1. **Sanitized:**
- Strip tags: `strip_tags()` for plain text
- HTML purification for rich text
- SQL injection prevention: **ALWAYS use prepared statements**
1. **Escaped for Output:**
- HTML: `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')`
- JavaScript: `json_encode($var, JSON_HEX_TAG | JSON_HEX_AMP)`
- URL: `urlencode($var)`

### CSRF Protection

```php
// Generate token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// Validate
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token mismatch');
}
```

### File Upload Security

1. Validate file type (check MIME type)
1. Check file size (max 5MB for photos)
1. Rename files (never trust user filenames)
1. Image re-encoding (strips metadata)
1. Store with restricted permissions

-----

## 10. BUSINESS LOGIC & WORKFLOWS

### Workflow 1: Manager Creates Celebrity

1. Manager logs into dashboard
1. Navigate to “Celebrities” → “Add New”
1. Fill out celebrity form
1. System validates slug is unique
1. System creates celebrity record
1. System creates upload directory
1. Celebrity page immediately accessible

### Workflow 2: Fan Purchases Fan Card

1. Fan visits celebrity page
1. Fan clicks “Get Fan Card”
1. Fan selects tier and type
1. Fan fills purchase form
1. System creates fan_cards record (status=‘pending’)
1. System generates Card ID (e.g., ALEX-0042)
1. Email sent to fan: “Application received”
1. Email sent to manager: “New application”
1. Manager approves
1. System sends email with Card ID
1. Fan can now login and book

### Workflow 3: Fan Books Event

1. Fan logs in with Card ID
1. Fan selects event
1. Fan chooses quantity
1. System calculates total price
1. Fan submits booking
1. Booking created (status=‘pending’)
1. Email to fan: “Booking received”
1. Manager approves
1. System generates PDF ticket with QR code
1. Email to fan with ticket attachment
1. Slots_sold incremented

### Workflow 4: Automated Event Status (Cron)

```bash
# Daily at 2:00 AM
0 2 * * * php /path/cron-event-status.php

# Script updates:
# - Events with past dates → status='past'  
# - Confirmed bookings for past events → status='completed'
```

-----

## 11. DEPLOYMENT STRATEGY

### Portable Deployment

**Steps:**

1. Package project folder
1. Upload to server via FTP/SFTP
1. Set permissions:

```bash
chmod 755 /path/to/project
chmod 660 database/celebrities.db
chmod 775 public/uploads
```

1. Configure `.htaccess` for clean URLs
1. Update `config/constants.php` with BASE_URL
1. Initialize database (run SQL setup script)
1. Configure SMTP in Site Settings
1. Test booking flow

### Server Requirements

**Hosting Recommendations:**

- Shared hosting: SiteGround, Hostinger
- VPS: DigitalOcean, Linode ($5-10/month)

**PHP Extensions:**

```bash
php -m | grep -E 'pdo_sqlite|gd|mbstring|openssl|fileinfo'
```

### Backup Strategy

**Daily Backups (Cron):**

```bash
# 3:00 AM daily
0 3 * * * sqlite3 /path/celebrities.db ".backup /backups/$(date +%Y%m%d).db"
```

-----

## 12. PERFORMANCE CONSIDERATIONS

### Database Optimization

1. **Proper Indexing:**
- All foreign keys indexed
- Frequently queried columns indexed
- Composite indexes for common patterns
1. **Query Optimization:**
- Use EXPLAIN QUERY PLAN
- Avoid SELECT *
- Use JOINs instead of multiple queries
- Limit result sets
1. **SQLite-Specific:**

```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;
```

### Caching Strategies

1. **Page-Level Caching:**
- Generate static HTML for celebrity pages
- Cache lifetime: 1 hour
- Clear cache when celebrity updated
1. **Database Result Caching:**
- Cache site settings in session
- Cache frequently accessed data
1. **Opcode Caching:**
- Enable OPcache in php.ini

### Image Optimization

1. **Automatic Resize on Upload:**
- Profile photos: 500x500px
- Event posters: 1200x630px
- Quality: 85%
1. **Lazy Loading:**
- Gallery images load on scroll
1. **WebP Format:**
- Convert JPEG/PNG to WebP
- Serve with fallback

### Frontend Optimization

1. **Minify CSS/JS**
1. **CDN for static assets**
1. **Browser caching headers**
1. **Reduce HTTP requests**

-----

## SCALABILITY CONSIDERATIONS

### When to Migrate from SQLite to MySQL

**SQLite suitable for:**

- Up to 100,000 fan cards
- Up to 10,000 events
- Up to 500,000 bookings
- 10-50 concurrent users

**Migrate when:**

- Database > 1GB
- Concurrent writes cause issues
- Need replication

-----

## TESTING STRATEGY

### Manual Testing Checklist

**Manager:**

- [ ] Login works
- [ ] Create celebrity with images
- [ ] Create event
- [ ] Approve fan card
- [ ] Approve booking
- [ ] Export CSV

**Fan:**

- [ ] Purchase fan card
- [ ] Receive Card ID email
- [ ] Login with Card ID
- [ ] Book event
- [ ] Receive ticket PDF
- [ ] View dashboard

**Public:**

- [ ] Landing page loads
- [ ] Celebrity page shows data
- [ ] Events listing works
- [ ] Support form sends email

-----

## CONCLUSION

This Celebrity Fan Management Platform is designed as a portable, high-performance system using:

- ✅ PHP + SQLite (portable, zero-config)
- ✅ Tailwind CSS (rapid UI development)
- ✅ Clean architecture (MVC pattern)
- ✅ Comprehensive security (CSRF, XSS, SQL injection prevention)
- ✅ Automated workflows (cron jobs, email notifications)

### Recommended Build Order

1. **Week 1:** Database + Routing + Manager Auth
1. **Week 2:** Public Pages (Landing, Celebrity, Events)
1. **Week 3:** Fan Card System
1. **Week 4:** Booking System
1. **Week 5:** Email & Tickets (SMTP, PDF generation)
1. **Week 6:** Manager Dashboard
1. **Week 7:** Polish & Testing
1. **Week 8:** Deployment

-----

**Document Status:** ✅ COMPLETE  
**Total Sections:** 12 comprehensive sections  
**Ready for:** AI coding agent implementation

**Next Documents:**

- Document 2: FRONTEND_UI_SPECIFICATIONS.md
- Document 3: BACKEND_IMPLEMENTATION_GUIDE.md

-----

*This is a living document. Update as project evolves.*