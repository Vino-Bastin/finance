import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type BulkDeleteRequest = InferRequestType<
  (typeof honoClient.api.transactions)["bulk-delete"]["$post"]
>["json"];

export type BulkDeleteResponse = InferResponseType<
  (typeof honoClient.api.transactions)["bulk-delete"]["$post"]
>;

const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<BulkDeleteResponse, Error, BulkDeleteRequest>({
    mutationFn: async (json) => {
      const response = await honoClient.api.transactions["bulk-delete"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete transactions");
    },
  });
  return mutation;
};

export default useBulkDeleteTransactions;
