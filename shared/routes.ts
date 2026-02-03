
import { z } from 'zod';
import { 
  insertCelebritySchema, 
  insertEventSchema, 
  insertFanCardSchema, 
  insertBookingSchema,
  celebrities,
  events,
  fanCards,
  bookings,
  fanLoginSchema,
  managerLoginSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Public & Manager - Celebrities
  celebrities: {
    list: {
      method: 'GET' as const,
      path: '/api/celebrities',
      responses: {
        200: z.array(z.custom<typeof celebrities.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/celebrities/:slug', // Using slug for public URLs
      responses: {
        200: z.custom<typeof celebrities.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/celebrities',
      input: insertCelebritySchema,
      responses: {
        201: z.custom<typeof celebrities.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },

  // Events
  events: {
    listByCelebrity: {
      method: 'GET' as const,
      path: '/api/celebrities/:id/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
      },
    },
  },

  // Fan Cards
  fanCards: {
    purchase: {
      method: 'POST' as const,
      path: '/api/fancards/purchase',
      input: insertFanCardSchema, // Contains tier, email, celebrityId (cardCode generated on backend)
      responses: {
        201: z.custom<typeof fanCards.$inferSelect>(),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/fancards/login',
      input: fanLoginSchema,
      responses: {
        200: z.object({ 
          token: z.string(), // Simulating a session/token
          fanCard: z.custom<typeof fanCards.$inferSelect>() 
        }), 
        401: errorSchemas.unauthorized,
      },
    },
    // Get dashboard data for a fan
    get: {
      method: 'GET' as const,
      path: '/api/fancards/:id',
      responses: {
        200: z.custom<typeof fanCards.$inferSelect>(),
      },
    }
  },

  // Bookings
  bookings: {
    listByFan: {
      method: 'GET' as const,
      path: '/api/fancards/:id/bookings',
      responses: {
        200: z.array(z.custom<typeof bookings.$inferSelect & { event: typeof events.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/bookings',
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: z.object({ message: z.string() }), // e.g., fully booked
      },
    },
  },
  
  // Manager
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/manager/login',
      input: managerLoginSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
