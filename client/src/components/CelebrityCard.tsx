import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Celebrity } from "@shared/schema";
import { ArrowUpRight, Star, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <Link href={`/celebrity/${celebrity.slug}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="group relative h-[540px] rounded-[40px] overflow-hidden bg-slate-900 cursor-pointer shadow-2xl transition-all duration-500"
      >
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={celebrity.heroImage} 
            alt={celebrity.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0"
          />
          {/* Elegant Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* Top Navigation / Status */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
          <div className="flex gap-2">
            {celebrity.isFeatured && (
              <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                Featured
              </Badge>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary hover:border-primary">
            <ArrowUpRight size={24} />
          </div>
        </div>

        {/* Bottom Content Card */}
        <div className="absolute bottom-0 left-0 w-full p-10 z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0">
                  <img src={celebrity.avatarImage} alt={celebrity.name} className="w-full h-full object-cover" />
               </div>
               <div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                   <Star size={12} className="fill-primary" />
                   Verified
                 </div>
                 <h3 className="text-4xl font-display font-black text-white leading-none tracking-tight italic uppercase">{celebrity.name}</h3>
               </div>
            </div>
            
            <p className="text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
              {celebrity.bio}
            </p>

            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Membership</span>
                <span className="text-white text-xs font-black uppercase tracking-widest">StarPass Elite</span>
              </div>
              <Button variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-primary hover:border-primary px-6 font-bold text-xs uppercase tracking-widest h-10">
                Explore
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Interactive Border */}
        <div className="absolute inset-0 border border-white/5 group-hover:border-primary/50 transition-colors duration-500 rounded-[40px] pointer-events-none" />
      </motion.div>
    </Link>
  );
}
