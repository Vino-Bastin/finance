import { useQuery } from "@tanstack/react-query";

import honoClient from "../../../lib/hono";

const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const response = await honoClient.api.accounts.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const { accounts } = await response.json();
        return accounts;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });

  return query;
};

export default useGetAccounts;
