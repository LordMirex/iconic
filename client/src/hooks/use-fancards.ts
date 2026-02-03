import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertFanCard, type FanLoginRequest } from "@shared/schema";
import { useLocation } from "wouter";

export function useFanCard(id?: number) {
  return useQuery({
    queryKey: [api.fanCards.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.fanCards.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch fan card");
      return api.fanCards.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function usePurchaseFanCard() {
  const [, setLocation] = useLocation();
  return useMutation({
    mutationFn: async (data: InsertFanCard) => {
      const res = await fetch(api.fanCards.purchase.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to purchase fan card");
      return api.fanCards.purchase.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Auto-login after purchase for demo purposes
      localStorage.setItem("fan_token", "demo-token");
      localStorage.setItem("fan_id", String(data.id));
      setLocation("/dashboard");
    },
  });
}

export function useFanLogin() {
  const [, setLocation] = useLocation();
  return useMutation({
    mutationFn: async (data: FanLoginRequest) => {
      const res = await fetch(api.fanCards.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      return api.fanCards.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      localStorage.setItem("fan_token", data.token);
      localStorage.setItem("fan_id", String(data.fanCard.id));
      setLocation("/dashboard");
    },
  });
}
