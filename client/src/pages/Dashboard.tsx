import { Navbar } from "@/components/Navbar";
import { useFanCard } from "@/hooks/use-fancards";
import { useBookings, useCreateBooking } from "@/hooks/use-bookings";
import { useEvents } from "@/hooks/use-events";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Calendar, MapPin, QrCode, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    if (!localStorage.getItem("fan_token")) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (loadingCard || !fanCard) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-slate-300 to-slate-500';
      case 'Black': return 'from-slate-800 to-black';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const handleBook = (eventId: number) => {
    if (!fanId) return;
    bookEvent({ fanCardId: fanId, eventId }, {
      onSuccess: () => setOpenBookingDialog(false)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-600">Manage your membership and bookings</p>
          </div>
          
          <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Ticket size={20} /> Book New Event
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Available Events</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 mt-4">
                {events?.map(event => (
                  <div key={event.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold">{event.title}</h4>
                      <div className="text-sm text-slate-500">{format(new Date(event.date), "PPP")} • {event.location}</div>
                      <div className="text-sm font-medium mt-1">${event.price}</div>
                    </div>
                    <button 
                      onClick={() => handleBook(event.id)}
                      disabled={bookingPending}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
                    >
                      {bookingPending ? 'Booking...' : 'Book'}
                    </button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Fan Card Visual */}
          <div className="lg:col-span-1">
            <div className={`aspect-[1.58] rounded-2xl bg-gradient-to-br ${getTierColor(fanCard.tier)} shadow-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="font-display font-bold text-2xl drop-shadow-md">StarPass</div>
                  <div className="text-xs opacity-75 uppercase tracking-wider">{fanCard.tier} Member</div>
                </div>
                <QrCode className="w-12 h-12 opacity-80 mix-blend-overlay" />
              </div>

              <div className="relative z-10">
                <div className="text-sm opacity-75 mb-1">Card Holder</div>
                <div className="font-medium text-lg drop-shadow-md truncate">{fanCard.email}</div>
                <div className="font-mono text-xl tracking-widest mt-4 opacity-90">{fanCard.cardCode}</div>
              </div>
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold mb-4">Membership Benefits</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active Membership</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Event Pre-sales</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Digital Fan Badge</li>
              </ul>
            </div>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-bold">My Bookings</h2>
            
            {loadingBookings ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => <div key={n} className="h-24 bg-slate-200 rounded-xl animate-pulse" />)}
              </div>
            ) : bookings?.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No bookings found</p>
                <button onClick={() => setOpenBookingDialog(true)} className="text-primary font-medium hover:underline">Browse events</button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings?.map((booking: any) => (
                  <div key={booking.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center justify-center w-full sm:w-20 bg-slate-50 rounded-xl border border-slate-100 shrink-0 py-4 sm:py-0">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {format(new Date(booking.event.date), "MMM")}
                      </span>
                      <span className="text-2xl font-display font-bold text-slate-900">
                        {format(new Date(booking.event.date), "dd")}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.event.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mb-3 line-clamp-1">{booking.event.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} /> {booking.event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Ticket size={14} /> ID: #{booking.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
