import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type EditCategoryRequest = InferRequestType<
  (typeof honoClient.api.categories)[":id"]["$patch"]
>["json"];

export type EditCategoryResponse = InferResponseType<
  (typeof honoClient.api.categories)[":id"]["$patch"]
>;

const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EditCategoryResponse,
    Error,
    EditCategoryRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.categories[":id"]["$patch"]({
        json,
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to edit category");
    },
  });
  return mutation;
};

export default useEditCategory;
