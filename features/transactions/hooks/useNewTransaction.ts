import { create } from "zustand";

type NewTransactionState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useNewTransaction;
