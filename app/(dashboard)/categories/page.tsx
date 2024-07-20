"use client";
import { Loader2, Plus } from "lucide-react";

import useNewCategory from "@/features/categories/hooks/useNewCategory";
import useGetCategories from "@/features/categories/api/useGetCategories";
import useBulkDeleteCategories from "@/features/categories/api/useBulkDelete";
import { columns } from "./columns";

import { DataTable } from "@/components/dataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesPage = () => {
  const { open } = useNewCategory();
  const categoriesQuery = useGetCategories();
  const bulkDeleteCategories = useBulkDeleteCategories();
  const categories = categoriesQuery.data || [];

  const isDisabled =
    categoriesQuery.isLoading || bulkDeleteCategories.isPending;

  if (categoriesQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="w-48 h-8" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Categories</CardTitle>
          <Button
            size="sm"
            className="flex items-center justify-center gap-2"
            onClick={open}
          >
            <Plus className="size-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteCategories.mutate({ ids });
            }}
            filterKey="name"
            columns={columns}
            data={categories}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
