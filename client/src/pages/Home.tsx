import { useCelebrities } from "@/hooks/use-celebrities";
import { Navbar } from "@/components/Navbar";
import { CelebrityCard } from "@/components/CelebrityCard";
import { motion } from "framer-motion";
import { ArrowRight, Star, Ticket, Globe, Crown } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: celebrities, isLoading } = useCelebrities();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/10 selection:text-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-slate-50 to-white z-0" />
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-60 z-0 animate-pulse" />
        <div className="absolute top-[30%] -left-[5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] opacity-40 z-0" />

        <div className="container mx-auto relative z-10 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8 hover:border-primary/30 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Over 1M+ fans joined worldwide
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight mb-8">
              Meet your <br/>
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-500">Heroes</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-slate-900"> Live.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Iconic is the digital gateway to the stars. Unlock exclusive access, private VIP events, and digital membership with the worlds most inspiring creators.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/#explore" className="group px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 flex items-center gap-2">
                Explore Talent 
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-primary/20 hover:bg-slate-50 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                Fan Portal
              </Link>
            </div>

            {/* Trusted by section */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">Featured in</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                <div className="font-display font-black text-2xl tracking-tighter italic">VOGUE</div>
                <div className="font-display font-black text-2xl tracking-tighter italic">FORBES</div>
                <div className="font-display font-black text-2xl tracking-tighter italic">WIRED</div>
                <div className="font-display font-black text-2xl tracking-tighter italic">BILLBOARD</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 italic">THE EXPERIENCE</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:bg-white group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Ticket size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Priority Access</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Skip the line. Get exclusive early access to concert tickets, limited drops, and global tour dates.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:bg-white group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Crown size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Elite Membership</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Your StarPass is your identity. Unlock tiered rewards, backstage passes, and personal creator engagement.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:bg-white group"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">VIP Events</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Join small-group meet & greets, private soundchecks, and exclusive digital hangouts twice a month.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Celebrities Section */}
      <section id="explore" className="py-32 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-5" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6 leading-tight">CHOOSE YOUR <br/> <span className="text-primary italic">ICON.</span></h2>
              <p className="text-slate-400 text-xl">Discover the visionaries who are redefining the relationship between creator and community.</p>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 transition-colors">
                 <ArrowRight size={24} className="rotate-180" />
               </div>
               <div className="w-12 h-12 rounded-full border border-white/20 bg-primary flex items-center justify-center text-white cursor-pointer hover:bg-primary/80 transition-colors">
                 <ArrowRight size={24} />
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[480px] bg-slate-800 rounded-[32px] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {celebrities?.map((celebrity) => (
                <motion.div key={celebrity.id} variants={item}>
                  <CelebrityCard celebrity={celebrity} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {celebrities?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">No celebrities found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4 max-w-7xl grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 text-white">
              <Crown size={24} className="text-purple-400" />
              <span className="font-display font-black text-2xl tracking-tighter uppercase">Iconic</span>
            </Link>
            <p className="max-w-sm mb-8">Connecting fans with their idols through unforgettable experiences and exclusive access.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Fan Login</Link></li>
              <li><Link href="/manager" className="hover:text-white transition-colors">Manager Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} Iconic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
