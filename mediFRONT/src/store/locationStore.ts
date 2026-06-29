import { create } from 'zustand';

interface LocationState {
  userCoords: [number, number] | null;
  setUserCoords: (coords: [number, number]) => void;
  clearUserCoords: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  userCoords: null,
  setUserCoords: (coords) => set({ userCoords: coords }),
  clearUserCoords: () => set({ userCoords: null }),
}));
