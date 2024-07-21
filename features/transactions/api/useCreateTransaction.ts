import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type CreateTransactionRequest = InferRequestType<
  typeof honoClient.api.transactions.$post
>["json"];

export type CreateTransactionResponse = InferResponseType<
  typeof honoClient.api.transactions.$post
>;

const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateTransactionResponse,
    Error,
    CreateTransactionRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create transaction");
    },
  });
  return mutation;
};

export default useCreateTransaction;
