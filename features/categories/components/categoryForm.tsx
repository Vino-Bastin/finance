import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { insertCategorySchema } from "@/db/schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const categoryFormSchema = insertCategorySchema.pick({
  name: true,
});

export type CategoryFormType = z.input<typeof categoryFormSchema>;

type Props = {
  id?: string;
  defaultValues?: CategoryFormType;
  onSubmit: (values: CategoryFormType) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: CategoryFormType) => onSubmit(values);
  const handleDelete = () => onDelete?.();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. food, electronics, etc."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Category"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Trash className="size-4" />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CategoryForm;
