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
  const [selectedCardType, setSelectedCardType] = useState<string>("digital");
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

  const tiers = [
    {
      id: "Gold",
      name: "Gold Member",
      price: "$500",
      yearlyPrice: "500.00",
      color: "from-yellow-400 to-yellow-600",
      features: [
        "Early access to tickets",
        "Digital Fan Card",
        "Monthly newsletter",
        "10% merchandise discount",
        "Member-only content"
      ]
    },
    {
      id: "Platinum",
      name: "Platinum VIP",
      price: "$2,000",
      yearlyPrice: "2000.00",
      color: "from-slate-300 to-slate-500",
      features: [
        "All Gold features",
        "Backstage tour raffle entries",
        "VIP event invitations",
        "20% merchandise discount",
        "Exclusive meet & greet opportunities"
      ]
    },
    {
      id: "Black",
      name: "Black Elite",
      price: "$5,000",
      yearlyPrice: "5000.00",
      color: "from-slate-800 to-black",
      features: [
        "All Platinum features",
        "Guaranteed meet & greet access",
        "Private virtual events",
        "Personal video message",
        "Lifetime memorabilia collection"
      ]
    }
  ];

  const onSubmit = (data: InsertFanCard) => {
    if (!celebrity) return;
    const selectedTierData = tiers.find(t => t.id === selectedTier);
    purchaseCard({ 
      ...data, 
      celebrityId: celebrity.id, 
      tier: selectedTier,
      cardType: selectedCardType,
      price: selectedTierData?.yearlyPrice || "500.00",
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
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full">
            Verified Fan Experience
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter italic mb-8">
            JOIN THE <br/> <span className="text-primary">{celebrity.name.toUpperCase()}</span> <br/>COMMUNITY.
          </h1>
          <p className="text-slate-500 text-xl mb-4 max-w-2xl mx-auto leading-relaxed font-medium">
            Become part of the inner circle. Get priority access to events, exclusive content, and a direct line to your favorite artist.
          </p>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
            Annual Subscription • Auto-Renews Yearly
          </p>
        </div>

        {/* Tier Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-8 text-center">
            CHOOSE YOUR TIER
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <motion.div
                key={tier.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedTier(tier.id)}
                className={clsx(
                  "relative p-8 rounded-[32px] border-4 transition-all cursor-pointer",
                  selectedTier === tier.id 
                    ? "bg-white border-primary shadow-2xl scale-105" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                {selectedTier === tier.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-wider shadow-lg">
                    Selected
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} mb-6 mx-auto`} />
                <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight text-center mb-2">
                  {tier.name}
                </h3>
                <div className="text-5xl font-black text-primary text-center mb-8">
                  {tier.price}
                  <span className="text-lg text-slate-400 font-normal">/year</span>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                      <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Card Type Selection */}
        <div className="mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-black text-slate-900 mb-8 text-center">
            CARD TYPE
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => setSelectedCardType("digital")}
              className={clsx(
                "p-8 rounded-[32px] border-4 transition-all cursor-pointer",
                selectedCardType === "digital"
                  ? "bg-white border-primary shadow-2xl"
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              <CreditCard className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-black text-xl text-slate-900 uppercase mb-2">Digital Card</h3>
              <p className="text-slate-600 text-sm font-medium mb-4">
                Instant access via mobile app. Use your card immediately after purchase.
              </p>
              <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-xs">
                Instant Delivery
              </Badge>
            </div>
            
            <div
              onClick={() => setSelectedCardType("physical")}
              className={clsx(
                "p-8 rounded-[32px] border-4 transition-all cursor-pointer",
                selectedCardType === "physical"
                  ? "bg-white border-primary shadow-2xl"
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-black text-xl text-slate-900 uppercase mb-2">Physical Card</h3>
              <p className="text-slate-600 text-sm font-medium mb-4">
                Premium metal card shipped to your address. Includes digital access.
              </p>
              <Badge className="bg-blue-50 text-blue-700 border-none font-black text-xs">
                Ships in 7-10 days
              </Badge>
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
            <CardHeader className="p-10 bg-slate-900 text-white">
              <CardTitle className="text-3xl font-display font-black italic uppercase">Complete Your Order</CardTitle>
              <CardDescription className="text-white/60 text-lg">
                You're getting the <span className="text-white font-bold">{selectedTier}</span> tier as a <span className="text-white font-bold">{selectedCardType}</span> card
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest text-slate-400">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-14 rounded-xl bg-slate-50 border-none font-bold text-lg" placeholder="Your Name" />
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
                        <FormLabel className="font-black text-xs uppercase tracking-widest text-slate-400">Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-14 rounded-xl bg-slate-50 border-none font-bold text-lg" placeholder="your@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Order Summary */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Tier:</span>
                      <span className="font-black text-slate-900">{selectedTier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Card Type:</span>
                      <span className="font-black text-slate-900 capitalize">{selectedCardType}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-900 font-black text-lg">Total (Annual):</span>
                        <span className="font-black text-3xl text-primary">
                          {tiers.find(t => t.id === selectedTier)?.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 font-medium">
                      This is an annual subscription that will automatically renew each year. You can cancel anytime from your dashboard.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-primary transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : "COMPLETE PURCHASE"}
                  </Button>

                  <p className="text-center text-xs text-slate-400 font-medium">
                    By purchasing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
