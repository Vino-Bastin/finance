import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type DeleteCategoryResponse = InferResponseType<
  (typeof honoClient.api.categories)[":id"]["$delete"]
>;

const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteCategoryResponse, Error>({
    mutationFn: async () => {
      const response = await honoClient.api.categories[":id"]["$delete"]({
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete category");
    },
  });
  return mutation;
};

export default useDeleteCategory;
