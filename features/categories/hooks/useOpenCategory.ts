import { create } from "zustand";

type OpenCategoryState = {
  id: string | undefined;
  isOpen: boolean;
  open: (id: string) => void;
  close: () => void;
};

const useOpenCategory = create<OpenCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  open: (id: string) => set({ isOpen: true, id }),
  close: () => set({ isOpen: false, id: undefined }),
}));

export default useOpenCategory;
