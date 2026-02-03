import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCelebrity } from "@shared/schema";

export function useCelebrities() {
  return useQuery({
    queryKey: [api.celebrities.list.path],
    queryFn: async () => {
      const res = await fetch(api.celebrities.list.path);
      if (!res.ok) throw new Error("Failed to fetch celebrities");
      return api.celebrities.list.responses[200].parse(await res.json());
    },
  });
}

export function useCelebrity(slug: string) {
  return useQuery({
    queryKey: [api.celebrities.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.celebrities.get.path, { slug });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Celebrity not found");
      return api.celebrities.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function useCreateCelebrity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCelebrity) => {
      const res = await fetch(api.celebrities.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create celebrity");
      return api.celebrities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.celebrities.list.path] });
    },
  });
}
