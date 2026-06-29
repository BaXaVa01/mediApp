import { create } from 'zustand';

interface SelectedProfileState {
  selectedId: string | null;
  selectedType: 'doctor' | 'clinic' | null;
  routingTarget: string | null; // ID of the doctor/clinic to route to
  setSelected: (id: string, type: 'doctor' | 'clinic') => void;
  setRoutingTarget: (id: string | null) => void;
  clearSelected: () => void;
}

export const useSelectedProfileStore = create<SelectedProfileState>((set) => ({
  selectedId: null,
  selectedType: null,
  routingTarget: null,
  setSelected: (id, type) => set({ selectedId: id, selectedType: type }),
  setRoutingTarget: (id) => set({ routingTarget: id }),
  clearSelected: () => set({ selectedId: null, selectedType: null, routingTarget: null }),
}));
