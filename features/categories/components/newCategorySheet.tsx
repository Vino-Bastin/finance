import useNewCategory from "@/features/categories/hooks/useNewCategory";
import useCreateCategory from "@/features/categories/api/useCreateCategory";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import CategoryForm, {
  CategoryFormType,
} from "@/features/categories/components/categoryForm";

const NewCategorySheet = () => {
  const { close, isOpen } = useNewCategory();
  const mutation = useCreateCategory();

  const onSubmit = (values: CategoryFormType) => {
    mutation.mutate(values, {
      onSuccess: () => close(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
