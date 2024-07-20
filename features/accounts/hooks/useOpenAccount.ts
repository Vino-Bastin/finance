import { create } from "zustand";

type OpenAccountState = {
  id: string | undefined;
  isOpen: boolean;
  open: (id: string) => void;
  close: () => void;
};

const useOpenAccount = create<OpenAccountState>((set) => ({
  id: undefined,
  isOpen: false,
  open: (id: string) => set({ isOpen: true, id }),
  close: () => set({ isOpen: false, id: undefined }),
}));

export default useOpenAccount;
