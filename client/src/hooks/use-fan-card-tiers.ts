import { useQuery } from "@tanstack/react-query";
import { type FanCardTier } from "@shared/schema";

export function useFanCardTiers() {
  return useQuery({
    queryKey: ["/api/fan-card-tiers"],
    queryFn: async () => {
      const res = await fetch("/api/fan-card-tiers");
      if (!res.ok) throw new Error("Failed to fetch fan card tiers");
      const data = await res.json();
      return data as FanCardTier[];
    },
  });
}
