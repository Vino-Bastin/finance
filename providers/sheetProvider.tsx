"use client";

import EditAccountSheet from "@/features/accounts/components/editAccountSheet";
import NewAccountSheet from "@/features/accounts/components/newAccountSheet";

import EditCategorySheet from "@/features/categories/components/editCategorySheet";
import NewCategorySheet from "@/features/categories/components/newCategorySheet";

import NewTransactionSheet from "@/features/transactions/components/newTransactionSheet";

const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionSheet />
    </>
  );
};

export default SheetProvider;
