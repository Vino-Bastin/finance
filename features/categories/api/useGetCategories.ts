import { useQuery } from "@tanstack/react-query";

import honoClient from "@/lib/hono";

const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await honoClient.api.categories.$get();
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const { categories } = await response.json();
        return categories;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });

  return query;
};

export default useGetCategories;
