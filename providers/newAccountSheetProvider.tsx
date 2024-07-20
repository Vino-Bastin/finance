"use client";

import EditAccountSheet from "@/features/accounts/components/editAccountSheet";
import NewAccountSheet from "@/features/accounts/components/newAccountSheet";

const NewAccountSheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};

export default NewAccountSheetProvider;
