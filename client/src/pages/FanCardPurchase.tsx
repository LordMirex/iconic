import { useCelebrity } from "@/hooks/use-celebrities";
import { usePurchaseFanCard } from "@/hooks/use-fancards";
import { useFanCardTiers } from "@/hooks/use-fan-card-tiers";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FanCardPurchase() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: celebrity, isLoading: loadingCeleb } = useCelebrity(slug);
  const { data: fanCardTiers, isLoading: loadingTiers } = useFanCardTiers();
  const { mutate: purchaseCard, isPending } = usePurchaseFanCard();
  const [selectedTier, setSelectedTier] = useState<string>("Gold");
  const [cardType, setCardType] = useState<string>("digital");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const form = useForm<InsertFanCard>({
    resolver: zodResolver(insertFanCardSchema),
    defaultValues: {
      celebrityId: 0,
      fanName: "",
      email: "",
      tier: "Gold",
      cardType: "digital",
      cardCode: "TEMP"
    }
  });

  const onSubmit = (data: InsertFanCard) => {
    if (!celebrity) return;
    purchaseCard({ 
      ...data, 
      celebrityId: celebrity.id, 
      tier: selectedTier,
      cardType: cardType,
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

  if (loadingCeleb || loadingTiers) {
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
            
            {/* Tier Selection */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">Select Your Tier</h3>
              <div className="grid gap-6">
                {fanCardTiers?.map(tier => {
                  const features = JSON.parse(tier.features);
                  const tierColorMap: Record<string, string> = {
                    Gold: "from-yellow-400 to-yellow-600",
                    Platinum: "from-slate-300 to-slate-500",
                    Black: "from-slate-800 to-black"
                  };
                  
                  return (
                    <motion.div 
                      key={tier.id} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "p-6 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden",
                        selectedTier === tier.name 
                          ? "bg-white border-primary shadow-2xl" 
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      )} 
                      onClick={() => setSelectedTier(tier.name)}
                    >
                      {selectedTier === tier.name && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tierColorMap[tier.name]} mb-4 shadow-lg`} />
                      <h4 className="font-display text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{tier.name}</h4>
                      <p className="text-slate-500 text-sm mb-4">{tier.description}</p>
                      <div className="text-4xl font-display font-black text-primary mb-6">${tier.basePrice}</div>
                      
                      <div className="space-y-3 border-t border-slate-200 pt-4">
                        {features.slice(0, 3).map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {features.length > 3 && (
                          <p className="text-slate-400 text-xs">+ {features.length - 3} more benefits</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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
                  
                  {/* Card Type Selection */}
                  <div className="space-y-3">
                    <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Card Type</FormLabel>
                    <RadioGroup value={cardType} onValueChange={setCardType} className="grid grid-cols-2 gap-4">
                      <div className={clsx(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        cardType === "digital" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                      )} onClick={() => setCardType("digital")}>
                        <RadioGroupItem value="digital" id="digital" className="hidden" />
                        <div className="flex items-center gap-3">
                          <CreditCard size={20} className="text-primary" />
                          <div>
                            <p className="font-bold text-slate-900">Digital</p>
                            <p className="text-xs text-slate-500">Instant access</p>
                          </div>
                        </div>
                      </div>
                      <div className={clsx(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        cardType === "physical" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                      )} onClick={() => setCardType("physical")}>
                        <RadioGroupItem value="physical" id="physical" className="hidden" />
                        <div className="flex items-center gap-3">
                          <Sparkles size={20} className="text-primary" />
                          <div>
                            <p className="font-bold text-slate-900">Physical</p>
                            <p className="text-xs text-slate-500">Ships in 7-10 days</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
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
