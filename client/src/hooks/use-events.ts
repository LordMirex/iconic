import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertEvent } from "@shared/schema";

export function useEvents(celebrityId?: number) {
  return useQuery({
    queryKey: [api.events.listByCelebrity.path, celebrityId],
    queryFn: async () => {
      if (!celebrityId) return [];
      const url = buildUrl(api.events.listByCelebrity.path, { id: celebrityId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.listByCelebrity.responses[200].parse(await res.json());
    },
    enabled: !!celebrityId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      // Ensure numeric fields are numbers (zod coerce handles this but being explicit helps)
      const payload = {
        ...data,
        celebrityId: Number(data.celebrityId),
        totalSlots: Number(data.totalSlots),
        price: data.price.toString() // decimal expects string or number
      };
      
      const res = await fetch(api.events.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.events.listByCelebrity.path, variables.celebrityId] 
      });
    },
  });
}
