import { useCelebrity } from "@/hooks/use-celebrities";
import { usePurchaseFanCard } from "@/hooks/use-fancards";
import { Navbar } from "@/components/Navbar";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, CreditCard, ShieldCheck, Sparkles, CheckCircle2, Crown, Mail, User } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFanCardSchema, type InsertFanCard } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function FanCardPurchase() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: celebrity, isLoading: loadingCeleb } = useCelebrity(slug);
  const { mutate: purchaseCard, isPending } = usePurchaseFanCard();
  const [selectedTier, setSelectedTier] = useState<string>("Gold");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const form = useForm<InsertFanCard>({
    resolver: zodResolver(insertFanCardSchema),
    defaultValues: {
      celebrityId: 0,
      fanName: "",
      email: "",
      tier: "Gold",
      cardCode: "TEMP"
    }
  });

  const tiers = [
    {
      id: "Gold",
      name: "Gold Member",
      price: "$29",
      color: "from-yellow-400 to-yellow-600",
      features: ["Early access to tickets", "Digital Fan Card", "Monthly newsletter"]
    },
    {
      id: "Platinum",
      name: "Platinum VIP",
      price: "$99",
      color: "from-slate-300 to-slate-500",
      features: ["All Gold features", "Backstage raffle", "Merch discounts"]
    },
    {
      id: "Black",
      name: "Black Elite",
      price: "$299",
      color: "from-slate-800 to-black",
      features: ["All Platinum features", "Private events", "Personal video message"]
    }
  ];

  const onSubmit = (data: InsertFanCard) => {
    if (!celebrity) return;
    purchaseCard({ 
      ...data, 
      celebrityId: celebrity.id, 
      tier: selectedTier,
      cardCode: `${celebrity.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2,7).toUpperCase()}`
    }, {
      onSuccess: (newCard) => {
        setGeneratedCode(newCard.cardCode);
        setIsSuccess(true);
        toast({
          title: "Welcome to the Inner Circle!",
          description: "Your membership is now active.",
        });
      }
    });
  };

  if (loadingCeleb) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  if (!celebrity) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-display font-black text-white italic tracking-tight mb-2 uppercase">SUCCESSFUL</h2>
                  <p className="text-white/60 text-lg">You are now a {selectedTier} member of the {celebrity.name} family.</p>
                </div>
              </div>
              
              <CardContent className="p-10 md:p-16 bg-white">
                <div className="mb-12 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Your Card Code</p>
                  <div className="text-4xl font-mono font-black text-slate-900 tracking-[0.3em] bg-slate-50 py-6 rounded-2xl border-2 border-dashed border-slate-200">
                    {generatedCode}
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation("/login")}
                  className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 shadow-xl transition-all"
                >
                  GO TO LOGIN
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full">
              Verified Fan Experience
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter italic mb-8">
              JOIN THE <br/> <span className="text-primary">{celebrity.name.toUpperCase()}</span> <br/>COMMUNITY.
            </h1>
            <p className="text-slate-500 text-lg mb-12 max-w-lg leading-relaxed font-medium">
              Become part of the inner circle. Get priority access to events, exclusive content, and a direct line to your favorite artists.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 mt-12">
               {tiers.map(tier => (
                 <div key={tier.id} className={clsx(
                   "p-6 rounded-[32px] border-2 transition-all cursor-pointer",
                   selectedTier === tier.id ? "bg-white border-primary shadow-xl" : "bg-slate-50 border-transparent opacity-60"
                 )} onClick={() => setSelectedTier(tier.id)}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} mb-4`} />
                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{tier.name}</h4>
                    <p className="text-2xl font-display font-black text-primary mt-1">{tier.price}</p>
                 </div>
               ))}
            </div>
          </div>

          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
            <CardHeader className="p-10 bg-slate-900 text-white">
               <CardTitle className="text-3xl font-display font-black italic uppercase">Get Your Pass</CardTitle>
               <CardDescription className="text-white/40">Enter your details to generate your digital membership.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-14 rounded-xl bg-slate-50 border-none font-bold" placeholder="Your Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-14 rounded-xl bg-slate-50 border-none font-bold" placeholder="Email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isPending} className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-primary transition-all shadow-xl">
                    {isPending ? <Loader2 className="animate-spin" /> : "COMPLETE JOINING"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
