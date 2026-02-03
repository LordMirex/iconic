import { Navbar } from "@/components/Navbar";
import { useFanLogin } from "@/hooks/use-fancards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fanLoginSchema, type FanLoginRequest } from "@shared/schema";
import { Loader2, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Login() {
  const { mutate, isPending, error } = useFanLogin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<FanLoginRequest>({
    resolver: zodResolver(fanLoginSchema),
    defaultValues: {
      email: "",
      cardCode: ""
    }
  });

  const onSubmit = (data: FanLoginRequest) => {
    mutate(data, {
      onSuccess: (user) => {
        localStorage.setItem("fan_id", user.id.toString());
        toast({
          title: "Welcome back!",
          description: "Successfully logged into your fan dashboard.",
        });
        setLocation("/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-5xl border-none shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-3xl">
          
          {/* Left Side - Visual Content */}
          <div className="w-full md:w-5/12 bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium mb-6">
                <ShieldCheck size={14} className="text-primary" />
                Secure Fan Access
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">Your Pass to the Extraordinary</h2>
              <p className="text-white/60 text-lg leading-relaxed">Unlock exclusive moments and VIP experiences with your digital membership.</p>
            </div>

            <div className="relative z-10 my-8">
              <motion.div 
                initial={{ rotateY: 0, y: 0 }}
                animate={{ rotateY: 15, y: -10 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
                className="w-full aspect-[1.58] rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-2xl p-6 flex flex-col justify-between border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Fan Membership</span>
                    <span className="font-display font-black text-2xl text-white italic">STARPASS</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-white text-xl tracking-[0.2em] drop-shadow-lg">
                    •••• •••• •••• 8842
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-white/60 font-medium">VIP MEMBER</span>
                    <span className="text-[8px] text-white/40">ICONIC PLATFORM</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 text-sm text-white/50">
              New fan? <Link href="/" className="text-white hover:text-primary transition-colors font-medium">Browse icons to join</Link>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <CardContent className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">Welcome Back</h1>
              <p className="text-slate-500">Sign in to access your digital card and bookings.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-slate-700">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input 
                            {...field}
                            type="email" 
                            className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-primary/20 transition-all text-base"
                            placeholder="alex@example.com"
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardCode"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-slate-700">Fan Card Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input 
                            {...field}
                            className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-primary/20 transition-all font-mono text-lg uppercase"
                            placeholder="XXXX-XXXX"
                            data-testid="input-cardcode"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium"
                  >
                    {error.message}
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-200 transition-all group"
                  data-testid="button-login"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Enter Dashboard
                      <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Platform Status: Operational
              </div>
              <div className="hover:text-slate-900 cursor-pointer transition-colors">Forgot your code?</div>
            </div>
          </CardContent>

        </Card>
      </div>
    </div>
  );
}
