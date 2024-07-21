import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import honoClient from "@/lib/hono";

const useGetTransactions = () => {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      try {
        const response = await honoClient.api.transactions.$get({
          query: { from, to, accountId },
        });
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const { transactions } = await response.json();
        return transactions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });

  return query;
};

export default useGetTransactions;
