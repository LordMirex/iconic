import { useCelebrities } from "@/hooks/use-celebrities";
import { Navbar } from "@/components/Navbar";
import { CelebrityCard } from "@/components/CelebrityCard";
import { motion } from "framer-motion";
import { ArrowRight, Star, Ticket, Globe } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-slate-50 z-0" />
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-50 z-0" />

        <div className="container mx-auto relative z-10 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
              The Premier Fan Experience Platform
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
              Connect with your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Favorite Icons</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock exclusive access, VIP events, and personal moments with the world's most inspiring celebrities. Your pass to the extraordinary awaits.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#explore" className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                Start Exploring <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all hover:shadow-md">
                Member Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Ticket size={24} />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Exclusive Access</h3>
              <p className="text-slate-600 leading-relaxed">Get priority booking for concerts, meet & greets, and private events before the general public.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Star size={24} />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">VIP Status</h3>
              <p className="text-slate-600 leading-relaxed">Upgrade to Platinum or Black tier for backstage passes, signed merchandise, and personal shoutouts.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Global Community</h3>
              <p className="text-slate-600 leading-relaxed">Join a worldwide community of dedicated fans. Share experiences and connect with like-minded people.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrities Section */}
      <section id="explore" className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Featured Icons</h2>
              <p className="text-slate-600 max-w-lg">Discover the stars who are redefining entertainment and connecting with fans in new ways.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              <Crown size={24} />
              <span className="font-display font-bold text-2xl">StarPass</span>
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
          &copy; {new Date().getFullYear()} StarPass Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
