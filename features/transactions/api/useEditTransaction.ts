import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type EditTransactionRequest = InferRequestType<
  (typeof honoClient.api.transactions)[":id"]["$patch"]
>["json"];

export type EditTransactionResponse = InferResponseType<
  (typeof honoClient.api.transactions)[":id"]["$patch"]
>;

const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EditTransactionResponse,
    Error,
    EditTransactionRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.transactions[":id"]["$patch"]({
        json,
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transaction", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to edit transaction");
    },
  });
  return mutation;
};

export default useEditTransaction;
