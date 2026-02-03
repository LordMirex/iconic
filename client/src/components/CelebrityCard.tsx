import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Celebrity } from "@shared/schema";
import { ArrowUpRight, Star, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <Link href={`/celebrity/${celebrity.slug}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="group relative h-[480px] rounded-[32px] overflow-hidden bg-slate-100 cursor-pointer shadow-xl shadow-slate-200 transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={celebrity.heroImage} 
            alt={celebrity.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="flex gap-2">
            {celebrity.isFeatured && (
              <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Trending
              </Badge>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                <img src={celebrity.avatarImage} alt={celebrity.name} className="w-full h-full object-cover" />
             </div>
             <div>
               <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-black uppercase tracking-widest">
                 <Star size={10} className="text-primary fill-primary" />
                 Official Profile
               </div>
               <h3 className="text-3xl font-display font-black text-white leading-none tracking-tight">{celebrity.name}</h3>
             </div>
          </div>
          
          <p className="text-white/70 text-sm line-clamp-2 font-medium mb-6 transition-colors group-hover:text-white">
            {celebrity.bio}
          </p>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Fan Experience</span>
            <div className="flex items-center gap-1 text-primary">
              <span className="text-sm font-black italic">BOOK NOW</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Accent Border on Hover */}
        <div className="absolute inset-0 border-0 group-hover:border-4 transition-all duration-300 pointer-events-none rounded-[32px]" 
             style={{ borderColor: celebrity.accentColor || '#3b82f6' }} />
      </motion.div>
    </Link>
  );
}
