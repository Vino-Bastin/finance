import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type BulkCreateRequest = InferRequestType<
  (typeof honoClient.api.transactions)["bulk-create"]["$post"]
>["json"];

export type BulkCreateResponse = InferResponseType<
  (typeof honoClient.api.transactions)["bulk-create"]["$post"]
>;

const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<BulkCreateResponse, Error, BulkCreateRequest>({
    mutationFn: async (json) => {
      const response = await honoClient.api.transactions["bulk-create"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions created successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create transactions");
    },
  });
  return mutation;
};

export default useBulkCreateTransactions;
