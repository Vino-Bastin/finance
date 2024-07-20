"use client";

import EditCategorySheet from "@/features/categories/components/editCategorySheet";
import NewCategorySheet from "@/features/categories/components/newCategorySheet";

const NewCategorySheetProvider = () => {
  return (
    <>
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};

export default NewCategorySheetProvider;
