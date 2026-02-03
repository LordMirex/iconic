import { Navbar } from "@/components/Navbar";
import { useFanLogin } from "@/hooks/use-fancards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fanLoginSchema, type FanLoginRequest } from "@shared/schema";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Login() {
  const { mutate, isPending, error } = useFanLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FanLoginRequest>({
    resolver: zodResolver(fanLoginSchema)
  });

  const onSubmit = (data: FanLoginRequest) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Visual */}
          <div className="w-full md:w-1/2 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-white/60">Access your digital membership card, bookings, and exclusive content.</p>
            </div>

            <div className="relative z-10 my-12">
              <motion.div 
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 10 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
                className="w-full aspect-[1.58] rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl p-6 flex flex-col justify-between border border-white/10"
              >
                <div className="flex justify-between items-start">
                  <span className="font-display font-bold text-xl text-white drop-shadow-md">StarPass</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                </div>
                <div className="font-mono text-white/90 text-lg tracking-widest drop-shadow-md">
                  •••• •••• •••• 4291
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 text-xs text-white/40">
              Don't have a card yet? <Link href="/" className="text-white hover:underline">Browse Celebrities</Link>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Fan Login</h1>
              <p className="text-slate-500">Enter your card details to continue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  {...register("email")}
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Card Code</label>
                <input 
                  {...register("cardCode")}
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                  placeholder="XXXX-XXXX"
                />
                {errors.cardCode && <span className="text-xs text-red-500">{errors.cardCode.message}</span>}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                  {error.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <>Access Dashboard <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
