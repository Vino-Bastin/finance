import { Loader2 } from "lucide-react";

import useNewTransaction from "@/features/transactions/hooks/useNewTransaction";
import useCreateTransaction from "@/features/transactions/api/useCreateTransaction";
import useCreateCategory from "@/features/categories/api/useCreateCategory";
import useGetCategories from "@/features/categories/api/useGetCategories";
import useGetAccounts from "@/features/accounts/api/useGetAccounts";
import useCreateAccount from "@/features/accounts/api/useCreateAccount";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TransactionForm, {
  ApiTransactionFormType,
} from "@/features/transactions/components/transactionForm";

const NewTransactionSheet = () => {
  const { close, isOpen } = useNewTransaction();

  const createTransactionMutation = useCreateTransaction();
  const onSubmit = (values: ApiTransactionFormType) => {
    createTransactionMutation.mutate(values, {
      onSuccess: () => close(),
    });
  };

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const isPending =
    createTransactionMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction for your account.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className=" absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
