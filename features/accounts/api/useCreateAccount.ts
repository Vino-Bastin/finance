import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type CreateAccountRequest = InferRequestType<
  typeof honoClient.api.accounts.$post
>["json"];

export type CreateAccountResponse = InferResponseType<
  typeof honoClient.api.accounts.$post
>;

const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateAccountResponse,
    Error,
    CreateAccountRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.accounts.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account created");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create account");
    },
  });
  return mutation;
};

export default useCreateAccount;
