import { useCelebrity } from "@/hooks/use-celebrities";
import { usePurchaseFanCard } from "@/hooks/use-fancards";
import { Navbar } from "@/components/Navbar";
import { useParams } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, CreditCard } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFanCardSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertFanCardSchema.pick({ email: true, tier: true }).extend({
  celebrityId: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function FanCardPurchase() {
  const { slug } = useParams<{ slug: string }>();
  const { data: celebrity } = useCelebrity(slug);
  const { mutate, isPending } = usePurchaseFanCard();
  const [selectedTier, setSelectedTier] = useState<string>("Gold");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tier: "Gold",
    }
  });

  const tiers = [
    {
      id: "Gold",
      name: "Gold Member",
      price: "$29/year",
      color: "from-yellow-400 to-yellow-600",
      features: ["Early access to tickets", "Digital Fan Card", "Monthly newsletter"]
    },
    {
      id: "Platinum",
      name: "Platinum VIP",
      price: "$99/year",
      color: "from-slate-300 to-slate-500",
      features: ["All Gold features", "Backstage meet & greet raffle", "Exclusive merchandise discount"]
    },
    {
      id: "Black",
      name: "Black Elite",
      price: "$299/year",
      color: "from-slate-800 to-black",
      features: ["All Platinum features", "Private event invites", "Personalized video message"]
    }
  ];

  const onSubmit = (data: FormData) => {
    if (!celebrity) return;
    mutate({ ...data, celebrityId: celebrity.id, tier: selectedTier });
  };

  if (!celebrity) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">Select Your Membership</h1>
            <p className="text-slate-600">Join the {celebrity.name} official fan club today.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tiers.map((tier) => (
              <div 
                key={tier.id}
                onClick={() => {
                  setSelectedTier(tier.id);
                  setValue("tier", tier.id);
                }}
                className={clsx(
                  "relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2",
                  selectedTier === tier.id 
                    ? "border-primary shadow-xl scale-105 bg-white z-10" 
                    : "border-transparent bg-white shadow-sm hover:shadow-md opacity-80 hover:opacity-100"
                )}
              >
                {selectedTier === tier.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    SELECTED
                  </div>
                )}
                
                {/* Visual Card Representation */}
                <div className={`h-32 rounded-xl bg-gradient-to-br ${tier.color} mb-6 shadow-inner flex flex-col justify-between p-4 text-white`}>
                  <div className="flex justify-between items-start">
                    <span className="font-display font-bold text-lg opacity-90">StarPass</span>
                    <span className="text-xs opacity-75">{tier.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">{celebrity.name}</div>
                    <div className="font-mono text-sm tracking-widest opacity-90">•••• •••• ••••</div>
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold mb-1">{tier.name}</h3>
                <div className="text-xl text-slate-500 font-medium mb-6">{tier.price}</div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
            <h3 className="font-display text-2xl font-bold mb-6">Complete Purchase</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  {...register("email")}
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Payment Method</div>
                  <div className="text-xs text-slate-500">Secure checkout via Stripe</div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Processing...
                  </span>
                ) : (
                  `Pay & Join as ${selectedTier} Member`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
