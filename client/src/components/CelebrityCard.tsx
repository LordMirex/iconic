import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Celebrity } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface CelebrityCardProps {
  celebrity: Celebrity;
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <Link href={`/celebrity/${celebrity.slug}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-xl"
      >
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={celebrity.heroImage} 
            alt={celebrity.name} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105 transform"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-display text-3xl font-bold text-white mb-2">{celebrity.name}</h3>
            <p className="text-white/80 line-clamp-2 mb-4 text-sm font-light leading-relaxed">
              {celebrity.bio}
            </p>
            <div className="flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              <span>View Profile</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
