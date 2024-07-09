import { useQuery } from "@tanstack/react-query";

import honoClient from "../../../lib/hono";

const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const response = await honoClient.api.accounts.$get();
            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }

            return await response.json();
        },
    });

    return query;
};

export default useGetAccounts;
