import { useCelebrity } from "@/hooks/use-celebrities";
import { useEvents } from "@/hooks/use-events";
import { Navbar } from "@/components/Navbar";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Loader2, Crown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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
      <div className="relative h-[70vh] bg-slate-900 overflow-hidden">
        <img 
          src={celebrity.heroImage} 
          alt={celebrity.name}
          className="w-full h-full object-cover opacity-70 scale-105"
        />
        {/* Advanced Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-end gap-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-40 h-40 md:w-64 md:h-64 rounded-3xl border-8 border-white/10 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] shrink-0 relative group"
            >
              <img src={celebrity.avatarImage} alt={celebrity.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 border-2 border-white/20 rounded-3xl" />
            </motion.div>
            
            <div className="mb-4 flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-primary/20"
              >
                <Crown size={14} className="fill-current" />
                Verified Artist
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-6xl md:text-9xl font-black text-white mb-6 leading-[0.8] tracking-tighter"
              >
                {celebrity.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 text-xl max-w-2xl leading-relaxed font-medium"
              >
                {celebrity.bio}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Content - Events */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-4xl font-black text-slate-900 italic tracking-tight flex items-center gap-4">
                  UPCOMING <span className="text-primary underline decoration-primary/20 underline-offset-8">SHOWS</span>
                </h2>
                <div className="flex gap-2">
                   <div className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border border-slate-100">Tour 2026</div>
                </div>
              </div>
              
              {loadingEvents ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(n => <div key={n} className="h-40 bg-slate-50 rounded-3xl animate-pulse" />)}
                </div>
              ) : events?.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                  <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold text-xl">No live dates announced yet.</p>
                  <p className="text-slate-400">Join the waiting list for early notifications.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {events?.map((event) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="group flex flex-col md:flex-row gap-8 p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all bg-slate-50/50 hover:bg-white"
                    >
                      <div className="flex flex-col items-center justify-center w-full md:w-32 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <span className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-1 group-hover:text-primary-foreground/60 transition-colors">
                          {format(new Date(event.date), "MMM")}
                        </span>
                        <span className="text-4xl font-display font-black tracking-tighter">
                          {format(new Date(event.date), "dd")}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase group-hover:text-white/40">{format(new Date(event.date), "yyyy")}</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-2xl font-display font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                            {event.title}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket size={18} className="text-primary" />
                            <span className="text-slate-900 font-bold">{(event.totalSlots - (event.bookedSlots || 0))}</span> Remaining
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center min-w-[160px]">
                        <Link 
                          href="/login" 
                          className="w-full"
                        >
                          <Button 
                            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                          >
                            ${event.price}
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Get Card CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-10 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] overflow-hidden relative group">
                {/* Background effects */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8 border border-white/10 backdrop-blur-md">
                    <Crown size={32} />
                  </div>
                  <h3 className="font-display text-4xl font-black text-white mb-6 leading-tight tracking-tight italic">FAN <br/> <span className="text-primary">PASS</span></h3>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                    The official digital membership for {celebrity.name} fans. Unlock everything first.
                  </p>
                  
                  <ul className="space-y-4 mb-12">
                    {['Priority Event Booking', 'Backstage VIP Options', 'Exclusive Content Feed', 'Limited Edition Merch'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-slate-300 text-sm font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={`/celebrity/${slug}/get-fancard`} className="block w-full">
                    <Button 
                      className="w-full h-16 rounded-2xl font-black text-xl bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-1 transition-all active:translate-y-0 shadow-2xl shadow-white/10"
                    >
                      GET STARPASS
                    </Button>
                  </Link>
                  <div className="mt-6 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Existing member? <Link href="/login" className="text-white hover:text-primary transition-colors">Sign in</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
