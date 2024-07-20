import { Loader2 } from "lucide-react";

import useOpenAccount from "@/features/accounts/hooks/useOpenAccount";
import useGetAccount from "@/features/accounts/api/useGetAccount";
import useEditAccount from "@/features/accounts/api/useEditAccount";
import useDeleteAccount from "@/features/accounts/api/useDeleteAccount";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm, {
  AccountFormType,
} from "@/features/accounts/components/accountForm";
import useConfirm from "@/hooks/useConfirm";

const EditAccountSheet = () => {
  const { close, isOpen, id } = useOpenAccount();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Your about to delete this account. This action cannot be undone."
  );

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const onSubmit = (values: AccountFormType) => {
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
  const isLoading = accountQuery.isLoading;
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit an existing account to keep track of your expenses.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
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

export default EditAccountSheet;
