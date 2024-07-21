import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type DeleteTransactionResponse = InferResponseType<
  (typeof honoClient.api.transactions)[":id"]["$delete"]
>;

const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteTransactionResponse, Error>({
    mutationFn: async () => {
      const response = await honoClient.api.transactions[":id"]["$delete"]({
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transaction", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete transaction");
    },
  });
  return mutation;
};

export default useDeleteTransaction;
