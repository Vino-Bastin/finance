"use client";
import { Loader2, Plus } from "lucide-react";

import useNewAccount from "../../../features/accounts/hooks/useNewAccount";
import useGetAccounts from "../../../features/accounts/api/useGetAccounts";
import useBulkDeleteAccount from "../../../features/accounts/api/useBulkDelete";
import { columns } from "./columns";

import { DataTable } from "../../../components/dataTable";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

const AccountsPage = () => {
  const { open } = useNewAccount();
  const accountsQuery = useGetAccounts();
  const bulkDeleteAccount = useBulkDeleteAccount();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || accountsQuery.isPending;

  if (accountsQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Accounts</CardTitle>
          <Button
            size="sm"
            className="flex items-center justify-center gap-2"
            onClick={open}
          >
            <Plus className="size-4" />
            Add account
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteAccount.mutate({ ids });
            }}
            filterKey="name"
            columns={columns}
            data={accounts}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
