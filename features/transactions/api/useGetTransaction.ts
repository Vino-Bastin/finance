import { useQuery } from "@tanstack/react-query";

import honoClient from "@/lib/hono";

const useGetTransaction = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      try {
        const response = await honoClient.api.transactions[":id"].$get({
          param: { id },
        });
        if (!response.ok) throw new Error("Failed to fetch transaction");

        const { transaction } = await response.json();
        return transaction;
      } catch (error) {
        console.error(error);
      }
    },
  });

  return query;
};

export default useGetTransaction;
