import { Loader2 } from "lucide-react";

import useOpenCategory from "@/features/categories/hooks/useOpenCategory";
import useGetCategory from "@/features/categories/api/useGetCategory";
import useEditCategory from "@/features/categories/api/useEditCategory";
import useDeleteCategory from "@/features/categories/api/useDeleteCategory";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryForm, {
  CategoryFormType,
} from "@/features/categories/components/categoryForm";
import useConfirm from "@/hooks/useConfirm";

const EditCategorySheet = () => {
  const { close, isOpen, id } = useOpenCategory();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Your about to delete this category. This action cannot be undone."
  );

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const onSubmit = (values: CategoryFormType) => {
    editMutation.mutate(values, {
      onSuccess: () => close(),
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => close(),
      });
    }
  };
  const isLoading = categoryQuery.isLoading;
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit an existing category to better organize your transactions.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditCategorySheet;
