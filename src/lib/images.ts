import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "./api";

export const useImages = () => {
  const queryClient = useQueryClient();

  const myUploadedCats = useQuery<
    {
      id: string;
      url: string;
      created_at: string;
    }[]
  >({
    queryKey: ["myUploadedCats"],
    queryFn: () => api("/images?limit=50&size=med"),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      api(`/images/${imageId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUploadedCats"] });
    },
  });

  return {
    myUploadedCats,
    deleteImageMutation,
  };
};
