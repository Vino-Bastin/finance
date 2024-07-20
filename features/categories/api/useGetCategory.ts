import { useQuery } from "@tanstack/react-query";

import honoClient from "@/lib/hono";

const useGetCategory = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      try {
        const response = await honoClient.api.categories[":id"].$get({
          param: { id },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }
        const { category } = await response.json();
        return category;
      } catch (error) {
        console.error(error);
      }
    },
  });

  return query;
};

export default useGetCategory;
