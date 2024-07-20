"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import useConfirm from "@/hooks/useConfirm";
import useOpenAccount from "@/features/accounts/hooks/useOpenAccount";
import useDeleteAccount from "@/features/accounts/api/useDeleteAccount";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
};

const Actions = ({ id }: Props) => {
  const { open } = useOpenAccount();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Your about to delete this account. This action cannot be undone."
  );

  const deleteMutation = useDeleteAccount(id);

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => open(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={onDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
