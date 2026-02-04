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
            
            {/* About & Career */}
            {(celebrity.fullBio || celebrity.accomplishments) && (
              <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <h2 className="font-display text-4xl font-black text-slate-900 mb-8 italic tracking-tight">
                  ABOUT
                </h2>
                
                {celebrity.fullBio && (
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    {celebrity.fullBio}
                  </p>
                )}
                
                {celebrity.careerStart && (
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Calendar size={28} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Career Start</div>
                      <div className="text-2xl font-display font-black text-slate-900">{celebrity.careerStart}</div>
                    </div>
                  </div>
                )}
                
                {celebrity.accomplishments && (
                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Key Achievements</h3>
                    <div className="grid gap-4">
                      {JSON.parse(celebrity.accomplishments).map((achievement: string, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-slate-700 text-lg font-medium leading-relaxed">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Events Section */}
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
              
              {/* Social Media Links */}
              {celebrity.socialMedia && (
                <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="font-display text-2xl font-black text-slate-900 mb-6 tracking-tight">FOLLOW</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const social = JSON.parse(celebrity.socialMedia);
                      const socialLinks = [];
                      
                      if (social.instagram) {
                        socialLinks.push(
                          <a 
                            key="instagram"
                            href={`https://instagram.com/${social.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            <span className="text-sm">Instagram</span>
                          </a>
                        );
                      }
                      
                      if (social.twitter) {
                        socialLinks.push(
                          <a 
                            key="twitter"
                            href={`https://twitter.com/${social.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 text-white font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            <span className="text-sm">X/Twitter</span>
                          </a>
                        );
                      }
                      
                      if (social.tiktok) {
                        socialLinks.push(
                          <a 
                            key="tiktok"
                            href={`https://tiktok.com/@${social.tiktok}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-black text-white font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                            <span className="text-sm">TikTok</span>
                          </a>
                        );
                      }
                      
                      if (social.youtube) {
                        socialLinks.push(
                          <a 
                            key="youtube"
                            href={`https://youtube.com/${social.youtube}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-600 text-white font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            <span className="text-sm">YouTube</span>
                          </a>
                        );
                      }
                      
                      return socialLinks;
                    })()}
                  </div>
                </div>
              )}
              
              {/* Fan Pass CTA */}
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
