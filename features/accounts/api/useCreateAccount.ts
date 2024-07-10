import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "../../../lib/hono";

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
    mutationFn: async (data) => {
      const response = await honoClient.api.accounts.$post({
        json: data,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Account created");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: () => {
      toast.error("Failed to create account");
    },
  });
  return mutation;
};

export default useCreateAccount;
