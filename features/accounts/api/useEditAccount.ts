import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type EditAccountRequest = InferRequestType<
  (typeof honoClient.api.accounts)[":id"]["$patch"]
>["json"];

export type EditAccountResponse = InferResponseType<
  (typeof honoClient.api.accounts)[":id"]["$patch"]
>;

const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<EditAccountResponse, Error, EditAccountRequest>({
    mutationFn: async (json) => {
      const response = await honoClient.api.accounts[":id"]["$patch"]({
        json,
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["account", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to edit account");
    },
  });
  return mutation;
};

export default useEditAccount;
