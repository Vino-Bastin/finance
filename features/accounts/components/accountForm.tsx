import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { insertAccountSchema } from "@/db/schema";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";

const accountFormSchema = insertAccountSchema.pick({
  name: true,
});

export type AccountFormType = z.input<typeof accountFormSchema>;

type Props = {
  id?: string;
  defaultValues?: AccountFormType;
  onSubmit: (values: AccountFormType) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: AccountFormType) => onSubmit(values);
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
                  placeholder="e.g. Cash, Bank Account, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Account"}
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
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AccountForm;
