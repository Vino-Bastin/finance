import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type CreateCategoryRequest = InferRequestType<
  typeof honoClient.api.categories.$post
>["json"];

export type CreateCategoryResponse = InferResponseType<
  typeof honoClient.api.categories.$post
>;

const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateCategoryResponse,
    Error,
    CreateCategoryRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create category");
    },
  });
  return mutation;
};

export default useCreateCategory;
