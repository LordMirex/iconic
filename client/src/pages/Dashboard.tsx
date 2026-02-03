import { Navbar } from "@/components/Navbar";
import { useFanCard } from "@/hooks/use-fancards";
import { useBookings, useCreateBooking } from "@/hooks/use-bookings";
import { useEvents } from "@/hooks/use-events";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Calendar, MapPin, QrCode, Ticket, Crown, ShieldCheck, ExternalLink, Clock } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const fanIdStr = localStorage.getItem("fan_id");
  const fanId = fanIdStr ? parseInt(fanIdStr) : undefined;
  
  // Data fetching
  const { data: fanCard, isLoading: loadingCard } = useFanCard(fanId);
  const { data: bookings, isLoading: loadingBookings } = useBookings(fanId);
  
  // For booking events
  const { data: events } = useEvents(fanCard?.celebrityId);
  const { mutate: bookEvent, isPending: bookingPending } = useCreateBooking();

  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fan_id")) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (loadingCard || !fanCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  const handleBook = (eventId: number) => {
    if (!fanId) return;
    bookEvent({ fanCardId: fanId, eventId }, {
      onSuccess: () => setOpenBookingDialog(false)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 mt-12 max-w-7xl">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                <ShieldCheck size={12} />
                Active Membership
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight italic">FAN DASHBOARD</h1>
              <p className="text-slate-500 text-lg mt-2">Manage your VIP access and upcoming experiences.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Crown size={24} />
               </div>
               <div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Holder</div>
                 <div className="font-bold text-slate-900">{fanCard.fanName || 'Platinum Fan'}</div>
               </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Fan Card Section */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Crown size={18} className="text-primary" />
              Digital Pass
            </h2>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative aspect-[1.58] w-full rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl flex flex-col justify-between overflow-hidden border border-white/10 group`}
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="font-display font-black text-3xl text-white italic tracking-tighter">STARPASS</div>
                  <div className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/40 mt-1">Global Fan Network</div>
                </div>
                <QrCode className="w-12 h-12 opacity-80 mix-blend-overlay text-white" />
              </div>

              <div className="relative z-10">
                <div className="font-mono text-white text-2xl tracking-[0.25em] mb-4 drop-shadow-lg">
                  {fanCard.cardCode.replace(/-/g, ' ')}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest font-black text-white/40 mb-1">Membership</div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">{fanCard.tier} Access</div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[10px] font-black tracking-widest uppercase">
                    Level 01
                  </div>
                </div>
              </div>
            </motion.div>

            <Card className="rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                 <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
                   <DialogTrigger asChild>
                     <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold text-slate-700 hover:bg-primary/5 hover:text-primary gap-3 group">
                       <Ticket size={18} className="group-hover:scale-110 transition-transform" />
                       Book New Event
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[32px] p-8 border-none shadow-2xl">
                     <DialogHeader className="mb-6">
                       <DialogTitle className="text-3xl font-display font-black italic">AVAILABLE EXPERIENCES</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-4">
                       {events?.map(event => (
                         <div key={event.id} className="p-6 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all group">
                           <div>
                             <h4 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">{event.title}</h4>
                             <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium">
                               <div className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(event.date), "PPP")}</div>
                               <div className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</div>
                             </div>
                             <div className="text-sm font-black text-slate-900 mt-2 tracking-tighter">${event.price} <span className="text-slate-400 font-bold ml-1 text-xs uppercase tracking-widest">Entry Fee</span></div>
                           </div>
                           <Button 
                             onClick={() => handleBook(event.id)}
                             disabled={bookingPending}
                             className="rounded-xl font-black bg-slate-900 text-white hover:bg-primary h-11 px-6 transition-all shadow-lg shadow-slate-200"
                           >
                             {bookingPending ? <Loader2 className="animate-spin" /> : 'BOOK NOW'}
                           </Button>
                         </div>
                       ))}
                       {(!events || events.length === 0) && (
                         <div className="text-center py-12 text-slate-500 font-medium">No live events found for your icon.</div>
                       )}
                     </div>
                   </DialogContent>
                 </Dialog>
                 <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold text-slate-700 hover:bg-primary/5 hover:text-primary gap-3 group">
                   <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                   View Merchandise
                 </Button>
               </CardContent>
            </Card>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-display font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Ticket size={18} className="text-primary" />
              Confirmed Experiences
            </h2>
            
            {loadingBookings ? (
              <div className="space-y-6">
                {[1, 2].map(n => <div key={n} className="h-40 bg-white rounded-[32px] animate-pulse" />)}
              </div>
            ) : bookings?.length === 0 ? (
              <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-200 shadow-sm">
                <Ticket size={48} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 tracking-tight italic">NO EVENTS BOOKED YET</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Your upcoming VIP moments will appear here once you book an event with your icon.</p>
                <Button onClick={() => setOpenBookingDialog(true)} className="h-14 rounded-2xl bg-slate-900 px-10 font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all active:scale-95">
                  START BOOKING
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings?.map((booking: any) => (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col items-center justify-center w-full md:w-32 bg-slate-50 rounded-2xl p-6 border border-slate-100 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <span className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-1 group-hover:text-primary-foreground/60 transition-colors">
                        {format(new Date(booking.event.date), "MMM")}
                      </span>
                      <span className="text-4xl font-display font-black tracking-tighter">
                        {format(new Date(booking.event.date), "dd")}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase group-hover:text-white/40">VIP PASS</span>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                         <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{booking.event.title}</h3>
                         <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                           {booking.event.type.replace('_', ' ')}
                         </Badge>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                              <MapPin size={16} />
                           </div>
                           {booking.event.location}
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                              <Clock size={16} />
                           </div>
                           Confirmed Entry
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order #{booking.id}822</span>
                         </div>
                         <div className="flex gap-2">
                           <Badge className={`bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest px-3 h-7 flex items-center`}>
                             {booking.status}
                           </Badge>
                           <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider gap-2 hover:bg-primary/5 hover:text-primary rounded-lg h-7 px-3">
                             Voucher
                             <ExternalLink size={12} />
                           </Button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
