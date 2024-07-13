import { create } from "zustand";

type NewAccountState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useNewAccount = create<NewAccountState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useNewAccount;
