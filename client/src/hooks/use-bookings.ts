import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBooking } from "@shared/schema";

export function useBookings(fanCardId?: number) {
  return useQuery({
    queryKey: [api.bookings.listByFan.path, fanCardId],
    queryFn: async () => {
      if (!fanCardId) return [];
      const url = buildUrl(api.bookings.listByFan.path, { id: fanCardId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.listByFan.responses[200].parse(await res.json());
    },
    enabled: !!fanCardId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await fetch(api.bookings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to book event");
      }
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.bookings.listByFan.path, variables.fanCardId] 
      });
      // Also invalidate events to update slot counts
      queryClient.invalidateQueries({ queryKey: [api.events.listByCelebrity.path] });
    },
  });
}
