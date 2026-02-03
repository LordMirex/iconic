import { useCelebrity } from "@/hooks/use-celebrities";
import { useEvents } from "@/hooks/use-events";
import { Navbar } from "@/components/Navbar";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function CelebrityProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: celebrity, isLoading: loadingCeleb } = useCelebrity(slug);
  const { data: events, isLoading: loadingEvents } = useEvents(celebrity?.id);

  if (loadingCeleb) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400 w-10 h-10" />
      </div>
    );
  }

  if (!celebrity) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-3xl font-bold text-slate-900">Celebrity Not Found</h1>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative h-[60vh] bg-slate-900 overflow-hidden">
        <img 
          src={celebrity.heroImage} 
          alt={celebrity.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white overflow-hidden shadow-2xl shrink-0"
            >
              <img src={celebrity.avatarImage} alt={celebrity.name} className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="mb-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-5xl md:text-7xl font-bold text-white mb-4"
              >
                {celebrity.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-lg max-w-2xl leading-relaxed"
              >
                {celebrity.bio}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Events */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                Upcoming Events
              </h2>
              
              {loadingEvents ? (
                <div className="space-y-4">
                  {[1, 2].map(n => <div key={n} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
              ) : events?.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                  <p className="text-slate-500">No upcoming events scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events?.map((event) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all bg-white"
                    >
                      <div className="flex flex-col items-center justify-center w-full md:w-24 bg-slate-50 rounded-lg p-4 border border-slate-100 shrink-0">
                        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                          {format(new Date(event.date), "MMM")}
                        </span>
                        <span className="text-3xl font-display font-bold text-slate-900">
                          {format(new Date(event.date), "dd")}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider">
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Ticket size={16} />
                            {event.totalSlots - (event.bookedSlots || 0)} slots left
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Link 
                          href="/login" // Redirect to login since they need to be authenticated
                          className="w-full md:w-auto px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors text-center"
                        >
                          Book ${event.price}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Get Card CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl rounded-full" />
              
              <h3 className="font-display text-2xl font-bold mb-4 relative z-10">Become a Member</h3>
              <p className="text-slate-600 mb-8 relative z-10">
                Join the official {celebrity.name} fan club to unlock priority access to events, exclusive content, and VIP experiences.
              </p>
              
              <div className="space-y-4 relative z-10">
                <Link href={`/celebrity/${slug}/get-fancard`} className="block w-full">
                  <button 
                    className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    style={{ 
                      backgroundColor: celebrity.accentColor || '#3b82f6',
                      color: 'white'
                    }}
                  >
                    Get Fan Card
                  </button>
                </Link>
                <div className="text-center text-xs text-slate-400">
                  Already a member? <Link href="/login" className="text-primary hover:underline">Log in here</Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
