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
        whileHover={{ y: -4 }}
        className="group relative h-[420px] rounded-3xl overflow-hidden bg-white cursor-pointer shadow-sm transition-all hover:shadow-2xl border border-slate-100"
      >
        {/* Image Container */}
        <div className="absolute inset-x-4 inset-t-4 h-[240px] rounded-2xl overflow-hidden z-0">
          <img 
            src={celebrity.heroImage} 
            alt={celebrity.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute top-[260px] inset-x-0 p-6 z-10">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0">
                <img src={celebrity.avatarImage} alt={celebrity.name} className="w-full h-full object-cover" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-900 leading-none">{celebrity.name}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Official Profile</p>
             </div>
          </div>
          
          <p className="text-slate-600 text-sm line-clamp-2 font-medium mb-4">
            {celebrity.bio}
          </p>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 no-default-hover-elevate">
              Experience
            </Badge>
            <div className="flex items-center gap-1 text-primary">
              <span className="text-xs font-bold">VIEW MORE</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
