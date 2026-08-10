import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "./api";

type Favourite = {
  id: string;
  image_id: string;
  image: {
    id: string;
    url: string;
  };
};

export const useFavourites = () => {
  const queryClient = useQueryClient();

  const favouriteQuery = useQuery<Favourite[]>({
    queryKey: ["favourites"],
    queryFn: () => api(`/favourites?limit=50&attach_image=1&page=0&order=DESC`),
  });

  const addFavourite = useMutation({
    mutationFn: (id: string) =>
      api("/favourites", {
        method: "POST",
        body: {
          image_id: id,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });

  const removeFavourite = useMutation({
    mutationFn: (id: string) =>
      api(`/favourites/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });

  return {
    favouriteQuery,
    addFavourite,
    removeFavourite,
  };
};
