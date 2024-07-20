import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import honoClient from "@/lib/hono";

export type DeleteAccountResponse = InferResponseType<
  (typeof honoClient.api.accounts)[":id"]["$delete"]
>;

const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteAccountResponse, Error>({
    mutationFn: async () => {
      const response = await honoClient.api.accounts[":id"]["$delete"]({
        param: {
          id,
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["account", { id }],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete account");
    },
  });
  return mutation;
};

export default useDeleteAccount;
