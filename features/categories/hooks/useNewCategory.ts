import { create } from "zustand";

type NewCategoryState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useNewCategory = create<NewCategoryState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useNewCategory;
