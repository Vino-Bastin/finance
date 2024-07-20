import { useQuery } from "@tanstack/react-query";

import honoClient from "@/lib/hono";

const useGetAccount = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      try {
        const response = await honoClient.api.accounts[":id"].$get({
          param: { id },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch account");
        }
        const { account } = await response.json();
        return account;
      } catch (error) {
        console.error(error);
      }
    },
  });

  return query;
};

export default useGetAccount;
