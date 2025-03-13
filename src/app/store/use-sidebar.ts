import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  toggle: () => void;
  setInitialState: (state: boolean) => void;
};

const initialState = typeof window !== 'undefined' 
  ? localStorage.getItem('sidebarState') === 'true'
  : false;

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: initialState,
  toggle: () => set((state) => {
    const newState = !state.isOpen;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarState', String(newState));
    }
    return { isOpen: newState };
  }),
  setInitialState: (state: boolean) => set({ isOpen: state }),
}));
