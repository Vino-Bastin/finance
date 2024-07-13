import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "../../../lib/hono";

export type CreateAccountRequest = InferRequestType<
  (typeof honoClient.api.accounts)["bulk-delete"]["$post"]
>["json"];

export type CreateAccountResponse = InferResponseType<
  (typeof honoClient.api.accounts)["bulk-delete"]["$post"]
>;

const useBulkDeleteAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateAccountResponse,
    Error,
    CreateAccountRequest
  >({
    mutationFn: async (json) => {
      const response = await honoClient.api.accounts["bulk-delete"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Accounts Deleted");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete accounts");
    },
  });
  return mutation;
};

export default useBulkDeleteAccount;
