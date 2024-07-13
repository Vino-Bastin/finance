import useNewAccount from "../hooks/useNewAccount";
import useCreateAccount from "../api/useCreateAccount";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import AccountForm, { AccountFormType } from "./accountForm";

const NewAccountSheet = () => {
  const { close, isOpen } = useNewAccount();
  const mutation = useCreateAccount();

  const onSubmit = (values: AccountFormType) => {
    mutation.mutate(values, {
      onSuccess: () => close(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
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

export default NewAccountSheet;
