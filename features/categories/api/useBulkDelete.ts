import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type BulkDeleteRequest = InferRequestType<
  (typeof honoClient.api.categories)["bulk-delete"]["$post"]
>["json"];

export type BulkDeleteResponse = InferResponseType<
  (typeof honoClient.api.categories)["bulk-delete"]["$post"]
>;

const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<BulkDeleteResponse, Error, BulkDeleteRequest>({
    mutationFn: async (json) => {
      const response = await honoClient.api.categories["bulk-delete"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Categories deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete categories");
    },
  });
  return mutation;
};

export default useBulkDeleteCategories;
