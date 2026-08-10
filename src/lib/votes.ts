import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "./api";

export type Vote = {
  id: string | number;
  image_id: string;
  sub_id: string;
  created_at: string;
  value: number;
  image?: {
    id: string;
    url: string;
  };
};

export const SUB_ID = "rico_shiva";

export const useVotes = () => {
  const queryClient = useQueryClient();

  const voteQuery = useQuery<Vote[]>({
    queryKey: ["votes"],
    queryFn: () => api("https://api.thecatapi.com/v1/votes?limit=50"),
  });

  const rate = useMutation({
    mutationFn: ({ imageId, value }: { imageId: string; value: number }) =>
      api("https://api.thecatapi.com/v1/votes", {
        method: "POST",
        body: {
          sub_id: SUB_ID,
          image_id: imageId,
          value: String(value),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });

  return {
    voteQuery,
    rate,
  };
};
